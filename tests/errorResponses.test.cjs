const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const app = require('../dist/app.js').default;
const { handleError } = require('../dist/middleware/errorHandlers.js');
const { serve } = require('./helpers/http.cjs');

function expectError(response, status, code) {
  assert.equal(response.status, status);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, code);
  assert.equal(typeof response.body.error.message, 'string');
  assert.equal(response.body.error.stack, undefined);
}

test('returns JSON for unknown endpoints and missing resources', async (t) => {
  const request = await serve(t, app);
  for (const path of ['/api/v1/missing', '/api/v1/menu-items/item_101/extra', '/api/v1/menu-items/item_999']) {
    const response = await request('GET', path);
    expectError(response, 404, 'NOT_FOUND');
    assert.equal(response.body.error.details, undefined);
  }
});

test('returns field details for malformed JSON without echoing the body', async (t) => {
  const request = await serve(t, app);
  const response = await request('POST', '/api/v1/menu-items', {
    headers: { 'Content-Type': 'application/json' },
    body: '{"private-value":',
  });
  expectError(response, 400, 'VALIDATION_ERROR');
  assert.equal(response.body.error.details[0].field, 'body');
  assert.ok(!response.text.includes('private-value'));
});

test('returns JSON when the parser rejects oversized or unsupported bodies', async (t) => {
  const request = await serve(t, app);
  const oversized = await request('POST', '/api/v1/menu-items', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: 'a'.repeat(103000) }),
  });
  expectError(oversized, 413, 'VALIDATION_ERROR');
  const charset = await request('POST', '/api/v1/menu-items', {
    headers: { 'Content-Type': 'application/json; charset=iso-8859-1' }, body: '{}',
  });
  expectError(charset, 415, 'VALIDATION_ERROR');
  const encoding = await request('POST', '/api/v1/menu-items', {
    headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'unknown' }, body: '{}',
  });
  expectError(encoding, 415, 'VALIDATION_ERROR');
});

test('returns JSON for malformed URL encoding', async (t) => {
  const request = await serve(t, app);
  const response = await request('GET', '/api/v1/menu-items/%E0%A4%A');
  expectError(response, 400, 'VALIDATION_ERROR');
  assert.equal(response.body.error.details[0].field, 'path');
});

test('treats corrupt compressed request bodies as client errors', async (t) => {
  const request = await serve(t, app);
  const response = await request('POST', '/api/v1/menu-items', {
    headers: { 'Content-Type': 'application/json', 'Content-Encoding': 'gzip' },
    body: 'This is not gzip data',
  });
  expectError(response, 400, 'VALIDATION_ERROR');
  assert.equal(response.body.error.details[0].field, 'body');
});

test('hides unexpected errors and logs diagnostic information on the server', async (t) => {
  const failure = new Error('Internal path C:/private/database with secret-value');
  const failingApp = express();
  failingApp.get('/fail', () => { throw failure; });
  failingApp.use(handleError);
  const log = t.mock.method(console, 'error', () => {});
  const request = await serve(t, failingApp);
  const response = await request('GET', '/fail');
  expectError(response, 500, 'INTERNAL_ERROR');
  assert.equal(response.body.error.details, undefined);
  assert.ok(!response.text.includes('secret-value'));
  assert.ok(!response.text.includes('C:/private'));
  assert.equal(log.mock.calls.length, 1);
  assert.equal(log.mock.calls[0].arguments[1], failure);
});

test('delegates errors when response headers were already sent', () => {
  const failure = new Error('Response already started');
  let forwarded;
  handleError(failure, {}, { headersSent: true }, (error) => { forwarded = error; });
  assert.equal(forwarded, failure);
});

test('the assembled app still enforces strict bearer credentials', async (t) => {
  const request = await serve(t, app);
  expectError(await request('GET', '/api/v1/menu-items', {
    headers: { Authorization: 'Bearer admin-token extra' },
  }), 401, 'UNAUTHORIZED');
  assert.equal((await request('GET', '/api/v1/menu-items')).status, 200);
});
