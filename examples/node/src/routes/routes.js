const { HomeRoute } = require("./main");
const { UserRoute } = require("./user");
const { BooksRouteGet, BooksRoutePost } = require("./books");
const { GreetUser } = require("./greetuser");

const routes = [
  {
    path: "/",
    methods: {
      GET: HomeRoute,
    },
  },
  // {
  //   path: "/user/:id?",
  //   methods: {
  //     GET: UserRoute,
  //   },
  // },
  {
    path: "/book/:id?/comment/:commentId?",
    methods: {
      GET: BooksRouteGet,
      POST: BooksRoutePost,
    },
  },
  {
    path: "/user/:name/:surname?",
    methods: {
      GET: GreetUser,
    },
  },
];

module.exports = { routes };
