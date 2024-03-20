import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Button, Paper, FormControl, FormLabel, TextField } from "@mui/material";
import styles from "./ArchiveBossCreateUser.module.css"
import { Link } from "react-router-dom";



const ArchiveBossCreateUser = () => {
  
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");



  const { instance } = useMsal();

  const createUser = async () => {

    const displayName = `${givenName} ${surname}`

    const apiUrl = "https://graph.microsoft.com/v1.0/users";
    const newUser = {
      accountEnabled: true,
      givenName: givenName,
      surname: surname,
      displayName: displayName,
      mailNickname: `${displayName.replaceAll(" ", ".")}`,
      userPrincipalName:`${displayName.replaceAll(" ", ".")}@fgsamfundet.onmicrosoft.com` ,
      passwordProfile: {
        forceChangePasswordNextSignIn: true,
        password: password, 
      },
    };

    try {
      const activeAccount = instance.getActiveAccount();

      if (!activeAccount) {
        console.error("No active account. Please log in.");
        return;
      }

      const accessToken = await instance
        .acquireTokenSilent({
          account: activeAccount,
          scopes: ["User.Read"],
        })
        .catch((error) => {
          console.error("Error acquiring token silently:", error.message);
          throw error;
        });

      if (accessToken) {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken.accessToken}`,
          },
          body: JSON.stringify(newUser),
        });

        if (response.ok) {
          console.log("User created successfully");
        } else {
          console.error("Error creating user:", await response.text());
        }
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const handleButtonClick = () => {

    

    createUser()
      .then(() => {
        // Handle completion if needed
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  return (
<Paper className={styles.container}>
      <FormControl >
        <FormLabel>Fornavn:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={givenName}
          onChange={(e) => setGivenName(e.target.value)}
        />

        <FormLabel>Etternavn:</FormLabel>
        <TextField
          className={styles.input}
          required
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />

        <FormLabel>Passord:</FormLabel>
        <TextField
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        <Button
          onClick={handleButtonClick}
          type="button"
          variant="contained"
          color="primary"
          sx={{marginTop:"5px", margin:"5px auto"}}
          className={styles.submitButton}
        >
          Lag bruker
        </Button>

        <Link to="/intern/arkivsjef" className={styles.backButton}>
          Tilbake til arkivsjef
        </Link>
      </FormControl>
    </Paper>
  );
};

export default ArchiveBossCreateUser;
  

