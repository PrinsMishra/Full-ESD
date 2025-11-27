

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App";

// ⭐ Use your actual Google Client ID here
const GOOGLE_CLIENT_ID = "751273023660-8l3nsso812bbmdnr7sc8pgb105u7lp0c.apps.googleusercontent.com";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
