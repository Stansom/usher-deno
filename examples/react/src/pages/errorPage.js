import PropTypes from "prop-types";
import React from "react";

ErrorPage.propTypes = {
  page: PropTypes.string,
};

export function ErrorPage({ page }) {
  return (
    <div className="errorPage">
      <div className="errorPageContent">
        <h1 className="errorPageTitle">Sorry</h1>
        <div className="errorPageText">
          <h4>The page you requested:</h4>
          <div className="errorPageTextLocation">&quot;{page}&quot;</div>
          <h4 className="errorPageTextNotFound">not found</h4>
        </div>
      </div>
    </div>
  );
}
