import React from "react";
import PropTypes from "prop-types";
import { GoMain } from "../components/goMain";

UserGreeter.propTypes = {
  id: PropTypes.string,
};
export function UserGreeter({ id }) {
  return (
    <div>
      <GoMain />

      <h1>Hello, {id}!</h1>
    </div>
  );
}
