import React from 'react'
import { User } from './mockdata';

interface user {
    name : string ; 
    userName : string;
    adress : string ;
    zip : number;
    city : string;
    phoneNumber : number;
    eMail: string ;
    samfundetEMail : string ; 
    currentPosition? : string | undefined ;  
    formerPositions? : string[] | undefined;
    role? : string | undefined // "Fotograf" or "Web"
    admissionSemester? : string ;
   
}

const mockUser:user = {  // Mock-user for test purpose
  name : "Hallgeir Kvadsheim",
  userName : "Brukernavn : HallKva",
  adress : "Herman Krags vei 13",
  zip : 7051,
  city : "Trondheim",
  phoneNumber : 4712345657,
  eMail: "Hallgair.K@gmail.com" ,
  samfundetEMail : "Hallkva@samfundet.no" ,
  currentPosition :  "økonomisjef",
  formerPositions : ["Miljøbilde", "Nyoptatt"],
  
  admissionSemester : "h25"
 
};

const webPositions: string[] = [ "Websjef", "Benkmester", "Opplæringsannsvarlig", "WebAdmin"];


const MyProfileRebrand = () => {

  //Make api-call
  //determine if web or fotograf
  //push api-info into + role into "user" variable
 

  return (
    <div>MyProfileRebrand</div>
  )
}

export default MyProfileRebrand