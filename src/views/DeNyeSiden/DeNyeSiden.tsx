import React from 'react'
import { experimentalStyled as styled } from "@mui/material/styles";
import { Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { pink, blue } from '@mui/material/colors';



const DeNyeSiden = () => {
  const IconSize = 100;


  const menuLinks = [
    {
      name: "Random project",
      to: "/intern/sok",
      icon: <FacebookIcon  sx={{ color: blue[800] }}style={{ fontSize: IconSize }} />,
    },
    {
      name: "Random project",
      to: "/intern/sok",
      icon: <InstagramIcon sx={{ color: pink[500] }} style={{ fontSize: IconSize }} />,
    },

  ];

  const MainItem = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary,
  }));


  return (
    <div>
        <h1>DeNyeSiden</h1>
         <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
             {menuLinks.map((link, index) => (
                        <Grid item xs={2} sm={4} md={4} key={index}>
                          <Link to={link.to}>
                            <MainItem>
                              <Typography>{link.name}</Typography>
                              {link.icon}
                            </MainItem>
                          </Link>
                        </Grid>
                      ))}
                 
              
          </Grid>




              {/* <Box className = "text_input" > */}
                {/* <TextField  */}
                    {/* // error = {validCountryError}
                    // id="standard-basic" 
                    // label="Brukernavn"
                    // variant="standard" 
                    // helperText = "Skriv inn brukernavnet på alle vennene dine for å spille:)"
                    // value = {inputValue} 
                    // onChange = {handleInputChange}  */}
                    {/* /> */}
        

        {/* <button className = "submitButton"> Submit country </button> */}
        {/* {onClick = {}} */}
        {/* </Box> */}
    </div>
    
  )
}

export default DeNyeSiden