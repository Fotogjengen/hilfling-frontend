import { useContext, useState } from "react";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import styles from "./LoginButton.module.css";
import { useLogout } from "@/hooks/auth";

const LoginButton = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  const [loginForm, setLoginForm] = useState(false);
  const logout = useLogout();

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
