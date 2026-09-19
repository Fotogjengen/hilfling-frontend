import { useState } from "react";
import LoginPopUp from "../LoginPopUp/LoginPopUp";
import styles from "./LoginButton.module.css";

const LoginButton = () => {
  const [loginForm, setLoginForm] = useState(false);

  return (
    <>
      <button className={styles.button} onClick={() => setLoginForm(true)}>
        Logg inn
      </button>
      <LoginPopUp open={loginForm} onOpenChange={setLoginForm} />
    </>
  );
};

export default LoginButton;
