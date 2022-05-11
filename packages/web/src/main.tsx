import "./index.css";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import { NearEnvironment } from "react-near";
import { ProviderNear } from "./hooks/near";

// TODO: Find a better way to handle this buffer error
window.Buffer = window.Buffer || Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProviderNear environment={NearEnvironment.TestNet}>
      <Router />
    </ProviderNear>
  </React.StrictMode>
);
