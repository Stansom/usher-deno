const { route } = require("@stansom/usher");
const { createServer } = require("node:http");
const { routes } = require("./routes/routes");

const serverAddress = "127.0.0.1";
const serverPort = 3030;

function convertRequest(req) {
  return {
    method: req.method,
    url: req.url,
    headers: { ...req.headers },
    body: req.body,
  };
}

const server = createServer(async (req, res) => {
  const { status, body, headers } = await route(routes, convertRequest(req));

  res.statusCode = status;
  res.setHeader(...(headers || "Content-Type"), "text/plain");
  res.end(body);
});

server.listen(serverPort, serverAddress, () => {
  console.log(`The server is running at http://${serverAddress}:${serverPort}`);
});
