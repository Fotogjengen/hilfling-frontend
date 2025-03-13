//Button for opening login pop up
import React, { useContext, useState } from "react";
import Login from "./Login";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";

const LoginButton = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(
    AuthenticationContext,
  );
  const [loginForm, setLoginForm] = useState(false);
  return (
    <>
      {isAuthenticated ? (
        <button onClick={() => setIsAuthenticated(false)}>Logg ut</button>
      ) : (
        <button onClick={() => setLoginForm(true)}>Logg inn</button>
      )}
      {loginForm && <Login setLoginForm={setLoginForm} />}
    </>
  );
};

export default LoginButton;
