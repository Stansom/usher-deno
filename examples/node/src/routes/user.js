function UserRoute({ pathParams: params }) {
  if (params.id) {
    return {
      status: 200,
      body: "User " + params.id,
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
