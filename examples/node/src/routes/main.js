function HomeRoute() {
  return {
    status: 200,
    body: "Main route",
    headers: ["Content-Type", "text/plain"],
  };
}

module.exports = { HomeRoute };
