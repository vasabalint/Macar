# Macar API v1

Default base URL: `http://localhost:3000/api/v1`.

The examples assume a fresh server. IDs and timestamps in create/update responses are illustrative; use the ID returned by your own POST request for later operations. Data resets on restart.

## Headers and access

`GET /greeting` is public. Every menu-item request requires:

```http
Authorization: Bearer user-a-token
```

| Token | Identity | Permissions |
| --- | --- | --- |
| `user-a-token` | `user-a` | Create items; list, read, update, and delete their own items |
| `user-b-token` | `user-b` | Create items; list, read, update, and delete their own items |
| `admin-token` | `admin` | Create items; list, read, update, and delete all owners' items |

The scheme `Bearer` is case-insensitive; tokens are case-sensitive. Exactly one token must follow the scheme. Missing, malformed, or invalid credentials return 401. There is no login, token issuance, or token expiry in this prototype.

POST and PUT requests must send a JSON object with `Content-Type: application/json`. The JSON body limit is 100 KiB (102,400 bytes); the error message calls this 100 KB. Use UTF-8. GET and DELETE requests need no body. There are no required query parameters except the path `:id` on item routes.

Regular users receive **404**, rather than 403, for another user's item. This keeps private item IDs from being exposed. List responses omit other users' items. An admin-created item belongs to `admin`; an admin update keeps the original owner.

## Response format

JSON success responses have `success: true`, a message, and `data` (an item, an array, or `null`). Lists also have `meta.total`, `meta.page`, and `meta.perPage`.

Errors use this shape:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing fields.",
    "details": [
      { "field": "sellingPrice", "message": "Selling price is required and must be a finite number of at least 0." }
    ]
  }
}
```

`details` is included for validation errors only. Other errors have `code` and `message`. The HTTP status agrees with `success`; internal stack traces and file paths are not returned. JSON responses use `application/json; charset=utf-8`. The greeting is HTML, and HEAD/OPTIONS responses have no body.

## Menu-item fields and validation

POST and PUT share these body rules:

| Field | Type | Required | Rule/default |
| --- | --- | --- | --- |
| `name` | string | Yes | 3–100 characters after trimming surrounding whitespace |
| `category` | string | Yes | Exactly `starter`, `main`, `dessert`, or `drink` |
| `sellingPrice` | number | Yes | Finite and at least zero; numeric strings are rejected |
| `description` | string | No | At most 1,000 characters after trimming; defaults to `""` |
| `isAvailable` | boolean | No | Defaults to `true`; strings such as `"false"` are rejected |

The body must be an object, not an array or `null`. Optional fields may be omitted, but an explicitly supplied `null` or wrong type fails validation. String lengths use JavaScript's string length. Prices have no extra two-decimal-place rule or configured maximum.

Only these five fields may be sent. Unknown fields, including `id`, `ownerId`, `createdAt`, and `updatedAt`, return 400. The server creates IDs and ISO timestamps and takes ownership from the token.

Names must be unique per owner, across categories. Comparison ignores case, surrounding whitespace, and repeated whitespace. `Lentil Soup` and ` LENTIL  SOUP ` conflict for the same owner (409). Different owners may use the same name. Updating an item excludes that item from the duplicate check. Stored names keep their capitalization and internal spacing, with surrounding whitespace removed.

**PUT replaces editable fields.** It is not a partial update: all required fields must be sent again, and omitted optional fields return to their defaults. The ID, owner, and creation timestamp stay the same; `updatedAt` changes.

## GET /greeting

Public. No parameters, authorization, or body required. Shows the project description, team, endpoint list, API status, and version. Additional request headers are not required.

```http
GET /api/v1/greeting HTTP/1.1
Host: localhost:3000
```

Response: **200**, `Content-Type: text/html; charset=utf-8`. Abbreviated HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Macar — Restaurant management API</title></head>
  <body><!-- Project overview, endpoints, status, and team --></body>
</html>
```

Errors: unsupported method → 405; unexpected server failure → 500. Shared parser errors below can apply if a body is supplied.

## GET /menu-items

Requires any valid mock token. No body or path parameters. Returns only accessible items, optionally filtered by category, then paginated.

| Query | Default | Validation |
| --- | --- | --- |
| `page` | `1` | Digits only; positive safe integer, at most 9,007,199,254,740,991 |
| `perPage` | `10` | Digits only; whole number from 1 to 50 |
| `category` | No filter | One supported category; case-sensitive |

Repeated values or array/object values for these parameters are rejected. Unknown query parameters are currently ignored. Empty results or a page beyond the available data return 200 with `data: []`. `total` counts matching accessible items before pagination.

```http
GET /api/v1/menu-items?page=1&perPage=10&category=starter HTTP/1.1
Host: localhost:3000
Authorization: Bearer user-a-token
```

Response: **200**.

```json
{
  "success": true,
  "message": "Menu items retrieved successfully.",
  "data": [
    {
      "id": "item_101",
      "name": "Lentil Soup",
      "category": "starter",
      "sellingPrice": 6.5,
      "description": "Red lentil soup with lemon and toasted bread.",
      "isAvailable": true,
      "ownerId": "user-a",
      "createdAt": "2026-11-20T10:00:00.000Z",
      "updatedAt": "2026-11-20T10:00:00.000Z"
    }
  ],
  "meta": { "total": 1, "page": 1, "perPage": 10 }
}
```

Errors: 400 for invalid queries; 401 for credentials; shared request/server errors below. Other methods on this path are covered under supported methods.

## GET /menu-items/:id

Requires the owner or an admin. `id` is the exact item ID, for example `item_101`. No body or query parameters are used. There is no separate ID-format rule: a well-encoded ID that cannot be found returns 404.

```http
GET /api/v1/menu-items/item_101 HTTP/1.1
Host: localhost:3000
Authorization: Bearer user-a-token
```

Response: **200**.

```json
{
  "success": true,
  "message": "Menu item retrieved successfully.",
  "data": {
    "id": "item_101",
    "name": "Lentil Soup",
    "category": "starter",
    "sellingPrice": 6.5,
    "description": "Red lentil soup with lemon and toasted bread.",
    "isAvailable": true,
    "ownerId": "user-a",
    "createdAt": "2026-11-20T10:00:00.000Z",
    "updatedAt": "2026-11-20T10:00:00.000Z"
  }
}
```

Errors: 401 for credentials; 404 for a missing or inaccessible item; shared errors below.

## POST /menu-items

Requires any valid mock token. Creates an item owned by the caller. No path or query parameters are used. Send a JSON body following the field rules above.

```http
POST /api/v1/menu-items HTTP/1.1
Host: localhost:3000
Authorization: Bearer user-a-token
Content-Type: application/json

{
  "name": "Tomato Soup",
  "category": "starter",
  "sellingPrice": 7,
  "description": "Tomato soup with toasted bread.",
  "isAvailable": true
}
```

Response: **201**.

```json
{
  "success": true,
  "message": "Menu item created successfully.",
  "data": {
    "id": "item_301",
    "name": "Tomato Soup",
    "category": "starter",
    "sellingPrice": 7,
    "description": "Tomato soup with toasted bread.",
    "isAvailable": true,
    "ownerId": "user-a",
    "createdAt": "2026-11-21T16:00:00.000Z",
    "updatedAt": "2026-11-21T16:00:00.000Z"
  }
}
```

Errors: 400 for invalid body fields; 401 for credentials; 409 for a duplicate name; shared errors below. Validation and duplicate checks happen before an item is added.

## PUT /menu-items/:id

Requires the owner or an admin. `id` identifies an existing accessible item. No query parameters are used. Send the complete editable JSON body; the POST validation rules and defaults apply.

```http
PUT /api/v1/menu-items/item_301 HTTP/1.1
Host: localhost:3000
Authorization: Bearer user-a-token
Content-Type: application/json

{
  "name": "Tomato Soup",
  "category": "starter",
  "sellingPrice": 8,
  "description": "Tomato soup with toasted bread.",
  "isAvailable": false
}
```

Response: **200**.

```json
{
  "success": true,
  "message": "Menu item updated successfully.",
  "data": {
    "id": "item_301",
    "name": "Tomato Soup",
    "category": "starter",
    "sellingPrice": 8,
    "description": "Tomato soup with toasted bread.",
    "isAvailable": false,
    "ownerId": "user-a",
    "createdAt": "2026-11-21T16:00:00.000Z",
    "updatedAt": "2026-11-21T16:05:00.000Z"
  }
}
```

Errors: 400 for invalid fields; 401 for credentials; 404 for a missing or inaccessible item; 409 for another item with the same owner/name; shared errors below. Existence/access checks precede field and duplicate checks. A rejected update does not change the item or its timestamps.

## DELETE /menu-items/:id

Requires the owner or an admin. `id` identifies an existing accessible item. No query parameters or body are used.

```http
DELETE /api/v1/menu-items/item_301 HTTP/1.1
Host: localhost:3000
Authorization: Bearer user-a-token
```

Response: **200**.

```json
{
  "success": true,
  "message": "Menu item deleted successfully.",
  "data": null
}
```

Errors: 401 for credentials; 404 for a missing or inaccessible item; shared errors below. Reading or deleting the same ID afterward returns 404.

## Supported methods

| Path | Allow header |
| --- | --- |
| `/api/v1/greeting` | `GET, HEAD, OPTIONS` |
| `/api/v1/menu-items` | `GET, HEAD, POST, OPTIONS` |
| `/api/v1/menu-items/:id` | `GET, HEAD, PUT, DELETE, OPTIONS` |

HEAD uses the GET status and headers without a body. OPTIONS returns 204 with `Allow` and no body. Menu-item HEAD and OPTIONS requests still need a valid token. Unsupported methods return 405 with the relevant `Allow` header; an unauthenticated menu-item request returns 401 first.

For example, PATCH on `/api/v1/menu-items/item_101`, with a valid token:

```json
{
  "success": false,
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "The HTTP method is not supported for this endpoint."
  }
}
```

## Error reference

All endpoint error lists above also include the shared parser, path, and server failures in this table where applicable. JSON parsing runs before authentication, so a malformed JSON body can return 400 even without a token.

| Status | Code | Condition and message |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid body fields: `The request contains invalid or missing fields.` |
| 400 | `VALIDATION_ERROR` | Invalid list queries: `The request contains invalid query parameters.` |
| 400 | `VALIDATION_ERROR` | Malformed JSON: `The request body contains invalid JSON.` |
| 400 | `VALIDATION_ERROR` | Malformed path encoding during route matching: `The request path contains invalid encoding.` |
| 400 | `VALIDATION_ERROR` | Other unreadable bodies, such as corrupt compressed data: `The request body could not be read.` |
| 401 | `UNAUTHORIZED` | Missing token: `Authentication token is missing. Send it as "Authorization: Bearer <token>".` |
| 401 | `UNAUTHORIZED` | Malformed header: `Authorization header must use the format "Bearer <token>".` |
| 401 | `UNAUTHORIZED` | Unknown token: `Authentication token is invalid.` |
| 404 | `NOT_FOUND` | Missing or inaccessible item: `Menu item with id "<requested-id>" was not found.` |
| 404 | `NOT_FOUND` | Unknown route: `The requested endpoint was not found.` |
| 405 | `METHOD_NOT_ALLOWED` | `The HTTP method is not supported for this endpoint.` |
| 409 | `CONFLICT` | `A menu item with this name already exists for this owner.` |
| 413 | `VALIDATION_ERROR` | `The request body exceeds the 100 KB limit.` |
| 415 | `VALIDATION_ERROR` | `The request body encoding is unsupported.` |
| 500 | `INTERNAL_ERROR` | `An unexpected server error occurred.` |

This prototype uses 404 for ownership failures, so it does not currently emit 403. Validation details identify the failing field, `body`, or `path`.

Example: User A requests User B's `item_201` (404):

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Menu item with id \"item_201\" was not found."
  }
}
```

Example: repeat a name for the same owner (409):

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "A menu item with this name already exists for this owner."
  }
}
```

For requests you can send yourself, use [requests.http](requests.http). Restart the server to restore the seed data before repeating the CRUD sequence.
