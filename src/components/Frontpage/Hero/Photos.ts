import ukeKomite1935 from "@/assets/images/frontpage/uke-komite-1935.jpg";
import billettkoUka1935 from "@/assets/images/frontpage/billettko-uka-1935.jpg";
import mote50Tallet1951 from "@/assets/images/frontpage/mote-50-tallet-1951.jpg";
import samfundet1953 from "@/assets/images/frontpage/samfundet-1953.jpg";
import kronprinsHarald1968 from "@/assets/images/frontpage/kronprins-harald-1968.jpg";
import knutsenOgLudvigsen1972 from "@/assets/images/frontpage/Knutsen og ludvigsen 1972(web).jpg";
import deLillos1987 from "@/assets/images/frontpage/delillos-1987.jpg";
import dumDumBoysWeb1988 from "@/assets/images/frontpage/dum dum boys 1988(web).jpg";
import dumDumBoys1988 from "@/assets/images/frontpage/dum-dum-boys-1988.jpg";
import jokke1988 from "@/assets/images/frontpage/jokke-1988.jpg";
import isfitWorkshop1999 from "@/assets/images/frontpage/ISFit Workshop 1999(web).jpg";
import bigBang2009 from "@/assets/images/frontpage/big-bang-2009.jpg";
import karpeDiem2010 from "@/assets/images/frontpage/Karpe Diem 2010(web).jpg";
import kaizersOrchestra2010 from "@/assets/images/frontpage/kaizers-orchestra-2010.jpg";
import kaizersOrchestra2014 from "@/assets/images/frontpage/kaizers-orchestra-2014.jpg";
import sondreLerche2015 from "@/assets/images/frontpage/sondre-lerche-2015.jpg";
import kamelen2019 from "@/assets/images/frontpage/kamelen-2019.jpg";
import tvAksjonenVeldedighetskonsert2019 from "@/assets/images/frontpage/tv-aksjonen-veldedighetskonsert-2019.jpg";
import boyPablo2021 from "@/assets/images/frontpage/boy-pablo-2021.jpg";
import silentDisco2021 from "@/assets/images/frontpage/silent-disco-2021.jpg";
import uka23Oktoberfest from "@/assets/images/frontpage/uka23-oktoberfest.jpg";
import berrumOgBeyerStandup2023 from "@/assets/images/frontpage/berrum-og-beyer-standup-2023.jpg";
import dde2023 from "@/assets/images/frontpage/dde-2023.jpg";
import cezinando2023 from "@/assets/images/frontpage/cezinando-2023.jpg";
import jazzfestivalDykdypp2024 from "@/assets/images/frontpage/jazzfestival-dykdypp-2024.jpg";
import jesperFosdal2026 from "@/assets/images/frontpage/jesper-fosdal-2026.jpg";
import vm2_2026 from "@/assets/images/frontpage/vm-2-2026.jpg";
import toga2026 from "@/assets/images/frontpage/toga-2026.jpg";
import vm2026 from "@/assets/images/frontpage/vm-2026.jpg";
import donkeyboy2026 from "@/assets/images/frontpage/donkeyboy-2026.jpg";
import sult2026 from "@/assets/images/frontpage/sult-2026.jpg";
import toyenHolding2026 from "@/assets/images/frontpage/toyen-holding-2026.jpg";

type Photo = {
  url: string;
  description: string;
  year: number;
};

const photos: Photo[] = [
  {
    url: ukeKomite1935,
    description: "Uka 35 komiteen",
    year: 1935,
  },
  {
    url: billettkoUka1935,
    description: "Billettkø under Uka 35",
    year: 1935,
  },
  {
    url: mote50Tallet1951,
    description: "Møte på 50-tallet",
    year: 1951,
  },
  {
    url: samfundet1953,
    description: "Samfundet",
    year: 1953,
  },
  {
    url: kronprinsHarald1968,
    description: "Kronprins Harald",
    year: 1968,
  },
  {
    url: knutsenOgLudvigsen1972,
    description: "Knutsen og Ludvigsen",
    year: 1972,
  },
  {
    url: deLillos1987,
    description: "deLillos",
    year: 1987,
  },
  {
    url: dumDumBoysWeb1988,
    description: "Dum Dum Boys",
    year: 1988,
  },
  {
    url: dumDumBoys1988,
    description: "Dum Dum Boys",
    year: 1988,
  },
  {
    url: jokke1988,
    description: "Jokke",
    year: 1988,
  },
  {
    url: isfitWorkshop1999,
    description: "ISFiT-workshop",
    year: 1999,
  },
  {
    url: bigBang2009,
    description: "Big Bang",
    year: 2009,
  },
  {
    url: karpeDiem2010,
    description: "Karpe Diem",
    year: 2010,
  },
  {
    url: kaizersOrchestra2010,
    description: "Kaizers Orchestra",
    year: 2010,
  },
  {
    url: kaizersOrchestra2014,
    description: "Kaizers Orchestra",
    year: 2014,
  },
  {
    url: sondreLerche2015,
    description: "Sondre Lerche",
    year: 2015,
  },
  {
    url: kamelen2019,
    description: "Kamelen",
    year: 2019,
  },
  {
    url: tvAksjonenVeldedighetskonsert2019,
    description: "TV-aksjonen veldedighetskonsert",
    year: 2019,
  },
  {
    url: boyPablo2021,
    description: "Boy Pablo",
    year: 2021,
  },
  {
    url: silentDisco2021,
    description: "Silent Disco",
    year: 2021,
  },
  {
    url: uka23Oktoberfest,
    description: "Uka 23 Oktoberfest",
    year: 2023,
  },
  {
    url: berrumOgBeyerStandup2023,
    description: "Berrum og Beyer standup",
    year: 2023,
  },
  {
    url: dde2023,
    description: "DDE",
    year: 2023,
  },
  {
    url: cezinando2023,
    description: "Cezinando",
    year: 2023,
  },
  {
    url: jazzfestivalDykdypp2024,
    description: "Jazzfestival: DYKDYPP",
    year: 2024,
  },
  {
    url: jesperFosdal2026,
    description: "Jesper Fosdal",
    year: 2026,
  },
  {
    url: sult2026,
    description: "SULT",
    year: 2026,
  },
  {
    url: toyenHolding2026,
    description: "Tøyen Holding",
    year: 2026,
  },
  {
    url: toga2026,
    description: "Toga",
    year: 2026,
  },
  {
    url: vm2_2026,
    description: "Norge - Brasil under VM 2026",
    year: 2026,
  },
  {
    url: vm2026,
    description: "Norge - Brasil VM 2026",
    year: 2026,
  },
  {
    url: donkeyboy2026,
    description: "Donkeyboy",
    year: 2026,
  },
];

export default photos;
