const assert = require('node:assert/strict');
const { test } = require('node:test');
const { validateMenuItemBody } = require('../dist/validation/menuItem.js');

const validBody = { name: 'Lentil Soup', category: 'starter', sellingPrice: 6.5 };

function expectInvalid(body, fields) {
  const result = validateMenuItemBody(body);
  assert.equal(result.valid, false);
  assert.deepEqual(result.details.map((detail) => detail.field).sort(), [...fields].sort());
  assert.ok(result.details.every((detail) => detail.message.length > 0));
}

test('requires an object and all required fields', () => {
  for (const body of [undefined, null, [], 'soup', 1, true]) {
    expectInvalid(body, ['body']);
  }
  expectInvalid({}, ['name', 'category', 'sellingPrice']);
});

test('validates name types and trimmed length boundaries', () => {
  for (const name of [null, 10, true, [], {}, '', '   ', 'ab', ' ab ', 'a'.repeat(101)]) {
    expectInvalid({ ...validBody, name }, ['name']);
  }
  for (const name of ['abc', 'a'.repeat(100), '  abc  ']) {
    const result = validateMenuItemBody({ ...validBody, name });
    assert.equal(result.valid, true);
    assert.equal(result.value.name, name.trim());
  }
});

test('accepts only the four supported categories', () => {
  for (const category of ['starter', 'main', 'dessert', 'drink']) {
    assert.equal(validateMenuItemBody({ ...validBody, category }).valid, true);
  }
  for (const category of [null, 1, ['starter'], 'Starter', ' main ', 'other']) {
    expectInvalid({ ...validBody, category }, ['category']);
  }
});

test('requires finite nonnegative numeric prices without coercion', () => {
  for (const sellingPrice of [undefined, null, '6.5', true, [], {}, -0.01, NaN, Infinity, -Infinity]) {
    expectInvalid({ ...validBody, sellingPrice }, ['sellingPrice']);
  }
  for (const sellingPrice of [0, 0.01, 6.5]) {
    assert.equal(validateMenuItemBody({ ...validBody, sellingPrice }).valid, true);
  }
});

test('validates optional description type and trimmed maximum length', () => {
  for (const description of [undefined, null, 1, true, [], {}, 'a'.repeat(1001)]) {
    expectInvalid({ ...validBody, description }, ['description']);
  }
  for (const description of ['', '   ', 'a'.repeat(1000), `  ${'a'.repeat(1000)}  `]) {
    const result = validateMenuItemBody({ ...validBody, description });
    assert.equal(result.valid, true);
    assert.equal(result.value.description, description.trim());
  }
});

test('requires an actual boolean when availability is supplied', () => {
  for (const isAvailable of [undefined, null, 0, 1, 'false', [], {}]) {
    expectInvalid({ ...validBody, isAvailable }, ['isAvailable']);
  }
  for (const isAvailable of [true, false]) {
    const result = validateMenuItemBody({ ...validBody, isAvailable });
    assert.equal(result.valid, true);
    assert.equal(result.value.isAvailable, isAvailable);
  }
});

test('defaults optional fields only when omitted', () => {
  assert.deepEqual(validateMenuItemBody(validBody), {
    valid: true,
    value: { ...validBody, description: '', isAvailable: true },
  });
});

test('rejects unknown and server-managed fields and reports multiple problems', () => {
  for (const field of ['id', 'ownerId', 'createdAt', 'updatedAt', 'sellingprice']) {
    expectInvalid({ ...validBody, [field]: 'override' }, [field]);
  }
  expectInvalid(JSON.parse('{"name":"Soup","category":"starter","sellingPrice":1,"__proto__":{}}'), ['__proto__']);
  expectInvalid({ ...validBody, name: '', sellingPrice: -1, isAvailable: 'yes' }, [
    'name', 'sellingPrice', 'isAvailable',
  ]);
});
