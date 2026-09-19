import { useState } from "react";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import { useAuth } from "../../../contexts/AuthProvider";
import styles from "./LoginButton.module.css";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={logout}>
        Logg ut
      </button>
      <LoginPopUp open={loginForm} onOpenChange={setLoginForm} />
    </>
  );
};
