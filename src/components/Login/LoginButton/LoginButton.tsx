import { useState } from "react";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import { useAuth } from "../../../contexts/AuthProvider";
import styles from "./LoginButton.module.css";

const LoginButton = () => {
  const { isAuthenticated, logout } = useAuth();
  const [loginForm, setLoginForm] = useState(false);

  const handleLogout = () => {
    logout();
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
      <LoginPopUp open={loginForm} onOpenChange={setLoginForm} />
    </>
  );
};

export default LoginButton;
