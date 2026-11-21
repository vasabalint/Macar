// These are illustrative contract examples, not requests sent to the running API.
const item = {
	id: 'item_101', name: 'Lentil Soup', category: 'starter', sellingPrice: 6.5,
	description: 'Red lentil soup with lemon and toasted bread.', isAvailable: true,
	ownerId: 'user-a', createdAt: '2026-11-20T10:00:00.000Z', updatedAt: '2026-11-20T10:00:00.000Z',
};
const input = {
	name: 'Tomato Soup', category: 'starter', sellingPrice: 7,
	description: 'Tomato soup with toasted bread.', isAvailable: true,
};
const unauthorized = [401, 'UNAUTHORIZED', 'Authentication token is missing. Send it as "Authorization: Bearer <token>".'];
const missing = [404, 'NOT_FOUND', 'Menu item with id "item_999" was not found.'];
const conflict = [409, 'CONFLICT', 'A menu item with this name already exists for this owner.'];
const invalid = [400, 'VALIDATION_ERROR', 'The request contains invalid or missing fields.'];
const success = (message: string, data: unknown) => ({ success: true, message, data });

interface EndpointExample {
	method: string;
	path: string;
	description: string;
	request: string;
	status: number;
	response: unknown;
	errors: (string | number)[][];
}

const examples: EndpointExample[] = [
	{
		method: 'GET', path: '/api/v1/greeting',
		description: 'Open this project overview in your browser.',
		request: 'GET /api/v1/greeting', status: 200,
		response: '<!DOCTYPE html>\n<html lang="en">\n  <!-- Macar project overview -->\n</html>', errors: [],
	},
	{
		method: 'GET', path: '/api/v1/menu-items',
		description: 'List accessible items, with pagination and category filtering.',
		request: 'GET /api/v1/menu-items?page=1&perPage=10&category=starter', status: 200,
		response: { ...success('Menu items retrieved successfully.', [item]), meta: { total: 1, page: 1, perPage: 10 } },
		errors: [unauthorized, [400, 'VALIDATION_ERROR', 'The request contains invalid query parameters.']],
	},
	{
		method: 'GET', path: '/api/v1/menu-items/:id',
		description: 'Retrieve a single menu item you can access.',
		request: 'GET /api/v1/menu-items/item_101', status: 200,
		response: success('Menu item retrieved successfully.', item), errors: [unauthorized, missing],
	},
	{
		method: 'POST', path: '/api/v1/menu-items',
		description: 'Create a menu item owned by the current user.',
		request: 'POST /api/v1/menu-items', status: 201,
		response: success('Menu item created successfully.', { ...item, ...input, id: 'item_301' }),
		errors: [unauthorized, invalid, conflict],
	},
	{
		method: 'PUT', path: '/api/v1/menu-items/:id',
		description: "Replace an existing item's editable details.",
		request: 'PUT /api/v1/menu-items/item_101', status: 200,
		response: success('Menu item updated successfully.', { ...item, ...input, updatedAt: '2026-11-20T11:00:00.000Z' }),
		errors: [unauthorized, missing, invalid, conflict],
	},
	{
		method: 'DELETE', path: '/api/v1/menu-items/:id',
		description: 'Remove a menu item you can access.',
		request: 'DELETE /api/v1/menu-items/item_101', status: 200,
		response: success('Menu item deleted successfully.', null), errors: [unauthorized, missing],
	},
];

function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightJson(value: unknown): string {
	const json = JSON.stringify(value, null, 2);
	return json.replace(/"(?:\\.|[^"\\])*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|\b(?:true|false|null)\b|[{}\[\],:]/g, (token, offset: number) => {
		let type = 'punctuation';
		if (token.startsWith('"')) {
			type = json.slice(offset + token.length).trimStart().startsWith(':') ? 'key' : 'string';
		} else if (/^-?\d/.test(token)) {
			type = 'number';
		} else if (token === 'true' || token === 'false' || token === 'null') {
			type = 'literal';
		}
		return `<span class="json-${type}">${escapeHtml(token)}</span>`;
	});
}

const content = examples.map((example) => {
	const isPublic = example.path === '/api/v1/greeting';
	let request = example.request;
	if (!isPublic) request += '\nAuthorization: Bearer user-a-token';
	if (example.method === 'POST' || example.method === 'PUT') {
		request += '\nContent-Type: application/json';
	}
	const requestHtml = escapeHtml(request) + (example.method === 'POST' || example.method === 'PUT'
		? '\n\n' + highlightJson(input) : '');
	const response = typeof example.response === 'string' ? escapeHtml(example.response) : highlightJson(example.response);
	const errors = example.errors.map(([status, code, message]) =>
		`<li><code>${status} ${code}</code><span>${escapeHtml(String(message))}</span></li>`
	).join('');
	return `<details class="endpoint-detail">
    <summary class="endpoint"><span class="method ${example.method.toLowerCase()}">${example.method}</span><code class="path">${example.path}${isPublic ? ' <small>(public)</small>' : ''}</code><span class="endpoint-description">${example.description}</span><span class="expand-icon" aria-hidden="true"></span></summary>
    <div class="detail-body">
      <div class="example-columns">
        <div><h3>Example request</h3><pre><code>${requestHtml}</code></pre></div>
        <div><h3>Example response (${example.status})</h3><pre><code>${response}</code></pre></div>
      </div>
      ${errors ? `<h3>Error messages</h3><ul class="error-examples">${errors}</ul>` : ''}
    </div>
  </details>`;
}).join('');

export const endpointDetails = {
	styles: `
    .endpoint-detail { border-bottom: 1px solid var(--line); }
    .endpoint-detail summary { grid-template-columns: 82px minmax(0, 1.2fr) minmax(0, 1fr) 16px; cursor: pointer; list-style: none; border-bottom: 0; }
    .endpoint-detail summary::-webkit-details-marker { display: none; }
    .expand-icon::after { content: '+'; font-size: 20px; color: var(--muted); }
    .endpoint-detail[open] .expand-icon::after { content: '−'; }
    .endpoint-detail summary:focus-visible { outline: 2px solid var(--orange); outline-offset: 4px; }
    .endpoint-detail summary > code { font-size: 13px; overflow-wrap: anywhere; }
    .json-key { color: #285d8c; }
    .json-string { color: #32633b; }
    .json-number { color: #95501a; }
    .json-literal { color: #80458b; }
    .json-punctuation { color: #626958; }
    .detail-body { padding-bottom: 24px; }
    .detail-body h3 { margin: 0 0 10px; font-size: 12px; font-weight: 600; }
    .example-columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; margin-bottom: 24px; }
    .example-columns pre { margin: 0; padding: 18px; background: #eeeee5; border: 1px solid var(--line); overflow: auto; font-size: 12px; line-height: 1.7; }
    .error-examples { list-style: none; padding: 0; margin: 0; }
    .error-examples li { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 16px; padding: 10px 0; font-size: 12px; line-height: 1.7; }
    .error-examples span { color: var(--muted); overflow-wrap: anywhere; }
    @media (max-width: 760px) {
      .example-columns { grid-template-columns: minmax(0, 1fr); }
      .endpoint-detail summary { grid-template-columns: 48px minmax(0, 1fr) 16px; gap: 10px 12px; }
      .endpoint-detail .endpoint-description { grid-column: 2; }
      .expand-icon { grid-column: 3; grid-row: 1 / span 2; align-self: center; }
      .endpoint-detail summary > code { font-size: 12px; }
      .error-examples li { grid-template-columns: 1fr; gap: 4px; }
    }
  `,
	content: `<div class="endpoint-list" aria-label="Available API endpoints">
    ${content}
  </div>`,
};
