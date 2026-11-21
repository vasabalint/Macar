export const renderGreetingPage = (endpointDetails = { styles: '', content: '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Macar is a restaurant operations and analytics platform in development, covering menus, recipes, inventory, suppliers, sales, and staff schedules. This API prototype focuses on menu-item management.">
  <title>Macar — Restaurant management API</title>
  <style>
    :root { color-scheme: light; --paper: #f7f5ed; --ink: #293529; --muted: #626958; --line: #d7dacb; --orange: #b54224; --olive: #e8ebdb; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 24px; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-underline-offset: 4px; }
    a:focus-visible { outline: 3px solid var(--orange); outline-offset: 5px; }
    .skip { position: absolute; left: 16px; top: -100px; padding: 12px; background: white; z-index: 2; }
    .skip:focus { top: 12px; }
    .wrap { width: min(1120px, calc(100% - 80px)); margin: 0 auto; }
    header { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--line); }
    .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; font-size: 30px; font-weight: 650; letter-spacing: -1.5px; }
    .mark { width: 31px; height: 31px; border: 2px solid var(--orange); border-radius: 50%; display: grid; place-items: center; }
    .mark::after { content: ''; width: 15px; height: 15px; border: 1px solid var(--orange); border-radius: 50%; }
    nav { display: flex; align-items: center; gap: 28px; font-size: 13px; }
    nav a { text-decoration: none; }
    nav a:hover { color: var(--orange); text-decoration: underline; }
    .status { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: bold; }
    .dot { width: 7px; height: 7px; flex-shrink: 0; background: #487444; border-radius: 50%; }
    .hero { padding: 52px 0 48px; }
    .hero > .status { margin-bottom: 20px; }
    h1 { margin: 0; max-width: 660px; font-weight: 600; font-size: clamp(42px, 5vw, 64px); line-height: 1.12; letter-spacing: -2.5px; }
    .intro { max-width: 760px; margin: 25px 0 0; color: var(--muted); font-size: 15px; line-height: 1.8; }
    .intro p { margin: 0 0 16px; }
    .intro p:last-child { margin-bottom: 0; }
    .section { border-top: 1px solid var(--line); padding: 40px 0 48px; }
    .section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
    h2 { margin: 0; font-size: 28px; font-weight: 550; letter-spacing: -.8px; }
    .section-note { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
    .endpoint-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
    .endpoint { display: grid; grid-template-columns: 82px minmax(0, 1.2fr) minmax(0, 1fr); gap: 20px; align-items: center; padding: 19px 0; border-bottom: 1px solid var(--line); }
    .method { display: inline-block; justify-self: start; color: #345533; font: 600 12px Arial, Helvetica, sans-serif; letter-spacing: .3px; }
    .method.post { color: #344d7a; }
    .method.put { color: #775119; }
    .method.delete { color: #963a24; }
    code { font-family: Consolas, 'Courier New', monospace; }
    .path { font-size: 13px; overflow-wrap: anywhere; }
    .endpoint p, .endpoint-description { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
    .endpoint small { display: inline-block; margin-left: 8px; color: var(--orange); font-size: 11px; }
    .team { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    .member { padding: 24px; border: 1px solid var(--line); }
    .member h3 { margin: 0 0 20px; font-size: 26px; font-weight: 500; }
    dl { margin: 0; font-size: 12px; }
    dt { color: var(--muted); margin-top: 14px; }
    dd { margin: 5px 0 0; line-height: 1.7; }
    @media (max-width: 760px) {
      .wrap { width: calc(100% - 40px); }
      header { padding: 22px 0; }
      nav { gap: 18px; }
      nav .status { display: none; }
      .hero { padding: 40px 0; }
      h1 { letter-spacing: -2px; }
      .intro { max-width: 100%; }
      .section-head { flex-direction: column; gap: 12px; }
      .endpoint { grid-template-columns: 62px minmax(0, 1fr); gap: 10px 14px; }
      .endpoint p { grid-column: 2; }
      .path { font-size: 12px; }
      .team { grid-template-columns: 1fr; gap: 16px; }
      .member { padding: 20px; }
    }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
    ${endpointDetails.styles}
  </style>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <div class="wrap">
    <header>
      <a class="brand" href="/api/v1/greeting" aria-label="Macar home"><span class="mark" aria-hidden="true"></span>macar.</a>
      <nav aria-label="Main navigation">
        <a href="#endpoints">Endpoints</a>
        <a href="#team">The team</a>
        <span class="status"><span class="dot" aria-hidden="true"></span>API running (v1)</span>
      </nav>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="welcome">
        <span class="status"><span class="dot" aria-hidden="true"></span>API running (v1)</span>
        <div>
          <h1 id="welcome">Welcome to Macar.</h1>
          <div class="intro">
            <p>Macar is a web app we’re building for restaurant owners and managers. The idea is to keep menus, recipes, stock, suppliers, sales, and staff schedules in one place. Staff would record sales and deliveries, and managers could see what ingredients are running low, how much each dish costs to make, and how much it earns.</p>
            <p>We also plan to add sales reports and AI-generated summaries to help managers spot changes in costs and stock. For now, this prototype handles menu items: users can add dishes, edit prices, update availability, and delete items. Each user manages their own menu, while an administrator can access all items.</p>
          </div>
        </div>
      </section>
      <section id="endpoints" class="section" aria-labelledby="endpoints-title">
        <div class="section-head">
          <h2 id="endpoints-title">Endpoints</h2>
          <p class="section-note">Base path: <code>/api/v1</code></p>
        </div>
        ${endpointDetails.content || `<ul class="endpoint-list" aria-label="Available API endpoints">
          <li class="endpoint"><span class="method">GET</span><code class="path">/api/v1/greeting <small>(public)</small></code><p>Open this project overview in your browser.</p></li>
          <li class="endpoint"><span class="method">GET</span><code class="path">/api/v1/menu-items</code><p>List accessible items, with pagination and category filtering.</p></li>
          <li class="endpoint"><span class="method">GET</span><code class="path">/api/v1/menu-items/:id</code><p>Retrieve a single menu item you can access.</p></li>
          <li class="endpoint"><span class="method post">POST</span><code class="path">/api/v1/menu-items</code><p>Create a menu item owned by the current user.</p></li>
          <li class="endpoint"><span class="method put">PUT</span><code class="path">/api/v1/menu-items/:id</code><p>Replace an existing item's editable details.</p></li>
          <li class="endpoint"><span class="method delete">DELETE</span><code class="path">/api/v1/menu-items/:id</code><p>Remove a menu item you can access.</p></li>
        </ul>`}
      </section>
      <section id="team" class="section" aria-labelledby="team-title">
        <div class="section-head"><h2 id="team-title">Team members</h2></div>
        <div class="team">
          <article class="member"><h3>Bilal Hasanov</h3><dl><dt>Student ID</dt><dd>17533</dd><dt>Contribution</dt><dd>Worked on validation, duplicate checks, and error handling, and tightened token parsing. Built the greeting page and its endpoint examples, and wrote tests for the API.</dd></dl></article>
          <article class="member"><h3>Basam Ismaeel</h3><dl><dt>Student ID</dt><dd>18973</dd><dt>Contribution</dt><dd>Set up the backend in Express and TypeScript and added the mock data. Wrote the menu-item CRUD routes, token authentication, and ownership checks, including filtering and pagination.</dd></dl></article>
          <article class="member"><h3>Balint Vasa</h3><dl><dt>Student ID</dt><dd>27721</dd><dt>Contribution</dt><dd>Started the project structure and wrote the recipe and food-cost calculations. Added menu-item profit calculations and the weighted average cost calculation used for inventory.</dd></dl></article>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;
