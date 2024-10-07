function BooksRouteGet({ pathParams: params }) {
  if (params.id && params.commentId) {
    return {
      status: 200,
      body: JSON.stringify({
        book: params.id,
        comment: params.commentId,
      }),
      headers: ["Content-Type", "application/json"],
    };
  } else if (params.id) {
    return {
      status: 200,
      body: "Book " + params.id,
      headers: ["Content-Type", "text/plain"],
    };
  } else if (params.commentId) {
    return {
      status: 200,
      body: "Comment " + params.commentId,
      headers: ["Content-Type", "text/plain"],
    };
  }
  return {
    status: 200,
    body: "No params provided",
    headers: ["Content-Type", "text/plain"],
  };
}

function BooksRoutePost({ pathParams: params }) {
  if (params.id && params.commentId) {
    return {
      status: 200,
      body: `A book ${params.id} with comment ${params.commentId} was created`,
      headers: ["Content-Type", "text/plain"],
    };
  }
}

module.exports = { BooksRouteGet, BooksRoutePost };
