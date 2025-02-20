import React, { useState, useEffect } from 'react'
import "./MyProfileRebrand.css"
import axios from 'axios';
import { PhotoApi } from "../../utils/api/PhotoApi";

//https:\/\/images.dog.ceo\/breeds\/dane-great\/n02109047_6042.jpg


interface UserInfo {
    profilePicure : string;
    firstName : string ; 
    lastName : string;
    userName : string;
    adress : string ;
    zip : string;
    city : string;
    phoneNumber : string;
    // eMail: string ;
    samfundetEMail : string ; 
    currentPosition : string | " ";  
    formerPositions : string[] | [" "];
    role? : string | " " // "Fotograf" or "Web"
    admissionSemester? : string ;
   
}

// const mockUser:UserInfo = {  // Mock-user for test purpose
//   profilePicure : "https://media1.tenor.com/images/79f8be09f39791c6462d30c5ce42e3be/tenor.gif?itemid=18386674",
//   firstName : "Hallgeir",
//   lastName: "Kvadsheim",
//   userName : "Brukernavn : HallKva",
//   adress : "Herman Krags vei 13",
//   zip : "7051",
//   city : "Trondheim",
//   phoneNumber : "4712345657",
//   // eMail: "Hallgair.K@gmail.com" ,
//   samfundetEMail : "Hallkva@samfundet.no" ,
//   currentPosition :  "Økonomisjef",
//   formerPositions : ["Miljøbilde", "Nyoptatt"],
  
//   admissionSemester : "Høst 25"
 
// };

const emptyUser:UserInfo = {
  profilePicure : "https://media1.tenor.com/images/79f8be09f39791c6462d30c5ce42e3be/tenor.gif?itemid=18386674" ,
  firstName : " ",
  lastName : " ",
  userName : " ",
  adress : " ",
  zip : " ",
  city : " ",
  phoneNumber : " ",
  // eMail: " " ,
  samfundetEMail : " " ,
  currentPosition :  " ",
  formerPositions : [" "],
  role : " ",
  admissionSemester : " "

};



//http://localhost:8000/photo_gang_bangers/7a89444f-25f6-44d9-8a73-94587d72b839


const MyProfileRebrand = () => {

  const webPositions: string[] = [ "websjef", "benkmester", "opplæringsannsvarlig", "webAdmin", "web"];

  const [currentUser, setCurrentUser] = useState<UserInfo>(emptyUser);

  useEffect (() => {
    const getUser = () => {
  
    //Make api-call
      const url = "http://localhost:8000/photo_gang_bangers/7a89444f-25f6-44d9-8a73-94587d72b839" //For testing purpose. Has to be modified make corrrect api call

      axios
      .get(url)
      
      .then((response) => {
        const profilePicure = response.data.samfundetUser.profilePicturePath;
        const firstName = response.data.samfundetUser.firstName;
        const lastName = response.data.samfundetUser.lastName;
        const userName =  response.data.samfundetUser.username;
        const adress = response.data.address;
        const zip = response.data.zipCode;
        const city = response.data.city;
        const phoneNumber = response.data.samfundetUser.phoneNumber.value;
        // const eMail= response.data.samfundetUser.email.value;
        const samfundetEMail = response.data.samfundetUser.email.value; 
        const currentPosition =  response.data.position.title;
        const formerPositions = [" "]; //Not supported yet
        const admissionSemester = response.data.semesterStart.value;
            //determine if web or fotograf
        let role = "Fotograf";
        // console.log(webPositions.includes(currentUser.currentPosition.toLowerCase()))
        
         if (webPositions.includes(currentPosition.toLowerCase()) ){  // settes the correct role
            role =  "Web";
    
          }


        setCurrentUser({profilePicure, firstName, lastName, userName, adress,zip, city, phoneNumber, samfundetEMail, currentPosition, formerPositions, role, admissionSemester}); 
      })
      
      .catch((error) => {

        console.error("Error fetching user:", error); 
      });


    };

  getUser();
    }, []);

  // useEffect(() => {
    
  //   PhotoApi.getById("94540f3c-77b8-4bc5-acc7-4dd7d8cc5bcd")
  //   .then((res) => console.log(res))
  //   .catch((err) => {
  //     console.log(err.message)
  //   });


  // },[]);



  return (
    <>
    <div className= 'main_card' >

      <header className = "name_display" >
        {(currentUser?.firstName + " " + currentUser?.lastName) || "loading ... "}
        <h2 className = "role_display" > 
          {currentUser?.role || "loading ... "}
        </h2>
      </header>
    
      <div className = 'info_card'>

        <div className = 'card_1'> {/* Contains profile picture and personal info*/}

          <div className = 'profile_picture' >
            <div className = 'profile_picture_img'>
              <img src={currentUser.profilePicure} alt="Profile" height="225" width="225" /> 
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


        </div>

        <div className = 'card_2'> {/* Contains position and admission semester*/}

          <div className = 'personal_information' >
            <h1 className = 'personal_information_header'> 
              {"Personlig informasjon"}
            </h1>
            <h2 className= 'personal_information_list'> 
              <div>  
                {"Brukernavn: " + currentUser.userName}  
              </div>
              <div>  
                {"Samfundet e-post: " + currentUser.samfundetEMail}
              </div>
              {/* <div>  
                {"e-post: " + currentUser.eMail}
              </div> */}
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