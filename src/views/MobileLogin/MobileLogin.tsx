import React, { useContext, useState } from "react";
import { AuthenticationContext } from "../../contexts/AuthenticationContext";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

/*
This component is largely based on the LoginPopUp code but simplified for mobile.
For the mobile version, we chose not to use a popup since it felt cluttered on smaller screens.
The implementation will need to be updated once the ITK login logic is integrated.
When more styling is added it should be in its own file.
*/

const MobileLogin = () => {
  const { isAuthenticated, setIsAuthenticated, setPosition } = useContext(
    AuthenticationContext,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setIsAuthenticated(true);
    setPosition("FG");
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
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3, width: "80%" }}
          onClick={handleLogout}
        >
          Logg ut
        </Button>
      </div>
    );
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: "80%" }} variant="standard">
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="standard"
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "80%" }} variant="standard">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, width: "80%" }}
        onClick={handleLogin}
      >
        LOGG INN
      </Button>
    </div>
  );
};

export default MobileLogin;
