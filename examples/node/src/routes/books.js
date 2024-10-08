function BooksRouteGet(req) {
  const { pathParams: params } = req;

  const id = params.get("id");
  const commentId = params.get("commentId");

  if (id && commentId) {
    return {
      status: 200,
      body: JSON.stringify({
        book: id,
        comment: commentId,
      }),
      headers: ["Content-Type", "application/json"],
    };
  } else if (id) {
    return {
      status: 200,
      body: "Book " + id,
      headers: ["Content-Type", "text/plain"],
    };
  } else if (commentId) {
    return {
      status: 200,
      body: "Comment " + commentId,
      headers: ["Content-Type", "text/plain"],
    };
  }
  return {
    status: 200,
    body: "No params provided",
    headers: ["Content-Type", "text/plain"],
  };
}

function BooksRoutePost(req) {
  const { pathParams: params } = req;

  const id = params.get("id");
  const commentId = params.get("commentId");

  if (id && commentId) {
    return {
      status: 200,
      body: `A book ${id} with comment ${commentId} was created`,
      headers: ["Content-Type", "text/plain"],
    };
  }
}

module.exports = { BooksRouteGet, BooksRoutePost };
