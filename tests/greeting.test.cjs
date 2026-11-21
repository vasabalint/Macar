const assert = require('node:assert/strict');
const { test } = require('node:test');
const app = require('../dist/app.js').default;
const { serve } = require('./helpers/http.cjs');

test('greeting is a public HTML page with the required project sections', async (t) => {
  const request = await serve(t, app);
  const response = await request('GET', '/api/v1/greeting', {
    headers: { Authorization: '' },
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^text\/html; charset=utf-8$/);
  assert.match(response.text, /^<!DOCTYPE html>/);
  assert.match(response.text, /<html lang="en">/);
  assert.match(response.text, /<title>Macar/);
  for (const text of ['restaurant owners and managers', 'Student ID', 'Contribution',
    'API running (v1)', '/api/v1/menu-items', '/api/v1/menu-items/:id']) {
    assert.ok(response.text.includes(text), `Missing page content: ${text}`);
  }
});

test('greeting supports HEAD and OPTIONS and rejects unsupported methods', async (t) => {
  const request = await serve(t, app);
  const head = await request('HEAD', '/api/v1/greeting');
  assert.equal(head.status, 200);
  assert.match(head.headers.get('content-type'), /^text\/html/);
  assert.equal(head.text, '');
  const options = await request('OPTIONS', '/api/v1/greeting');
  assert.equal(options.status, 204);
  assert.equal(options.headers.get('allow'), 'GET, HEAD, OPTIONS');
  const post = await request('POST', '/api/v1/greeting');
  assert.equal(post.status, 405);
  assert.equal(post.body.error.code, 'METHOD_NOT_ALLOWED');
});

test('the public greeting does not bypass menu-item authentication', async (t) => {
  const request = await serve(t, app);
  assert.equal((await request('GET', '/api/v1/greeting', {
    headers: { Authorization: 'Bearer invalid-token' },
  })).status, 200);
  const items = await request('GET', '/api/v1/menu-items', {
    headers: { Authorization: '' },
  });
  assert.equal(items.status, 401);
  assert.equal(items.body.error.code, 'UNAUTHORIZED');
  assert.equal((await request('GET', '/api/v1/greeting/unknown')).status, 404);
});
