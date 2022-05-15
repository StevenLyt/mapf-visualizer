import "./App.css";
import * as React from "react";
import LAMAPFVisualizer from "./LAMAPFVisualizer";
import AppAppBar from "./AppAppBar";
import AppFooter from "./AppFooter";
import withRoot from "./withRoot";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

function App() {
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
      <LAMAPFVisualizer></LAMAPFVisualizer>
      <AppFooter></AppFooter>
    </React.Fragment>
  );
}

export default withRoot(App);
