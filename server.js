const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/invoices": "/invoices",
  })
);
server.use(router);

server.listen(3000, () => {
  console.log("JSON Server is running on port 3000");
});
