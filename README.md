# Macar

Macar is a restaurant operations project for managing menus, recipes, stock, suppliers, sales, and staff schedules. The full project is still being developed. This repository's running API prototype covers menu items, with mock users, access control, validation, and an HTML greeting page.

## Install and run

You need Git, Node.js, and npm. Development and tests have been run with Node.js 24. No database, API keys, or `.env` file are needed for this prototype.

```sh
git clone https://github.com/vasabalint/Macar.git
cd Macar
npm ci
npm run dev
```

Open [the greeting page](http://localhost:3000/api/v1/greeting) in your browser. The default port is `3000`. The dev command restarts the server when source files change; stop it with Ctrl+C.

To build and run the compiled version instead:

```sh
npm run build
npm start
```

To use another port, set `PORT` before starting. In PowerShell:

```powershell
$env:PORT = '3001'
npm run dev
```

The examples below assume port `3000`. Run only one server on a given port.

## What you can try

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/v1/greeting` | Project overview, team details, and expandable API examples |
| GET | `/api/v1/menu-items` | List items with pagination and category filtering |
| GET | `/api/v1/menu-items/:id` | Get one item |
| POST | `/api/v1/menu-items` | Create an item |
| PUT | `/api/v1/menu-items/:id` | Replace an item's editable fields |
| DELETE | `/api/v1/menu-items/:id` | Delete an item |

The greeting page is public. All menu-item routes need a bearer token:

| User | Token | Access |
| --- | --- | --- |
| User A | `user-a-token` | Only their own items |
| User B | `user-b-token` | Only their own items |
| Administrator | `admin-token` | All items |

These are mock tokens included for the assignment. There is no login endpoint.

For example, in PowerShell:

```powershell
Invoke-RestMethod 'http://localhost:3000/api/v1/menu-items' -Headers @{ Authorization = 'Bearer user-a-token' }
```

Or with curl (`curl.exe` in Windows PowerShell):

```sh
curl -H "Authorization: Bearer user-a-token" http://localhost:3000/api/v1/menu-items
```

In Postman, select **Authorization > Bearer Token** and paste a token. For POST and PUT, select **Body > raw > JSON**.

See [API.md](API.md) for field rules, responses, and errors. [requests.http](requests.http) contains example requests for CRUD, validation, authentication, and ownership checks. You can send them with a REST client that supports `.http` files, or copy them into Postman. They are not sent automatically.

## Mock data and scope

The server starts with three items owned by User A (`item_101` to `item_103`) and three owned by User B (`item_201` to `item_203`). `item_999` does not exist in the initial data and can demonstrate a 404.

Data is stored in memory. **All changes reset when the server restarts**, including restarts triggered by the dev watcher. New IDs start at `item_301` in a fresh process.

Regular users get 404 when requesting another user's item, so the response does not reveal whether a private item exists. Administrators can read, update, and delete any owner's items. An item created by the administrator belongs to the administrator.

Inventory, sales, staff scheduling, AI summaries, and a persistent database are not connected to this API yet. The root-level food-cost and inventory calculations are separate from the API; the TypeScript build compiles `server/`.

## Tests

```sh
npm test
```

This compiles the server and runs Node's test runner. Tests cover validation, duplicate handling, authentication, error responses, supported methods, and the greeting endpoint. HTTP tests use temporary ports and their own process data, so they do not change the server running on port 3000.

## Team

| Member | Student ID | Main work |
| --- | --- | --- |
| Bilal Hasanov | 17533 | Worked on validation, duplicate checks, and error handling, and tightened token parsing. Built the greeting page and its endpoint examples, and wrote tests for the API. |
| Basam Ismaeel | 18973 | Set up the backend in Express and TypeScript and added the mock data. Wrote the menu-item CRUD routes, token authentication, and ownership checks, including filtering and pagination. |
| Balint Vasa | 27721 | Started the project structure and wrote the recipe and food-cost calculations. Added menu-item profit calculations and the weighted average cost calculation used for inventory. |

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the responsibilities of each member.

### Commit counts

Output of `git shortlog -sn --all` when this draft was written, at commit `ec54bbc`:

```text
    16	vasabalint
     9	bilalhasanov2005
     5	basamismaeel070-afk
     5	bismaeel18973
     3	Bilal Hasanov
```

The command groups commits by recorded author name, so one person may appear under more than one name. These are the names reported by Git; they are not a count of team members. Refresh this output after the final commits before submission.

## Demo video

—
