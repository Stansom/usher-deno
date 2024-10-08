function UserRoute(req) {
  const { pathParams: params } = req;

  const id = params.get("id");
  if (id) {
    return {
      status: 200,
      body: `The user's ${id} user-agent is ${
        req.headers["user-agent"].split("/")[0]
      }`,
      headers: ["Content-Type", "text/plain"],
    };
  }
  return {
    status: 200,
    body: "No params provided",
    headers: ["Content-Type", "text/plain"],
  };
}

module.exports = { UserRoute };
