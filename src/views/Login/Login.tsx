import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { CloseSharp, Visibility, VisibilityOff } from "@mui/icons-material";

/*
We haven’t decided yet whether the "power user" role will be part of the final system. 
To avoid losing the implementation work already done, we’ve left the supporting logic 
in place but temporarily disabled its visibility in the user interface. 
Once the decision about power users is finalized, we can either re-enable the code for power users or remove it entirely.
*/
interface Props {
  setLoginForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login = ({ setLoginForm }: Props) => {
  const [activeForm, setActiveForm] = useState<"husfolk" | "power" | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated, setPosition } = useContext(AuthenticationContext);

  const handleLogin = (position: string) => {
    setIsAuthenticated(true);
    setPosition(position);
    setLoginForm(false);
  };

  const renderForm = (title: string, position: string) => (
    <Grid item xs={12} className={styles.gridItem}>
      <h3>{title}</h3>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
        <TextField
          id="standard-username"
          label="Username"
          type="text"
          variant="standard"
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button type="submit" onClick={() => handleLogin(position)}>
        Logg inn
      </Button>
    </Grid>
  );

  return (
    <div className={styles.popup}>
      <div className={styles.popupInner}>
        <Grid container>
          {/* <Grid item xs={5}>
            <Button
              className={styles.gridItem}
              onClick={() => setActiveForm("power")}

            >
              Login PowerBruker
            </Button>
          </Grid> */}
          <Grid item xs={10}>
            <Button
              className={styles.gridItem}
              onClick={() => setActiveForm("husfolk")}
            >
              Logg inn som intern
            </Button>
          </Grid>
          <Grid item xs={2}>
            <IconButton
              onClick={() => setLoginForm(false)}
              className={styles.gridItem}
            >
              <CloseSharp />
            </IconButton>
          </Grid>
        </Grid>

        {activeForm === "husfolk" && renderForm("LOGG INN SOM INTERN", "FG")}
        {activeForm === "power" && renderForm("LOGG INN SOM POWERBRUKER", "PROFILE")}
      </div>
    </div>
  );
};

export default Login;
