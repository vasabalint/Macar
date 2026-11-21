const assert = require('node:assert/strict');
const { test } = require('node:test');
const app = require('../dist/app.js').default;
const { serve } = require('./helpers/http.cjs');

test('unsupported methods return 405 with endpoint-specific Allow headers', async (t) => {
  const request = await serve(t, app);
  const collection = '/api/v1/menu-items';
  const cases = [
    ['PUT', collection, 'GET, HEAD, POST, OPTIONS'],
    ['DELETE', collection, 'GET, HEAD, POST, OPTIONS'],
    ['PATCH', collection, 'GET, HEAD, POST, OPTIONS'],
    ['POST', collection + '/item_101', 'GET, HEAD, PUT, DELETE, OPTIONS'],
    ['PATCH', collection + '/item_101', 'GET, HEAD, PUT, DELETE, OPTIONS'],
  ];
  for (const [method, path, allow] of cases) {
    const response = await request(method, path);
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), allow);
    assert.equal(response.body.success, false);
    assert.equal(response.body.error.code, 'METHOD_NOT_ALLOWED');
    assert.match(response.headers.get('content-type'), /^application\/json/);
  }
});

test('OPTIONS reports allowed methods and HEAD keeps GET behavior without a body', async (t) => {
  const request = await serve(t, app);
  for (const path of ['/api/v1/menu-items', '/api/v1/menu-items/item_101']) {
    const options = await request('OPTIONS', path);
    assert.equal(options.status, 204);
    assert.ok(options.headers.get('allow').includes('OPTIONS'));
    assert.equal(options.text, '');
    const head = await request('HEAD', path);
    assert.equal(head.status, 200);
    assert.equal(head.text, '');
  }
});

test('unknown paths stay 404 and unsupported methods still require authentication', async (t) => {
  const request = await serve(t, app);
  assert.equal((await request('PATCH', '/api/v1/unknown')).status, 404);
  assert.equal((await request('PATCH', '/api/v1/menu-items/item_101/extra')).status, 404);
  const unauthenticated = await request('PATCH', '/api/v1/menu-items', {
    headers: { Authorization: '' },
  });
  assert.equal(unauthenticated.status, 401);
  assert.equal(unauthenticated.body.error.code, 'UNAUTHORIZED');
});
