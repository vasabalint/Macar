const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');
const { authenticate } = require('../dist/middleware/authenticate.js');
const router = require('../dist/routes/menuItems.js').default;
const { menuItems } = require('../dist/data/menuItems.js');

test('duplicate handling through the HTTP API', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/menu-items', authenticate, router);
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const initialItems = structuredClone(menuItems);
  t.beforeEach(() => menuItems.splice(0, menuItems.length, ...structuredClone(initialItems)));
  t.after(() => menuItems.splice(0, menuItems.length, ...initialItems));
  const base = `http://127.0.0.1:${server.address().port}/api/v1/menu-items`;

  async function request(method, path, name, token = 'user-a-token') {
    const response = await fetch(base + path, {
      method,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category: 'starter', sellingPrice: 7 }),
    });
    return { status: response.status, body: await response.json() };
  }

  function expectConflict(response) {
    assert.equal(response.status, 409);
    assert.deepEqual(response.body, {
      success: false,
      error: { code: 'CONFLICT', message: 'A menu item with this name already exists for this owner.' },
    });
  }

  await t.test('rejects exact, case and whitespace duplicates without adding items', async () => {
    for (const name of ['Lentil Soup', 'LENTIL SOUP', '  lentil  soup  ', 'Lentil\tSoup']) {
      expectConflict(await request('POST', '', name));
    }
    assert.deepEqual(menuItems, initialItems);
  });

  await t.test('allows the same name for different owners', async () => {
    const response = await request('POST', '', 'Lentil Soup', 'user-b-token');
    assert.equal(response.status, 201);
    assert.equal(response.body.data.ownerId, 'user-b');
  });

  await t.test('rejects a conflicting update without changing any fields or timestamps', async () => {
    expectConflict(await request('PUT', '/item_102', 'lentil soup'));
    assert.deepEqual(menuItems, initialItems);
  });

  await t.test('allows retaining a name and renaming to an unused name', async () => {
    assert.equal((await request('PUT', '/item_101', 'LENTIL SOUP')).status, 200);
    assert.equal((await request('PUT', '/item_101', 'Tomato Soup')).status, 200);
    assert.equal((await request('POST', '', 'Lentil Soup')).status, 201);
  });

  await t.test('checks the resource owner when an admin updates another user item', async () => {
    expectConflict(await request('PUT', '/item_102', 'Lentil Soup', 'admin-token'));
    assert.equal((await request('PUT', '/item_101', 'Beef Burger', 'admin-token')).status, 200);
  });

  await t.test('admin creation uses the admin own menu for uniqueness', async () => {
    const created = await request('POST', '', 'Lentil Soup', 'admin-token');
    assert.equal(created.status, 201);
    assert.equal(created.body.data.ownerId, 'admin');
    expectConflict(await request('POST', '', 'lentil soup', 'admin-token'));
  });

  await t.test('keeps validation and ownership errors ahead of duplicate checks', async () => {
    assert.equal((await request('POST', '', 'ab')).status, 400);
    assert.equal((await request('PUT', '/item_201', 'Lentil Soup')).status, 404);
    assert.equal((await request('PUT', '/item_999', 'Lentil Soup')).status, 404);
    assert.deepEqual(menuItems, initialItems);
  });
});
