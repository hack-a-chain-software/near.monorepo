import "./index.css";
import React from "react";
import { Buffer } from "buffer";
import { App } from "@/components";
import ReactDOM from "react-dom/client";
import { NearWalletSelectorContextProvider } from "@/utils/context/near";
import { WalletSelectorModal } from "@/components/modals/near-wallet-selector";

// TODO: Find a better way to handle this buffer error
window.Buffer = window.Buffer || Buffer;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NearWalletSelectorContextProvider>
      <App />

      <WalletSelectorModal />
    </NearWalletSelectorContextProvider>
  </React.StrictMode>
);
