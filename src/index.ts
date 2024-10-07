import type { IRequest, IResponse, IRoute } from "./types.ts";

const NOTFOUND_RESPONSE: IResponse = {
  status: 404,
  body: "Not found",
};

/**
 * Produces a regular expression from the given route string.
 *
 * @param {string} rt - The route string to split.
 * @return {RegExp} The regular expression pattern generated from the route string.
 * @example `pathToRegex("/foo/:id?")` returns /foo/([^/]+)?
 * @example `pathToRegex("/foo/:id")` returns /foo/([^/]+)
 * @example `pathToRegex("/:foo*")` returns /(.*)?
 */
function pathToRegex(rt: string): RegExp {
  const pt = rt.split("/").filter((s) => s.length > 0);
  if (rt.length === 0 || pt.length === 0) {
    return new RegExp("^/$", "g");
  }

  if (rt.includes("*")) {
    const colonIndex = rt.indexOf(":");
    const starIndex = rt.indexOf("*");

    const paramKey = rt.substring(colonIndex + 1, starIndex);
    const pattern = `/${paramKey}/(?<${paramKey}>${rt
      .substring(colonIndex)
      .replace(/.*/, "(.*)?")})`;

    return new RegExp(pattern, "g");
  }

  const ret = pt
    .map((s, i) => {
      return s.startsWith(":") && !s.endsWith("?")
        ? `(?<${s.substring(1)}>[^/]+/?)`
        : s.startsWith(":") && s.endsWith("?")
          ? `(?<${s.substring(1, s.length - 1)}>[^/]*/?)`
          : i === 0
            ? `^/${s}/?`
            : `${s}/?`;
    })
    .join("");
  return new RegExp(ret, "g");
}

/**
 * Splits the given route path by "/" and removes empty elements.
 *
 * @param {string} path - The route path to be split.
 * @return {string} The modified route path with "/" added at the beginning and end.
 * @example `splitPath("foo/bar")` returns /foo/bar/
 */
function splitPath(path: string): string {
  if (path === "/" || path === "" || !path) {
    return "/";
  }

  const sp = path.split("/").filter((s) => s.length > 0);

  return `/${sp.join("/")}/`;
}

/**
 * A function to match the route with the path.
 *
 * @param {string} route - The route to match.
 * @param {string} path - The path to match against the route.
 * @return {boolean} Returns true if the path matches the route, false otherwise.
 * @example `match("/test/:id", "/test/444")` returns true
 * @example `match("/test/:id", "/test")` returns false
 */
function match(route: string, path: string): boolean {
  const sp = splitPath(path);
  const sr = pathToRegex(route);
  const matched = sr.test(sp);

  return matched;
}

/**
 * Returns an array of params extracted from the given route and path.
 *
 * @param {string} route - The route string containing path segments.
 * @param {string} path - The path string to extract values from.
 * @return {Array} An array of values extracted from the route and path.
 * @example `extractParams("/foo/:id/:name?", "/foo/444/john")` returns {id: 444, name: "john"}
 * @example `extractParams("/foo/:id/:name?", "/foo/444")` returns {id: 444, name: null}
 */
function extractParams(
  route: string,
  path: string
): Map<string, string | null> {
  const regexp = pathToRegex(route);
  const matcher = regexp.exec(path);

  if (matcher && matcher.groups) {
    const removeTrailingSlash = ([k, v]: [string, string]): [
      string,
      string,
    ] => [k, v.endsWith("/") ? v.slice(0, -1) : v];
    return new Map(Object.entries(matcher.groups).map(removeTrailingSlash));
  }

  return new Map();
}

/**
 * Asynchronously routes a request based on the provided route and request object, calls the corresponding method in the route object with the extracted params from the url, and returns the response.
 *
 * @param {IRoute} routeObject - The route object containing information about the route.
 * @param {IPath} request - The path object containing information about the path.
 * @return {IResponse} The response object from the routed request.
 * @example `routeOne({path: "/foo/:id", methods: {GET: () => ({status: 200, body: "foo"})}}, {url: "/foo/444"})`
 * returns {status: 200, body: "foo"}
 */
async function routeOne(
  routeObject: IRoute,
  request: IRequest
): Promise<IResponse> {
  const extractedParams = extractParams(routeObject.path, request.url || "");
  const params: IRequest = {
    ...request,
    pathParams: extractedParams,
  };

  if (routeObject.methods && request.method) {
    const resp = await routeObject.methods[request.method](params);
    return resp;
  }
  return routeObject.response
    ? routeObject.response(params)
    : NOTFOUND_RESPONSE;
}

function routeOneSync(routeObject: IRoute, request: IRequest): IResponse {
  const extractedParams = extractParams(routeObject.path, request.url || "");
  const params: IRequest = {
    ...request,
    pathParams: extractedParams,
  };

  if (routeObject.methods && request.method) {
    const resp = routeObject.methods[request.method](params);
    return resp as IResponse;
  }
  return routeObject.response
    ? routeObject.response(params)
    : NOTFOUND_RESPONSE;
}

function _keyToUpper(obj: object): object {
  return Object.keys(obj).reduce(
    (acc, k) => {
      acc[k.toUpperCase()] = (obj as { [key: string]: unknown })[k];
      return acc;
    },
    {} as { [key: string]: unknown }
  );
}

function findRoute(routes: IRoute[], request: IRequest): IRoute | undefined {
  const url = request.url;

  // TODO: check for bad method key, making the uppercase
  // const routesUpper: IRoute[] = routes.map((route) => {
  //   if (route.methods) {
  //     const upperMethods = keyToUpper(route.methods);
  //     return { ...route, methods: upperMethods } as IRoute;
  //   }
  //   return route;
  // });

  return routes.find((r: IRoute) => {
    return (
      match(r.path, url) &&
      (r.methods
        ? r.methods[request.method as string]
        : typeof r.response === "function")
    );
  });
}

/**
 * Routes the given request to the appropriate route based on the provided uri and method.
 *
 * @param {IRoute[]} routes - An array of route objects representing the available routes.
 * @param {IRequest} request - The path object containing the path and method to be routed.
 * @return {Promise<IResponse>} A promise that resolves to the response object for the routed path.
 */
export async function route(
  routes: IRoute[],
  request: IRequest
): Promise<IResponse> {
  const req = { ...request };
  if (request.method) {
    req.method = request.method.toUpperCase();
  }
  const rt = findRoute(routes, req);

  return rt ? await routeOne(rt, req) : NOTFOUND_RESPONSE;
}

export function routeSync(routes: IRoute[], request: IRequest): IResponse {
  const rt = findRoute(routes, request);
  const req = { ...request };
  if (request.method) {
    req.method = request.method.toUpperCase();
  }

  return rt ? routeOneSync(rt, request) : NOTFOUND_RESPONSE;
}
