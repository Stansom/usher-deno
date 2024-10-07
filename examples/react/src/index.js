import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

import { App } from "./App";
import { hookUserIteraction } from "./routing";

const root = createRoot(document.getElementById("root"));

hookUserIteraction();

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
