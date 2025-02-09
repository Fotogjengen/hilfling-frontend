import React, { useState, useEffect } from 'react'
import "./MyProfileRebrand.css"

//https:\/\/images.dog.ceo\/breeds\/dane-great\/n02109047_6042.jpg


interface UserInfo {
    name : string ; 
    userName : string;
    adress : string ;
    zip : string;
    city : string;
    phoneNumber : string;
    eMail: string ;
    samfundetEMail : string ; 
    currentPosition : string | "";  
    formerPositions : string[] | [""];
    role? : string | "" // "Fotograf" or "Web"
    admissionSemester? : string ;
   
}

const mockUser:UserInfo = {  // Mock-user for test purpose
  name : "Hallgeir Kvadsheim",
  userName : "Brukernavn : HallKva",
  adress : "Herman Krags vei 13",
  zip : "7051",
  city : "Trondheim",
  phoneNumber : "4712345657",
  eMail: "Hallgair.K@gmail.com" ,
  samfundetEMail : "Hallkva@samfundet.no" ,
  currentPosition :  "Økonomisjef",
  formerPositions : ["Miljøbilde", "Nyoptatt"],
  
  admissionSemester : "Høst 25"
 
};

const emptyUser:UserInfo = {
  name : " ",
  userName : " ",
  adress : " ",
  zip : " ",
  city : " ",
  phoneNumber : " ",
  eMail: " " ,
  samfundetEMail : " " ,
  currentPosition :  " ",
  formerPositions : [" "],
  role : " ",
  admissionSemester : " "

};

// const webPositions: string[] = [ "Websjef", "Benkmester", "Opplæringsannsvarlig", "WebAdmin"];


const MyProfileRebrand = () => {

  const [currentUser, setCurrentUser] = useState<UserInfo>(emptyUser);

  const dogPicture = "https://images.dog.ceo/breeds//dane-great/n02109047_6042.jpg";  //Placeholder profile_pic

  //Make api-call
  //determine if web or fotograf
  //push api-info into + role into "user" variable
  useEffect (() => {
    const getUser = () => {
    
    const cUser = mockUser;
    cUser.role = "Fotograf";
    setCurrentUser(cUser);

    };

  getUser();
    }, []);

  return (
    <>
    <div className= 'main_card' >

      <header className = "name_display" >
        {currentUser?.name || "loading ... "}
        <h2 className = "role_display" > 
          {currentUser?.role || "loading ... "}
        </h2>
      </header>
    
      <div className = 'info_card'>
        
        <div className = 'card_1'> {/* Contains profile picture and personal info*/}

          <div className = 'profile_picture' >
            <div className = 'profile_picture_img'>
              <img src={dogPicture} alt="Profile" height="225" width="225" /> 
            </div>
          </div>

          <div className = 'positions'>
            <h1 className = 'positions_header'> 
              {"Verv"}
            </h1>
            <h2 className = 'positions_list'> 
              {currentUser?.currentPosition || "Loading..."}
              <div>{currentUser?.formerPositions.map((position, index) => (
                <div key = {index} >
                    {position}
                </div>
                  ))}
              </div>
            </h2>

          </div>

          {/* <div className = 'personal_information' >
            <h1 className = 'personal_information_header'> 
              {"Personlig informasjon"}
            </h1>
            <h2 className= 'personal_information_list'> 
              <div>  
                {currentUser.userName}  
              </div>
              <div>  
                {"Samfundet e-post: " + currentUser.samfundetEMail}
              </div>
              <div>  
                {"e-post: " + currentUser.eMail}
              </div>
              <div>  
                {"Telefon: " + currentUser.phoneNumber}
              </div>
              <div>  
                {"Adresse: " + currentUser.adress + ", " + currentUser.zip + " " + currentUser.city}
              </div>
            </h2>
          </div> */}

        </div>

        <div className = 'card_2'> {/* Contains position and admission semester*/}

          {/* <div className = 'positions'>
          <h1 className = 'positions_header'> 
              {"Verv"}
            </h1>
            <h2 className = 'positions_list'> 
              {currentUser?.currentPosition || "Loading..."}
              <div>{currentUser?.formerPositions.map((position, index) => (
                <div key = {index} >
                    {position}
                </div>
                  ))}
              </div>
            </h2>
          </div> */}

          <div className = 'personal_information' >
            <h1 className = 'personal_information_header'> 
              {"Personlig informasjon"}
            </h1>
            <h2 className= 'personal_information_list'> 
              <div>  
                {currentUser.userName}  
              </div>
              <div>  
                {"Samfundet e-post: " + currentUser.samfundetEMail}
              </div>
              <div>  
                {"e-post: " + currentUser.eMail}
              </div>
              <div>  
                {"Telefon: " + currentUser.phoneNumber}
              </div>
              <div>  
                {"Adresse: " + currentUser.adress + ", " + currentUser.zip + " " + currentUser.city}
              </div>
            </h2>
          </div>
          
          <div className = "admission_semester">
            <h1 className = 'admission_semester_header'> 
              {"Aktiv siden"}
            </h1>
            <h2 className= 'admission_semester_text'> 
              {currentUser?.admissionSemester || "Loading..."}
            </h2>
          </div>
        </div>
      </div>

    </div>

    </>
  
  )
}

export default MyProfileRebrand