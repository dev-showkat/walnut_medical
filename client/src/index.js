import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RouterCom from "./router";
import { Provider } from "react-redux";
import { Store } from "./Redux/Store";
import { persistor } from "./Redux/Store";
import { PersistGate } from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterCom />
    </PersistGate>
  </Provider>
);
