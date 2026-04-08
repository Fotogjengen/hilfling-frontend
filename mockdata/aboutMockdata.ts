// Denne har null referanser... Kan vi slette dette??

interface GangBanger {
  name: string;
  position: string;
  email: string;
  image: string;
}
const profilePicture =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const fgMail = "fg-web@samfundet.no";

export const activePhotoGangBangers: GangBanger[] = [
  {
    name: "Pernille Klevtuen",
    position: "Webutvikler",
    email: fgMail,
    image: profilePicture,
  },
  {
    name: "Sindre Sivertsen",
    position: "Webutvikler",
    email: fgMail,
    image: profilePicture,
  },
  {
    name: "Caroline Sandsbråten",
    position: "Webutvikler",
    email: fgMail,
    image: profilePicture,
  },
  {
    name: "Kristine Krokeide",
    position: "Gjengsjef",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Benjamin Haslev",
    position: "Internområdeansvarlig",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Frøy Haslev",
    position: "Internområdeansvarlig",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Tina Haslev",
    position: "Internområdeansvarlig",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Andrea Haslev",
    position: "Internområdeansvarlig",
    email: fgMail,
    image: "profilePicture",
  },
];

export const retiredPhotoGangBangers: GangBanger[] = [
  {
    name: "Pernille Klevtuen",
    position: "Webutvikler",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Sindre Sivertsen",
    position: "Webutvikler",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Caroline Sandsbråten",
    position: "Webutvikler",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Kristine Krokeide",
    position: "Gjengsjef",
    email: fgMail,
    image: "profilePicture",
  },
  {
    name: "Benjamin Haslev",
    position: "Internområdeansvarlig",
    email: fgMail,
    image: "profilePicture",
  },
];
