import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/reset.min.css";
import "./styles/default.css";
import App from "./App";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker enregistré avec succès:", registration);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de l'enregistrement du Service Worker:",
        error
      );
    });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
