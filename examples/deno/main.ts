import { route } from "../deno-usher/src/index.ts";
import type { IRequest, IRoute } from "../deno-usher/src/types.ts";

const port = 8080;

const routes: IRoute[] = [
  {
    path: "/",
    methods: {
      GET: (_req) => {
        return { status: 200, body: "Hello from Usher" };
      },
    },
  },
  {
    path: "/user/:name",
    methods: {
      GET: (req) => {
        return {
          status: 200,
          body: `Hello ${req.pathParams?.get("name")} user-agent: ${(
            req.headers as Headers
          )?.get("user-agent")}`,
        };
      },
    },
  },
];

function extractPathFromRequestURL(req: Request): string {
  const regex = /http\:\/\/.*\:\d+/gm;
  const replaced = req.url.replace(regex, "");
  return replaced;
}

function requestConverter(req: Request): IRequest {
  const url = extractPathFromRequestURL(req);

  return {
    method: req.method,
    url,
    body: req.body,
    headers: req.headers,
  };
}

async function handler(req: Request): Promise<Response> {
  const extractedReq = requestConverter(req);
  const routeResp = await route(routes, extractedReq);
  const resp = new Response(routeResp.body, { status: routeResp.status });

  return resp;
}

(function main() {
  Deno.serve({ port }, handler);
})();
