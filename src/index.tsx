import "simplebar/src/simplebar.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SettingsProvider } from "./contexts/SettingsContext";
import { CollapseDrawerProvider } from "./contexts/CollapseDrawerContext";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <HelmetProvider>
    <SettingsProvider>
      <CollapseDrawerProvider>
        <BrowserRouter>
          <Auth0Provider
            domain="dev-kih0vbej.us.auth0.com"
            clientId="qg2GYcVRnfe6McGWz13QFsEXkNDat4DL"
            redirectUri={window.location.origin}
            audience="https://dev-kih0vbej.us.auth0.com/api/v2/"
            useRefreshTokens={true}
            cacheLocation='localstorage'
          >
            <App />
          </Auth0Provider>
        </BrowserRouter>
      </CollapseDrawerProvider>
    </SettingsProvider>
  </HelmetProvider>
);
