const uws = require("uWebSockets.js");
const { route } = require("@stansom/usher");

const PORT = 3000;

const routes = [
  {
    path: "/",
    methods: {
      GET: (_req) => {
        return {
          status: 200,
          body: `Hello from uWS `,
        };
      },
    },
  },
];

uws
  .App()
  .get("/*", async (res, req) => {
    res.onAborted(() => {
      res.aborted = true;
    });

    const url = req.getUrl().trim();
    const method = req.getMethod();
    const headers = {};

    req.forEach((k, v) => {
      headers[k] = v;
    });

    let r = await route(routes, { url, method, headers });

    if (!res.aborted) {
      res.cork(() => {
        res.end(r.body);
      });
    }
  })
  .listen(PORT, (token) => {
    if (token) {
      console.log("Listening on port " + PORT);
    } else {
      console.log("Failed to listen on port " + PORT);
    }
  });
