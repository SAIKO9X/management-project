import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./state/Store.js";
import { NotificationProvider } from "./components/ui/NotificationProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
