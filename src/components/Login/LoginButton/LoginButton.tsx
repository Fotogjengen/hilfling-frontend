//Button for opening login pop up
import React, { useContext, useState } from "react";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import styles from "./LoginButton.module.css";
import Cookies from "js-cookie";

const LoginButton = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(
    AuthenticationContext,
  );
  const [loginForm, setLoginForm] = useState(false);

  const handleLogout = () => {
    Cookies.remove("fgToken");
    Cookies.remove("fgBasicAuth");
    setIsAuthenticated(false);
  };

  return (
    <>
      {isAuthenticated ? (
        <button className={styles.button} onClick={handleLogout}>
          Logg ut
        </button>
      ) : (
        <button className={styles.button} onClick={() => setLoginForm(true)}>
          Logg inn
        </button>
      )}
      {loginForm && <LoginPopUp setLoginForm={setLoginForm} />}
    </>
  );
};

export default LoginButton;
