import React, { FC } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "./views/App/App";
import About from "./views/About/About";
import MyProfile from "./views/MyProfile/MyProfile";
import showMotive from "./components/Temp/ShowMotive";
import { Security, ImplicitCallback } from "@okta/okta-react";

const config = {
  issuer: "https://dev-812828.okta.com/oauth2/default",
  redirectUri: window.location.origin + "/implicit/callback",
  clientId: "0oa2lxbl9mygTznZy357",
  pkce: true,
};

const Routes: FC = () => {
  return (
    <Router>
      <Security {...config}>
        <Route exact path="/motive" component={showMotive}></Route>
        <Route exact path="/" component={App} />
        <Route exact path="/about" component={About} />
        <Route exact path="/myprofile" component={MyProfile} />
        <Route path="/implicit/callback" component={ImplicitCallback} />
      </Security>
    </Router>
  );
};

export default Routes;
