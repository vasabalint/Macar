const assert = require('node:assert/strict');
const { test } = require('node:test');
const { authenticate } = require('../dist/middleware/authenticate.js');

function check(header) {
  const req = { headers: { authorization: header } };
  const result = { nextCalled: false };
  const res = {
    status(status) { result.status = status; return this; },
    json(body) { result.body = body; return this; },
  };
  authenticate(req, res, () => { result.nextCalled = true; });
  return { ...result, user: req.user };
}

test('rejects missing, invalid and malformed bearer credentials', () => {
  for (const header of [undefined, '', ' ', 'Bearer', 'Bearer unknown-token',
    'Basic admin-token', 'Bearer admin-token extra', 'Bearer admin-token,',
    'Bearer admin-token Bearer user-a-token']) {
    const result = check(header);
    assert.equal(result.status, 401, String(header));
    assert.equal(result.body.success, false);
    assert.equal(result.body.error.code, 'UNAUTHORIZED');
    assert.equal(result.nextCalled, false);
    assert.equal(result.user, undefined);
  }
});

test('accepts valid mock tokens and a case-insensitive bearer scheme', () => {
  for (const [header, id] of [
    ['Bearer user-a-token', 'user-a'],
    ['Bearer user-b-token', 'user-b'],
    ['Bearer admin-token', 'admin'],
    ['  bEaReR   admin-token  ', 'admin'],
  ]) {
    const result = check(header);
    assert.equal(result.nextCalled, true);
    assert.equal(result.status, undefined);
    assert.equal(result.user.id, id);
  }
});
