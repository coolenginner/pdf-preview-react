import React from "react";
import { Route, Link, BrowserRouter as Router, Switch } from "react-router-dom";

function About() {

  return (
    <>
      <div className="container-fluid landingpage">
        <div className="row">
          <div className="col-md-6 card">
            <a
              className="mx-auto">
                 <Link to="/Upload">Upload Pdf</Link>
             </a>
          </div>

          <div className="col-md-6 card">
            <a
              className="mx-auto">
              <Link to="/Sign">Sign Pdf</Link>
              </a>
          </div>
        </div>
        <h1 className="pt-4 mt-4">Pdf Application</h1>
      </div>

    </>
  );

}
export default About;
