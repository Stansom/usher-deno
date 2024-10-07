import React, { useState, useEffect } from "react";
import { routeSync } from "@stansom/usher";
import * as routing from "./routing";

import { Main } from "./routes/main";
import { Houses } from "./routes/houses";
import { Pokemons } from "./routes/pokemons";
import { UserGreeter } from "./routes/userGreeter";
import { ErrorPage } from "./pages/errorPage";

import PropTypes from "prop-types";

let routesColl = [
  {
    path: "/",
    response: () => <Main />,
  },
  {
    path: "/user/:id",
    response: ({ id }) => <UserGreeter id={id} />,
  },
  {
    path: "/houses",
    response: () => <Houses />,
  },
  {
    path: "/pokemons",
    response: () => <Pokemons />,
  },
];

// if you want you can use the function which depends
// on the external routing module, but for simplicity
// you can just use the useLocation hook from below
function listenPathChange() {
  let [p, setP] = useState();

  useEffect(() => {
    let setPath = (p) => {
      setP(p);
    };

    routing.path.addWatcher(setPath);
  }, []);

  if (p && typeof p.val === "function") {
    return p.val();
  }
  return window.location.pathname;
}

// some monkey tricks to handle location changes
//
function useLocation() {
  let [location, setLocation] = useState(window.location.pathname);

  useEffect(() => {
    // save original push state method
    const originalPushState = history.pushState;

    // replacing browsers pushState method with the custom implementation
    // to set a new location derived from pushState arguments
    history.pushState = function () {
      originalPushState.apply(history, arguments);
      setLocation(arguments[2]);
    };

    // subscribe to popstate event and set a new location on the each event call
    // to handle browser navigation events via toolbar knobs and hot-keys
    window.addEventListener("popstate", () => {
      console.log("setting new pathname:", window.location.pathname);
      setLocation(window.location.pathname);
    });

    return () => {
      // restoring original pushState method
      history.pushState = originalPushState;
      // remove the popstate event listener
      window.removeEventListener("popstate", () => {
        location = window.location.pathname;
      });
    };
  }, []);

  return location;
}

RouterProvider.propTypes = {
  routes: PropTypes.array.isRequired,
};

// a component which handles routes passed as a parameter
function RouterProvider({ routes }) {
  // location changes every time the browser's history object changes
  let location = useLocation(); // you can use either useLocation or listenPathChange
  // The result is a route function response for each location change
  let result = routeSync(routes, { path: location });

  if (result && result.status === 404) {
    return <ErrorPage page={location} />;
  }

  return result;
}

export function App() {
  return <RouterProvider routes={routesColl} />;
}
