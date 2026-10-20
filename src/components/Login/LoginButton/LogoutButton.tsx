import { useAuth } from "@/contexts/AuthProvider";
import styles from "./LoginButton.module.css";

export const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button type="button" className={styles.button} onClick={logout}>
      Logg ut
    </button>
  );
};
