# Macar API v1

Base URL: `http://localhost:3000/api/v1`

Data resets when the server restarts. The examples start with fresh data. Use the ID returned by POST for the later update and delete requests.

## Authentication

The greeting page is public. All menu-item routes need a bearer token:

```http
Authorization: Bearer user-a-token
```

| Token | Access |
| --- | --- |
| `user-a-token` | User A's items |
| `user-b-token` | User B's items |
| `admin-token` | All items |

Users create items under their own account. An item created by the admin belongs to the admin. Another user's private item returns 404 instead of 403, so the response does not reveal whether it exists.

POST and PUT also need `Content-Type: application/json` and a JSON object as the body. JSON responses use `application/json; charset=utf-8`.

## Field rules

POST and PUT use the same fields:

| Field | Type | Required | Rule/default |
| --- | --- | --- | --- |
| `name` | string | Yes | 3–100 characters after trimming |
| `category` | string | Yes | `starter`, `main`, `dessert`, or `drink` |
| `sellingPrice` | number | Yes | Finite and at least 0; numeric strings are rejected |
| `description` | string | No | Up to 1,000 trimmed characters; defaults to `""` |
| `isAvailable` | boolean | No | Defaults to `true` |

Wrong types, `null`, and unknown fields return 400. The server sets `id`, `ownerId`, `createdAt`, and `updatedAt`; do not send these fields.

Names must be unique per owner, ignoring case and repeated whitespace. Duplicates return 409. An item can keep its name during an update.

PUT replaces the editable fields: send all required fields again. Omitted optional fields return to their defaults. The ID, owner, and creation timestamp stay the same.

## GET /greeting

Public. No parameters or body. Returns the project description, team, endpoints, API status, and version.

```http
GET /api/v1/greeting
```

**200**, `Content-Type: text/html; charset=utf-8`. Abbreviated response:

```html
<!DOCTYPE html>
<html lang="en">
  <head><title>Macar: Restaurant management API</title></head>
  <body><!-- Greeting page content --></body>
</html>
```

## GET /menu-items

Any valid token. Lists accessible items. No body or path parameters.

| Query | Default | Rule |
| --- | --- | --- |
| `page` | `1` | Positive safe integer, digits only |
| `perPage` | `10` | Whole number from 1 to 50 |
| `category` | All categories | One of the four categories above |

Invalid or repeated values return 400. Empty pages return `data: []`. `total` counts matching items before pagination.

```http
GET /api/v1/menu-items?page=1&perPage=10&category=starter
Authorization: Bearer user-a-token
```

**200**:

```json
{
  "success": true,
  "message": "Menu items retrieved successfully.",
  "data": [{"id": "item_101", "name": "Lentil Soup", "category": "starter", "sellingPrice": 6.5, "description": "Red lentil soup with lemon and toasted bread.", "isAvailable": true, "ownerId": "user-a", "createdAt": "2026-11-20T10:00:00.000Z", "updatedAt": "2026-11-20T10:00:00.000Z"}],
  "meta": {"total": 1, "page": 1, "perPage": 10}
}
```

Errors: 400 for invalid queries; 401 for credentials. Shared errors below also apply.

## GET /menu-items/:id

Owner or admin. Replace `:id` with an item ID. No query parameters or body.

```http
GET /api/v1/menu-items/item_101
Authorization: Bearer user-a-token
```

**200**:

```json
{
  "success": true,
  "message": "Menu item retrieved successfully.",
  "data": {"id": "item_101", "name": "Lentil Soup", "category": "starter", "sellingPrice": 6.5, "description": "Red lentil soup with lemon and toasted bread.", "isAvailable": true, "ownerId": "user-a", "createdAt": "2026-11-20T10:00:00.000Z", "updatedAt": "2026-11-20T10:00:00.000Z"}
}
```

Errors: 401 for credentials; 404 for a missing or inaccessible item. Shared errors also apply.

## POST /menu-items

Any valid token. Creates an item owned by the caller. No path or query parameters. The body follows the field rules above.

```http
POST /api/v1/menu-items
Authorization: Bearer user-a-token
Content-Type: application/json

{"name": "Tomato Soup", "category": "starter", "sellingPrice": 7}
```

**201**:

```json
{
  "success": true,
  "message": "Menu item created successfully.",
  "data": {"id": "item_301", "name": "Tomato Soup", "category": "starter", "sellingPrice": 7, "description": "", "isAvailable": true, "ownerId": "user-a", "createdAt": "2026-11-21T16:00:00.000Z", "updatedAt": "2026-11-21T16:00:00.000Z"}
}
```

Errors: 400 for invalid fields; 401 for credentials; 409 for a duplicate name. Shared errors also apply.

## PUT /menu-items/:id

Owner or admin. `:id` must identify an accessible item. No query parameters. Send the required body fields and any optional fields you want to keep.

```http
PUT /api/v1/menu-items/item_301
Authorization: Bearer user-a-token
Content-Type: application/json

{"name": "Tomato Soup", "category": "starter", "sellingPrice": 8, "isAvailable": false}
```

**200**:

```json
{
  "success": true,
  "message": "Menu item updated successfully.",
  "data": {"id": "item_301", "name": "Tomato Soup", "category": "starter", "sellingPrice": 8, "description": "", "isAvailable": false, "ownerId": "user-a", "createdAt": "2026-11-21T16:00:00.000Z", "updatedAt": "2026-11-21T16:05:00.000Z"}
}
```

Errors: 400 for invalid fields; 401 for credentials; 404 for a missing or inaccessible item; 409 for a duplicate name. Shared errors also apply.

## DELETE /menu-items/:id

Owner or admin. `:id` must identify an accessible item. No query parameters or body.

```http
DELETE /api/v1/menu-items/item_301
Authorization: Bearer user-a-token
```

**200**:

```json
{"success": true, "message": "Menu item deleted successfully.", "data": null}
```

Errors: 401 for credentials; 404 for a missing or inaccessible item. Shared errors also apply.

## Errors and supported methods

Errors return `success: false` with a code and message. Only validation errors include field details:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid or missing fields.",
    "details": [{"field": "sellingPrice", "message": "Selling price is required and must be a finite number of at least 0."}]
  }
}
```

| Status | Code | Cause |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Invalid fields or queries, malformed JSON, unreadable body, or invalid path encoding |
| 401 | `UNAUTHORIZED` | Missing, malformed, or invalid bearer token |
| 404 | `NOT_FOUND` | Missing/private item or unknown endpoint |
| 405 | `METHOD_NOT_ALLOWED` | Unsupported method; response includes `Allow` |
| 409 | `CONFLICT` | Name already used by the same owner |
| 413 | `VALIDATION_ERROR` | JSON body exceeds 100 KiB |
| 415 | `VALIDATION_ERROR` | Unsupported body encoding or charset |
| 500 | `INTERNAL_ERROR` | Unexpected server error; internal details are not returned |

Parser/path errors, 405, and 500 can apply to any endpoint, including the greeting. JSON parsing happens before authentication.

HEAD works on GET routes without returning a body. OPTIONS returns 204 with the allowed methods. Menu-item HEAD and OPTIONS requests still need a token.

| Path | Allowed methods |
| --- | --- |
| `/greeting` | GET, HEAD, OPTIONS |
| `/menu-items` | GET, HEAD, POST, OPTIONS |
| `/menu-items/:id` | GET, HEAD, PUT, DELETE, OPTIONS |

See [requests.http](../examples/requests.http) for runnable examples, including failure cases.
