# USHER

## A simple routing library for JavaScript browser and server-side, inspired by Clojure libraries.

There are two main functions for controlling your routes:

- `route(routesArray, request)` is the async version of the route function
- `routeSync(routesArray, request)` is the same function, but sync
- **routesArray** is an array of routes objects, <br>
  the objects are in the form: <br>

```javascript
{
   path: '/some/route/',
   methods?: {
       GET: ({ pathParams: params }) => ({
            status: 200,
            body: `Hi ${params.name}!`}),
       POST: (params) => ({
            status: 200,
            body: "The user has been added!"}),
   },
   response?: ({ pathParams: params }) =>
        <><h1>Hello from the browser</h1></>
}
```

Where:

- **path** is a path as a string, <br>
- **methods** is an optional object, used mainly on the server side, it contains method name and function to respond. <br>
  The methods can be: "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "PATCH"
- **response** is an optional function, it's commonly used for frontend.
- **pathParams** that are passed to the response functions are extracted from a route based on a given path, for example: <br>
  > "/user/:name" extracts the :name from the "/user/john" route and passes it to the response function, so it can be used like this: <br>
  >
  > ```javascript
  > (request) =>
  >   `Hello, user ${request.pathParams.name}. And welcome to the site.`;
  > // returns "Hello, user john. And welcome to the site.
  > ```
  >
  > "/user/:name/:surname?" where surname is an optional parameter, the route function will try to match it and if not will return the param with a null value.
  >
  > ```javascript
  > ({ pathParams: params }) => {
  >   return `Hello ${params.name}${
  >     params.surname ? ` with surname ${params.surname}` : "."
  >   }`;
  > };
  > // matching route "/name/jay/surname/rutanga"
  > // returns "Hello jay with surname rutanga
  > // matching route "/name/jay"
  > // returns "Hello jay.
  > ```

### For the server-side it looks like this:

> ```javascript
> const routes = [
>   {
>     path: "/home/",
>     methods: {
>       GET: () => {
>         return {
>           status: 200,
>           body: "Hello from the home route!",
>         };
>       },
>     },
>   },
>   {
>     path: "/user/:id",
>     methods: {
>       GET: ({ pathParams: { id } }) => {
>         return {
>           status: 200,
>           body: `Hi user ${id}! How are you doing?`,
>         };
>       },
>     },
>   },
> ];
> ```
>
> request is an object in that form:
>
> ```javascript
> const request = {
>   path: "/home/",
>   method: "GET",
> };
> ```
>
> You need to convert the Deno Request in this way:
>
> ```javascript
>
> function extractPathFromRequestURL(req: Request): string {
>   const regex = /http\:\/\/.*\:\d+/gm;
>   const replaced = req.url.replace(regex, "");
>   return replaced;
> }
>
> function requestConverter(req: Request): IRequest {
>   const url = extractPathFromRequestURL(req);
>
>   return {
>     method: req.method,
>     url,
>     body: req.body,
>     headers: req.headers,
>   };
> }
> ```
>
> Just call the route function with a routes array and a request object to get a response object <br>
> which can be used in any server, watch [the node example](examples/node/README.MD) for
> NodeJS in the examples directory. <br>
> These examples are also available:
>
> - [Deno](examples/deno/)
> - [React](examples/react/)
> - [uWebSockets](examples/uWebSockets/)
>
> ```javascript
> async function handler(req: Request): Promise<Response> {
>   const extractedReq = requestConverter(req);
>   const routeResp = await route(routes, extractedReq);
>   const resp = new Response(routeResp.body, { status: routeResp.status });
>
>   return resp;
> }
> (function main() {
>   Deno.serve({ port }, handler);
> })();
>
> // response is:
> // {
> //    status: 200,
> //    body: "hello from the home route!",
> // };
> ```

---

## SUMMARY:

**In summary,** the route functions take an array of routes and a path object, and return the response when the paths are matched or `{ status: 404, body: "Not found" }` object if there are no matched routes.<br>
This means that you can return anything from the 'response' function and handle a request in a very flexible way.
