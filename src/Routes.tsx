import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./views/App/App";
import About from "./views/About/About";
import MyProfile from "./views/MyProfile/MyProfile";
import { Security, ImplicitCallback, SecureRoute } from "@okta/okta-react";
import { ErrorBoundary } from "./utils/error/ErrorBoundary";

const config = {
  issuer: "https://dev-812828.okta.com/oauth2/default",
  redirectUri: window.location.origin + "/implicit/callback",
  clientId: "0oa2lxbl9mygTznZy357",
  pkce: true
};

const Routes = () => {
  return (
    <Router>
      {/* <Security {...config}> */}
      <Route exact path="/" component={App} />
      <Route exact path="/about" component={About} />
      <Route exact path="/myprofile" component={MyProfile} />
      <Route
        exact
        path="/myprofile/settings"
        render={() => (
          <ErrorBoundary>
            <MyProfileSetting></MyProfileSetting>
          </ErrorBoundary>
        )}
      />

      {/* <Route path="/implicit/callback" component={ImplicitCallback} /> */}
      {/* </Security> */}
      <Security {...config}>
        <Route exact path="/" component={App} />
        <Route exact path="/about" component={About} />
        <Route exact path="/myprofile" component={MyProfile} />
        <Route path="/implicit/callback" component={ImplicitCallback} />
      </Security>
    </Router>
  );
};

export default Routes;
