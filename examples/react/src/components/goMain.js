import React from "react";
import * as routing from "../routing";

export function GoMain() {
  return <button onClick={() => routing.pushState("/")}>Go Main</button>;
}
