import React, { useContext, useState } from "react";
import styles from "./LoginPopUp.module.css";
import { AuthenticationContext } from "../../../contexts/AuthenticationContext";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { CloseSharp, Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthAPi } from "../../../utils/api/AuthApi";
import Cookies from "js-cookie";

interface Props {
  setLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopUp = ({ setLoginForm }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthenticated, setPosition } = useContext(AuthenticationContext);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Brukernavn og passord er påkrevd");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthAPi.login(username, password);
      const payload = JSON.parse(atob(response.token.split(".")[1]));
      const role: string = payload.role ?? "HUSFOLK";
      Cookies.set("fgToken", response.token, { expires: 1 });
      Cookies.set("fgBasicAuth", btoa(`${username}:${password}`), {
        expires: 1,
      });
      setIsAuthenticated(true);
      setPosition(role);
      setLoginForm(false);
    } catch {
      setError("Innlogging feilet. Sjekk brukernavn og passord.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <Grid container>
          <Grid item xs={10}>
            <Typography variant="h6">LOGG INN SOM INTERN</Typography>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => setLoginForm(false)}>
              <CloseSharp />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container direction="column" spacing={2} sx={{ mt: 1 }}>
          <Grid item>
            <FormControl fullWidth variant="standard">
              <TextField
                label="Brukernavn"
                type="text"
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl fullWidth variant="standard">
              <InputLabel htmlFor="password">Passord</InputLabel>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") void handleLogin(); }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
          {error && (
            <Grid item>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <Button
              variant="contained"
              onClick={() => void handleLogin()}
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? "Logger inn..." : "Logg inn"}
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default LoginPopUp;
