import "./index.css";
import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router";
import { WalletSelectorModal } from "./modal/near-wallet-selector";
import { NearWalletSelectorContextProvider } from "./context/near";

// TODO: Find a better way to handle this buffer error
window.Buffer = window.Buffer || Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NearWalletSelectorContextProvider>
      <Router />

      <WalletSelectorModal />
    </NearWalletSelectorContextProvider>
  </React.StrictMode>
);
