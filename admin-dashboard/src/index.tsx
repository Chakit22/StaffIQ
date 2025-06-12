import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./graphQL/client";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
);
