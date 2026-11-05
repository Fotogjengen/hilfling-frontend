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
import mannMedBigFlaske1959 from "@/assets/images/frontpage/mann-med-big-flaske-1959.jpg";
import samf17MaiTog1985 from "@/assets/images/frontpage/samf-17-mai-tog-1985.jpg";
import deLillos1987 from "@/assets/images/frontpage/delillos-1987.jpg";
import dumDumBoysOnstage1988 from "@/assets/images/frontpage/dum-dum-1988.jpg";
import jokke1988 from "@/assets/images/frontpage/jokke-1988.jpg";
import dumDumBoysAudience1988 from "@/assets/images/frontpage/dum-dum-boys-1988.jpg";

type Photo = {
  url: string;
  title: string;
  description?: string;
  year: number;
};

const photos: Photo[] = [
  {
    url: ukeKomite1935,
    title: "Uke-komiteen planlegger Uka",
    description:
      "I 1935 sitter Uke-komiteen samlet rundt skrivemaskinene og legger planene for den kommende Uka.",
    year: 1935,
  },
  {
    url: billettkoUka1935,
    title: "Kø til billettslippet",
    description:
      "Køen til billettslippet for Uka 1935 har vokst seg lang. Folk har møtt opp for å sikre seg billetter.",
    year: 1935,
  },
  {
    url: mote50Tallet1951,
    title: "Møte rundt en ølkasse",
    description:
      "En gruppe har samlet seg rundt en kasse Dahls øl under et møte på 1950-tallet.",
    year: 1951,
  },
  {
    url: nthi17MaiTog1951,
    title: "NTHI i 17. mai-toget",
    description:
      "NTHI går i 17. mai-toget utenfor Kunstforeningen i Trondheim, med fanen høyt hevet foran Nidarosdomen.",
    year: 1951,
  },
  {
    url: samfundet1953,
    title: "Nedtelling på fasaden",
    description:
      "Samfundet står midt i Trondheim sentrum, med skiltet «Bare 23 dager igjen» over fasaden.",
    year: 1953,
  },
  {
    url: mannMedBigFlaske1959,
    title: "En stor flaske Dahls Bokkøl",
    description:
      "En student løfter en stor flaske Dahls Bokkøl høyt over hodet i et av Samfundets rom.",
    year: 1959,
  },
  {
    url: samfundsmoteKongepar1968,
    title: "Kronprins Harald og kronprinsesse Sonja på Samfundet",
    description:
      "Kronprins Harald og kronprinsesse Sonja besøker Studentersamfundet. Studenter har møtt opp for å ta imot dem.",
    year: 1968,
  },
  {
    url: knutsenOgLudvigsen1972,
    title: "Knutsen og Ludvigsen spiller",
    description:
      "Knutsen og Ludvigsen synger og spiller for studentene, med gitar og mandolin på scenen.",
    year: 1972,
  },
  {
    url: samf17MaiTog1985,
    title: "17. mai ved Samfundet",
    description:
      "17. mai-toget passerer Samfundet, og barna foran kameraet vifter med flagg og ler.",
    year: 1985,
  },
  {
    url: deLillos1987,
    title: "deLillos spiller på Samfundet",
    description:
      "deLillos spiller konsert på Samfundet i 1987. Lars Lillo-Stenberg synger mens han spiller gitar, med bandet bak seg.",
    year: 1987,
  },
  {
    url: dumDumBoysCrowd1988,
    title: "Dum Dum Boys for fullt hus",
    description:
      "Dum Dum Boys spiller foran et tettpakket publikum. Fra scenekanten strekker vokalisten seg ut over de løftede armene.",
    year: 1988,
  },
  {
    url: dumDumBoysAudience1988,
    title: "Vokalisten ut til publikum",
    description:
      "Vokalisten lener seg ned fra scenen og rekker hånden mot publikum. De fremste i salen strekker seg opp for å møte ham.",
    year: 1988,
  },
  {
    url: dumDumBoysOnstage1988,
    title: "Dum Dum Boys på scenen",
    description:
      "Vokalisten synger inn i mikrofonen mens gitaristen spiller ved siden av ham under konserten i 1988.",
    year: 1988,
  },
  {
    url: jokke1988,
    title: "Jokke spiller live",
    description:
      "Jokke spiller gitar og synger inn i mikrofonen under en konsert i 1988.",
    year: 1988,
  },
  {
    url: isfitWorkshop1999,
    title: "Workshop på ISFiT",
    description:
      "På ISFiT i 1999 samles deltakerne på gulvet for å diskutere bildene de har lagt utover mellom seg.",
    year: 1999,
  },
  {
    url: karpeDiem2010,
    title: "Karpe Diem live",
    description:
      "Karpe Diem er midt i en konsert i 2010. Vokalisten går fram på scenen mens resten av bandet spiller bak ham.",
    year: 2010,
  },
];

export default photos;
