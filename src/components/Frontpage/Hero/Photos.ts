import ukeKomite1935 from "@/assets/images/frontpage/uke-komite-1935.jpg";
import mote50Tallet1951 from "@/assets/images/frontpage/mote-50-tallet-1951.jpg";
import samfundet1953 from "@/assets/images/frontpage/samfundet-1953.jpg";
import kronprinsHarald1968 from "@/assets/images/frontpage/kronprins-harald-1968.jpg";
import knutsenOgLudvigsen1972 from "@/assets/images/frontpage/Knutsen og ludvigsen 1972(web).jpg";
import dumDumBoysWeb1988 from "@/assets/images/frontpage/dum dum boys 1988(web).jpg";
import isfitWorkshop1999 from "@/assets/images/frontpage/ISFit Workshop 1999(web).jpg";
import bigBang2009 from "@/assets/images/frontpage/big-bang-2009.jpg";
import karpeDiem2010 from "@/assets/images/frontpage/Karpe Diem 2010(web).jpg";
import kaizersOrchestra2010 from "@/assets/images/frontpage/kaizers-orchestra-2010.jpg";
import jesperFosdahl2026 from "@/assets/images/frontpage/jesper-fosdahl-2026.jpg";
import vm2026 from "@/assets/images/frontpage/vm-2026.jpg";
import adventkonsertTKS2026 from "@/assets/images/frontpage/adventkonsertTKS2023.jpg";
import djStorsalen2015 from "@/assets/images/frontpage/djStorsalen2015.jpg";
import jubileumsTeater2010 from "@/assets/images/frontpage/jubileumsTeater2010.jpg";
import ronjarøverdatter2026 from "@/assets/images/frontpage/ronjarøverdatter2026.jpg";
import swingmaraton2026 from "@/assets/images/frontpage/swingmaraton2026.jpg";
import ukaRevy1975 from "@/assets/images/frontpage/ukaRevy1975.jpg";


type Photo = {
  url: string;
  description: string;
  year: number;
};

const photos: Photo[] = [
  {
    url: adventkonsertTKS2026,
    description: "Adventkonsert med TKS i Storsalen",
    year: 2023,
  },
  {
    url: bigBang2009,
    description: "Big Bang i Storsalen",
    year: 2009,
  },
  {
    url: djStorsalen2015,
    description: "DJ i storsalen",
    year: 2015,
  },
  {
    url: dumDumBoysWeb1988,
    description: "Dum Dum Boys i Storsalen",
    year: 1988,
  },
  {
    url: isfitWorkshop1999,
    description: "ISFiT-workshop",
    year: 1999,
  },
  {
    url: jesperFosdahl2026,
    description: "23.59: Jesper Fosdahl",
    year: 2026,
  },
  {
    url: jubileumsTeater2010,
    description: "Samfundets 100-års Jubileums teater: Hei, ny dag!",
    year: 2010,
  },
  {
    url: kaizersOrchestra2010,
    description: "Kaizers Orchestra i Storsalen",
    year: 2010,
  },
  {
    url: karpeDiem2010,
    description: "Karpe Diem i Storsalen",
    year: 2010,
  },
  {
    url: knutsenOgLudvigsen1972,
    description: "Knutsen og Ludvigsen",
    year: 1972,
  },
  {
    url: kronprinsHarald1968,
    description: "Kronprins Harald på Samfundsmøte i Storsalen",
    year: 1968,
  },
  {
    url: mote50Tallet1951,
    description: "Møte på 50-tallet",
    year: 1951,
  },
  {
    url: ronjarøverdatter2026,
    description: "Ronja røverdatter teater i Storsalen",
    year: 2026,
  },
  {
    url: samfundet1953,
    description: "Samfundet",
    year: 1953,
  },
  {
    url: swingmaraton2026,
    description: "Swingmaraton med S. Møller Storband og venner",
    year: 2026,
  },
  {
    url: ukaRevy1975,
    description: "UKA75 Revy: Sirkuss",
    year: 1975,
  },
  {
    url: ukeKomite1935,
    description: "UKA35 komiteen",
    year: 1935,
  },
  {
    url: vm2026,
    description: "Norge - Brasil VM 2026",
    year: 2026,
  },
];

export default photos;
