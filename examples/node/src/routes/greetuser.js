function GreetUser(req) {
  const { pathParams: params } = req;
  const name = params.get("name");
  const surname = params.get("surname");

  return {
    status: 200,
    body: `Hi ${name}${surname || "."}`,
  };
}

module.exports = { GreetUser };
