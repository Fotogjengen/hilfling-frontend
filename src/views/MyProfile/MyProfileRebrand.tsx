import React from 'react'

interface user {
    name : string ; 
    userName : string;
    adress : string ;
    zip : number;
    city : string;
    phoneNumber : number;
    eMail: string ;
    samfundetEMail : string ; 
    currentPosition : string | undefined ;  
    formerPositions : any  | undefined;
    role : string | undefined // Is the person a web-developer or a photographer
    admissionSemester : string ;
   
}


const MyProfileRebrand = () => {
  return (
    <div>MyProfileRebrand</div>
  )
}

export default MyProfileRebrand