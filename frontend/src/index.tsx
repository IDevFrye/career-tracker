import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";
import "./styles/global.scss";

const container = document.getElementById("root");
const root = createRoot(container!);
console.log("VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
