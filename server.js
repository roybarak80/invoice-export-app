const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({
  '/api/invoices': '/invoices',
  '/api/invoices/upload-pdf': '/invoices'
}));
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
