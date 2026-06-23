import { useState } from "react";
import styles from "./LoginPopUp.module.css";
import { useAuth } from "../../../contexts/AuthenticationContext";
import { Button } from "@/components/ui/input/Button";
import { TextInput } from "@/components/ui/input/TextInput";
import { Dialog } from "@/components/ui/overlay/Dialog";
import { Eye, EyeOff } from "lucide-react";
import { AuthAPi } from "../../../utils/api/AuthApi";
import Cookies from "js-cookie";
import { JwtTokenPayload } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginPopUp = ({ open, onOpenChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthenticated, setJwtPayload } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Brukernavn og passord er påkrevd");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthAPi.login(username, password);
      const payload = JSON.parse(
        atob(response.token.split(".")[1]),
      ) as JwtTokenPayload;
      Cookies.set("fgToken", response.token, { expires: 1 });
      Cookies.set("fgBasicAuth", btoa(`${username}:${password}`), {
        expires: 1,
      });
      setIsAuthenticated(true);
      setJwtPayload(payload);
      onOpenChange(false);
    } catch {
      setError("Innlogging feilet. Sjekk brukernavn og passord.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="LOGG INN SOM INTERN"
      actions={
        <Button
          onClick={() => void handleLogin()}
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? "Logger inn..." : "Logg inn"}
        </Button>
      }
    >
      <div className={styles.form}>
        <TextInput
          label="Brukernavn"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextInput
          label="Passord"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleLogin();
          }}
          suffix={
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Skjul passord" : "Vis passord"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </Dialog>
  );
};

export default LoginPopUp;
