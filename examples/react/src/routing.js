import { Atom } from "./atom";
const path = Atom("");

function hookUserIteraction() {
  window.addEventListener("popstate", () => {
    path.set(window.location.pathname);
  });
}

function setPath() {
  path.set(window.location.hash);
}

function pushState(newPath) {
  path.set(newPath);
  window.history.pushState(null, "", newPath);
}

export { hookUserIteraction, setPath, pushState, path };
