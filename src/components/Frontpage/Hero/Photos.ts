import isfitWorkshop1999 from "@/assets/images/frontpage/ISFit Workshop 1999(web).jpg";
import karpeDiem2010 from "@/assets/images/frontpage/Karpe Diem 2010(web).jpg";
import knutsenOgLudvigsen1972 from "@/assets/images/frontpage/Knutsen og ludvigsen 1972(web).jpg";
import samfundsmoteKongepar1968 from "@/assets/images/frontpage/Samfundsmøte Kronprins Harald og Kronprinsesse Sonja 1968(web).jpg";
import dumDumBoysCrowd1988 from "@/assets/images/frontpage/dum dum boys 1988(web).jpg";
import ukeKomite1935 from "@/assets/images/frontpage/uke-komite-1935.jpg";
import billettkoUka1935 from "@/assets/images/frontpage/billettko-uka-1935.jpg";
import mote50Tallet1951 from "@/assets/images/frontpage/mote-50-tallet-1951.jpg";
import nthi17MaiTog1951 from "@/assets/images/frontpage/nthi-17-mai-tog-1951.jpg";
import samfundet1953 from "@/assets/images/frontpage/samfundet-1953.jpg";
import samf17MaiTog1985 from "@/assets/images/frontpage/samf-17-mai-tog-1985.jpg";
import deLillos1987 from "@/assets/images/frontpage/delillos-1987.jpg";
import dumDumBoysOnstage1988 from "@/assets/images/frontpage/dum-dum-1988.jpg";
import jokke1988 from "@/assets/images/frontpage/jokke-1988.jpg";
import dumDumBoysAudience1988 from "@/assets/images/frontpage/dum-dum-boys-1988.jpg";

type Photo = {
  url: string;
  description: string;
  year: number;
};

const photos: Photo[] = [
  {
    url: ukeKomite1935,
    description: "Uke-komiteen planlegger Uka",
    year: 1935,
  },
  {
    url: billettkoUka1935,
    description: "Kø til billettslippet",
    year: 1935,
  },
  {
    url: mote50Tallet1951,
    description: "Møte rundt en ølkasse",
    year: 1951,
  },
  {
    url: nthi17MaiTog1951,
    description: "NTHI i 17. mai-toget",
    year: 1951,
  },
  {
    url: samfundet1953,
    description: "Nedtelling på fasaden",
    year: 1953,
  },
  {
    url: samfundsmoteKongepar1968,
    description: "Kronprins Harald og kronprinsesse Sonja på Samfundet",
    year: 1968,
  },
  {
    url: knutsenOgLudvigsen1972,
    description: "Knutsen og Ludvigsen spiller",
    year: 1972,
  },
  {
    url: samf17MaiTog1985,
    description: "17. mai ved Samfundet",
    year: 1985,
  },
  {
    url: deLillos1987,
    description: "deLillos spiller på Samfundet",
    year: 1987,
  },
  {
    url: dumDumBoysCrowd1988,
    description: "Dum Dum Boys for fullt hus",
    year: 1988,
  },
  {
    url: dumDumBoysAudience1988,
    description: "Vokalisten ut til publikum",
    year: 1988,
  },
  {
    url: dumDumBoysOnstage1988,
    description: "Dum Dum Boys på scenen",
    year: 1988,
  },
  {
    url: jokke1988,
    description: "Jokke spiller live",
    year: 1988,
  },
  {
    url: isfitWorkshop1999,
    description: "Workshop på ISFiT",
    year: 1999,
  },
  {
    url: karpeDiem2010,
    description: "Karpe Diem live",
    year: 2010,
  },
];

export default photos;
