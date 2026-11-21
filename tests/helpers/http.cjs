async function serve(t, app) {
  const server = app.listen(0, '127.0.0.1');
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  }));
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return async (method, path, options = {}) => {
    const response = await fetch(base + path, {
      method,
      headers: { Authorization: 'Bearer admin-token', ...options.headers },
      body: options.body,
    });
    const text = await response.text();
    return {
      status: response.status,
      headers: response.headers,
      text,
      body: text ? JSON.parse(text) : undefined,
    };
  };
}

module.exports = { serve };
