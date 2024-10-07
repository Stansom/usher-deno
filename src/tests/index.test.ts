import { assertEquals } from "@std/assert";
import { route, routeSync } from "../index.ts";
import type { IRequest, IResponse, IRoute } from "../types.ts";

// Should return a valid response when a matching route with a response is found
Deno.test(
  "should return a valid response when a matching route with a response is found",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        response: (params: IRequest) => {
          return {
            body: `User ${params.pathParams?.get("id")} found`,
            status: 200,
          };
        },
      },
      {
        path: "/users",
        response: (_req) => {
          return { body: "All users found", status: 200 };
        },
      },
    ];

    const pathObject: IRequest = {
      url: "/users/123",
      method: "GET",
    };

    const expectedResponse = { body: "User 123 found", status: 200 };
    const actualResponse = await route(routes, pathObject);
    const actualResponseBody = actualResponse;

    assertEquals(actualResponseBody, expectedResponse);
  }
);

// TODO: Test for method uppercase transformation
// Deno.test(
//   "should not fail when method name in IRoute is in lowercase",
//   async () => {
//     const routes: IRoute[] = [
//       {
//         path: "/users",
//         methods: {
//           get: (_req) => {
//             return { body: "All users found", status: 200 };
//           },
//         },
//       },
//     ];
//     const pathObject: IRequest = {
//       url: "/users",
//       method: "GET",
//     };
//
//     const actualResponse = await route(routes, pathObject);
//     assertEquals(actualResponse, { status: 200, body: "All users found" });
//   }
// );

// Should handle empty routes correctly
Deno.test("should handle empty routes correctly", async () => {
  const routes: IRoute[] = [];

  const pathObject: IRequest = {
    url: "/users",
    method: "GET",
  };

  const expectedResponse = { status: 404, body: "Not found" };
  const actualResponse = await route(routes, pathObject);

  assertEquals(actualResponse, expectedResponse);
});

// Should return a 404 response when no matching route is found
Deno.test(
  "should return a 404 response when no matching route is found",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        response: (params) => {
          return {
            body: `User ${params.pathParams?.get("id")} found`,
            status: 200,
          };
        },
      },
      {
        path: "/users",
        response: () => {
          return { body: "All users found", status: 200 };
        },
      },
    ];

    const pathObject: IRequest = {
      url: "/posts",
      method: "GET",
    };

    const expectedResponse: IResponse = { status: 404, body: "Not found" };
    const actualResponse = await route(routes, pathObject);

    assertEquals(actualResponse, expectedResponse);
  }
);

// Should handle routes with optional parameters correctly
Deno.test(
  "should handle routes with optional parameters correctly",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id?",
        response: (params) => {
          if (params.pathParams?.get("id")) {
            return {
              body: `User ${params.pathParams?.get("id")} found`,
              status: 200,
            };
          } else {
            return { body: "All users found", status: 200 };
          }
        },
      },
    ];

    const pathObject1: IRequest = {
      url: "/users",
      method: "GET",
    };

    const pathObject2: IRequest = {
      url: "/users/123",
      method: "GET",
    };

    const expectedResponse1: IResponse = {
      status: 200,
      body: "All users found",
    };

    const expectedResponse2: IResponse = {
      status: 200,
      body: "User 123 found",
    };

    const actualResponse1 = await route(routes, pathObject1);
    const actualResponse2 = await route(routes, pathObject2);

    assertEquals(actualResponse1, expectedResponse1);
    assertEquals(actualResponse2, expectedResponse2);
  }
);

// Should handle routes with multiple parameters correctly
Deno.test(
  "should handle routes with multiple parameters correctly",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id/posts/:postId",
        response: (params) => {
          return {
            body: `Post ${params.pathParams?.get("postId")} of User ${params.pathParams?.get(
              "id"
            )} found`,
            status: 200,
          };
        },
      },
    ];

    const pathObject: IRequest = {
      url: "/users/123/posts/456",
      method: "GET",
    };

    const expectedResponse: IResponse = {
      body: "Post 456 of User 123 found",
      status: 200,
    };

    const actualResponse = await route(routes, pathObject);

    assertEquals(actualResponse, expectedResponse);
  }
);

Deno.test("should handle react routes correctly", () => {
  const routes: IRoute[] = [
    {
      path: "/users/:id/posts/:postId",
      response: (params) => {
        return {
          body: `Post ${params.pathParams?.get(
            "postId"
          )} of User ${params.pathParams?.get("id")} found`,
          status: 200,
        };
      },
    },
    {
      path: "/",
      response: () => {
        return { status: 200, body: "Main func" };
      },
    },
  ];

  const actualResponse = routeSync(routes, {
    url: "/users/123/posts/456",
  });
  const actualResponse2 = routeSync(routes, {
    url: "",
  });

  const expectedResponse: IResponse = {
    body: "Post 456 of User 123 found",
    status: 200,
  };
  const expectedResponse2: IResponse = { body: "Main func", status: 200 };

  assertEquals(actualResponse, expectedResponse);
  assertEquals(actualResponse2, expectedResponse2);
});

Deno.test(
  "should return a response object when a valid route and method are provided",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id",
        methods: {
          GET: (params) => {
            return {
              body: `User ${params.pathParams?.get("id")} found`,
              status: 200,
            };
          },
        },
      },
    ];
    const pathObject: IRequest = {
      url: "/users/123",
      method: "GET",
    };

    const result = await route(routes, pathObject);

    assertEquals(result, { status: 200, body: "User 123 found" });
  }
);

// Should handle route paths with empty strings
Deno.test("should handle route paths with empty strings", async () => {
  const routes: IRoute[] = [
    {
      path: "",
      methods: {
        GET: () => {
          return { status: 200, body: "Empty route" };
        },
      },
    },
  ];
  const pathObject: IRequest = { url: "", method: "GET" };

  const result = await route(routes, pathObject);

  assertEquals(result, { status: 200, body: "Empty route" });
});

Deno.test(
  "should handle routes with optional parameters correctly",
  async () => {
    const routes: IRoute[] = [
      {
        path: "/users/:id?",
        response: (req) => {
          if (req.pathParams?.get("id")) {
            return {
              status: 200,
              body: `User ${req.pathParams.get("id")} found`,
            };
          } else {
            return { status: 200, body: "All users found" };
          }
        },
      },
    ];

    const pathObject1: IRequest = {
      url: "/users",
      method: "GET",
    };

    const pathObject2: IRequest = {
      url: "/users/123",
      method: "GET",
    };

    const expectedResponse1: IResponse = {
      status: 200,
      body: "All users found",
    };

    const expectedResponse2: IResponse = {
      status: 200,
      body: "User 123 found",
    };

    const actualResponse1 = await route(routes, pathObject1);
    const actualResponse2 = await route(routes, pathObject2);

    assertEquals(actualResponse1, expectedResponse1);
    assertEquals(actualResponse2, expectedResponse2);
  }
);

Deno.test("should handle wildcard routes correctly", async () => {
  const routes: IRoute[] = [
    {
      path: "/user/:user*",
      methods: {
        GET: (req) => {
          return {
            body: `The wildcard params are ${req.pathParams?.get("user")}`,
            status: 200,
          };
        },
      },
    },
  ];
  const response = await route(routes, {
    url: "/user/all/wildcard/goes/here",
    method: "GET",
  });
  const expectedResponse: IResponse = {
    body: "The wildcard params are all/wildcard/goes/here",
    status: 200,
  };

  assertEquals(response, expectedResponse);
});
