import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TextInput } from "@/components/ui/input/TextInput";
import { Button } from "@/components/ui/input/Button";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.css";
import { useAuth } from "@/contexts/AuthenticationContext";

export const Route = createFileRoute("/login")({
  component: MobileLogin,
});

/*
This component is largely based on the LoginPopUp code but simplified for mobile.
For the mobile version, we chose not to use a popup since it felt cluttered on smaller screens.
The implementation will need to be updated once the ITK login logic is integrated.
When more styling is added it should be in its own file.
*/

function MobileLogin() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  if (isAuthenticated) {
    return (
      <div>
        <h2>Du er logget inn</h2>
        <Button className={styles.button} onClick={handleLogout}>
          Logg ut
        </Button>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <TextInput
        label="Username"
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextInput
        label="Password"
        id="password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        suffix={
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Skjul passord" : "Vis passord"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        }
      />
      <Button type="submit" className={styles.button}>
        LOGG INN
      </Button>
    </form>
  );
}

export default MobileLogin;
