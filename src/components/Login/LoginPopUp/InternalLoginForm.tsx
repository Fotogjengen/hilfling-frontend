import { useState } from "react";
import styles from "./LoginPopUp.module.css";
import { Button } from "@/components/ui/input/Button";
import { TextInput } from "@/components/ui/input/TextInput";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/contexts/AuthProvider";

interface Props {
  onSuccess: () => void;
}

const InternalLoginForm = ({ onSuccess }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useLogin();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Brukernavn og passord er påkrevd");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await login(username, password);
      onSuccess();
    } catch {
      setError("Innlogging feilet. Sjekk brukernavn og passord.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      <Button
        onClick={() => void handleLogin()}
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? "Logger inn..." : "Logg inn"}
      </Button>
    </div>
  );
};

export default InternalLoginForm;
