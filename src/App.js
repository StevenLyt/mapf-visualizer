import "./App.css";
import * as React from "react";
import LAMAPFVisualizer from "./LAMAPFVisualizer";
import MAPFVisualizer from "./MAPFVisualizer";
import AppAppBar from "./AppAppBar";
import Home from "./Home";
import withRoot from "./withRoot";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function App(props) {
  var body;
  if (props.page === "la") {
    body = <LAMAPFVisualizer />;
  } else if (props.page === "classic") {
    body = <MAPFVisualizer />;
  } else {
    body = <Home />;
  }

  return (
    <React.Fragment>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <AppAppBar></AppAppBar>
      {/* <Home></Home> */}
      {/* <LAMAPFVisualizer></LAMAPFVisualizer> */}
      {body}
      {/* <AppFooter></AppFooter> */}
    </React.Fragment>
  );
}

export default withRoot(App);
