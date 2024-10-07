function GreetUser({ pathParams: params }) {
  console.log(params);
  return {
    status: 200,
    body: `Hi ${params.name}${params.surname ? params.surname : "."}`,
  };
}

module.exports = { GreetUser };
