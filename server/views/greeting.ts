export const renderGreetingPage = (endpointDetails = { styles: '', content: '' }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Macar is a restaurant management API prototype for managing menu items, prices, and availability.">
  <title>Macar — Restaurant management API</title>
  <style>
    :root { color-scheme: light; --paper: #f7f5ed; --ink: #293529; --muted: #626958; --line: #d7dacb; --orange: #b54224; --olive: #e8ebdb; }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 24px; }
    body { margin: 0; background: var(--paper); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
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
    .hero { display: grid; grid-template-columns: 1.3fr 1fr; align-items: center; gap: 60px; padding: 72px 0 76px; }
    h1 { margin: 0; max-width: 660px; font-weight: 600; font-size: clamp(42px, 5vw, 64px); line-height: 1.12; letter-spacing: -2.5px; }
    .intro { max-width: 470px; margin: 25px 0 30px; color: var(--muted); font-size: 15px; line-height: 1.8; }
    .service { position: relative; overflow: hidden; background: var(--olive); padding: 30px; border: 1px solid #d4d9c3; }
    .service-top { display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; }
    .version { padding: 5px 8px; border: 1px solid #afb89c; letter-spacing: 0; font-family: monospace; font-size: 12px; }
    .plate { display: grid; place-items: center; width: 184px; height: 184px; margin: 28px auto; border: 1px solid #aab594; border-radius: 50%; }
    .plate-inner { display: grid; place-items: center; width: 150px; height: 150px; border: 1px solid #aab594; border-radius: 50%; }
    .plate span { color: var(--orange); font-size: 68px; font-weight: 600; letter-spacing: -5px; }
    .service-title { font-size: 28px; font-weight: 500; margin: 0 0 12px; letter-spacing: -1px; }
    .service-foot { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-top: 18px; border-top: 1px solid #c2cbb1; color: #4e5a44; font-size: 11px; }
    .section { border-top: 1px solid var(--line); padding: 40px 0 48px; }
    .section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 24px; margin-bottom: 24px; }
    h2 { margin: 0; font-size: 28px; font-weight: 550; letter-spacing: -.8px; }
    .section-note { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
    .endpoint-list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
    .endpoint { display: grid; grid-template-columns: 82px minmax(0, 1.2fr) minmax(0, 1fr); gap: 20px; align-items: center; padding: 19px 0; border-bottom: 1px solid var(--line); }
    .method { display: inline-block; justify-self: start; color: #345533; font: bold 12px Consolas, monospace; letter-spacing: .3px; }
    .method.post { color: #344d7a; }
    .method.put { color: #775119; }
    .method.delete { color: #963a24; }
    code { font-family: Consolas, 'Courier New', monospace; }
    .path { font-size: 13px; overflow-wrap: anywhere; }
    .endpoint p, .endpoint-description { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.6; }
    .endpoint small { display: inline-block; margin-left: 8px; color: var(--orange); font-size: 11px; }
    .access { display: grid; grid-template-columns: 1fr 1fr; gap: 36px; padding: 22px 0 0; }
    .access p { color: var(--muted); font-size: 12px; line-height: 1.8; margin: 0; }
    .access code { color: var(--ink); font-size: 11px; overflow-wrap: anywhere; }
    .team { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
    .member { padding: 24px; border: 1px solid var(--line); }
    .member-label { margin: 0 0 22px; color: var(--muted); font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; }
    .member h3 { margin: 0 0 20px; font-size: 26px; font-weight: 500; }
    dl { margin: 0; font-size: 12px; }
    dt { color: var(--muted); margin-top: 14px; }
    dd { margin: 5px 0 0; }
    footer { display: flex; justify-content: space-between; gap: 20px; padding: 24px 0 32px; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; }
    footer span:first-child { color: var(--ink); }
    @media (max-width: 760px) {
      .wrap { width: calc(100% - 40px); }
      header { padding: 22px 0; }
      nav { gap: 18px; }
      nav .status { display: none; }
      .hero { grid-template-columns: 1fr; gap: 36px; padding: 48px 0; }
      h1 { letter-spacing: -2px; }
      .intro { max-width: 100%; }
      .service { padding: 24px; }
      .plate { width: 150px; height: 150px; margin: 20px auto; }
      .plate-inner { width: 122px; height: 122px; }
      .section-head { flex-direction: column; gap: 12px; }
      .endpoint { grid-template-columns: 62px minmax(0, 1fr); gap: 10px 14px; }
      .endpoint p { grid-column: 2; }
      .path { font-size: 12px; }
      .access, .team { grid-template-columns: 1fr; gap: 16px; }
      .member { padding: 20px; }
      .member-label { margin-bottom: 12px; }
      footer { flex-wrap: wrap; line-height: 1.8; }
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
        <span class="status"><span class="dot" aria-hidden="true"></span>API running</span>
      </nav>
    </header>
    <main id="main">
      <section class="hero" aria-labelledby="welcome">
        <div>
          <h1 id="welcome">Welcome to Macar.</h1>
          <p class="intro">Macar helps restaurant owners and managers organize menu items, manage selling prices, and update availability.</p>
        </div>
        <aside class="service" aria-label="API service status">
          <div class="service-top"><span>SERVICE STATUS</span><span class="version">v1</span></div>
          <div class="plate" aria-hidden="true"><div class="plate-inner"><span>m.</span></div></div>
          <p class="service-title">API status</p>
          <div class="service-foot"><span class="status"><span class="dot" aria-hidden="true"></span>API running</span></div>
        </aside>
      </section>
      <section id="endpoints" class="section" aria-labelledby="endpoints-title">
        <div class="section-head">
          <h2 id="endpoints-title">Available endpoints</h2>
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
        <div class="access">
          <p>Menu-item routes require <code>Authorization: Bearer &lt;token&gt;</code>. Regular users manage their own items; administrators can manage all items.</p>
          <p><code>:id</code> is an item's ID, for example <code>item_101</code>. GET routes also support HEAD. Menu-item routes support OPTIONS to list allowed methods.</p>
        </div>
      </section>
      <section id="team" class="section" aria-labelledby="team-title">
        <div class="section-head"><h2 id="team-title">Team members</h2><p class="section-note">Team details to be completed before submission.</p></div>
        <div class="team">
          <article class="member"><p class="member-label">Team member</p><h3 aria-label="Name pending">—</h3><dl><dt>Student ID</dt><dd>—</dd><dt>Contribution</dt><dd>—</dd></dl></article>
          <article class="member"><p class="member-label">Team member</p><h3 aria-label="Name pending">—</h3><dl><dt>Student ID</dt><dd>—</dd><dt>Contribution</dt><dd>—</dd></dl></article>
          <article class="member"><p class="member-label">Team member</p><h3 aria-label="Name pending">—</h3><dl><dt>Student ID</dt><dd>—</dd><dt>Contribution</dt><dd>—</dd></dl></article>
        </div>
      </section>
    </main>
    <footer><span>Macar · Restaurant management</span><span>API v1 · Assignment 2</span><a href="https://github.com/vasabalint/Macar">View source ↗</a></footer>
  </div>
</body>
</html>`;
