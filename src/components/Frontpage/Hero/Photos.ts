import harvest from "@/assets/images/frontpage/harvest.jpg";
import konradsen from "@/assets/images/frontpage/konradsen.jpg";
import no4Crowd from "@/assets/images/frontpage/no-4-crowd.jpg";
import no4Live from "@/assets/images/frontpage/no-4-live.jpg";
import poOmPo from "@/assets/images/frontpage/po-om-po.jpg";
import swingmaraton from "@/assets/images/frontpage/swingmaraton.jpg";
import symforch from "@/assets/images/frontpage/symforch.jpg";

type Photo = {
  url: string;
  title: string;
  description?: string;
  year: number;
  orientation: "landscape" | "portrait";
};

const photos: Photo[] = [
  {
    url: no4Live,
    title: "No.4",
    description: "Dritfet konsert i storsalen, skulle vært der du",
    year: 2026,
    orientation: "landscape",
  },
  {
    url: swingmaraton,
    title: "Swingmaraton",
    description: "Med S. Møller Storband og venner",
    year: 2026,
    orientation: "portrait",
  },
  {
    url: poOmPo,
    title: "Pø om Pø",
    description: "funnyyyyyy",
    year: 2026,
    orientation: "landscape",
  },
  {
    url: harvest,
    title: "Harvest",
    description: "23.59 i Vuelie",
    year: 2026,
    orientation: "landscape",
  },
  {
    url: symforch,
    title: "Symforch",
    description: "woohoo",
    year: 2026,
    orientation: "portrait",
  },
  {
    url: no4Crowd,
    title: "No.4",
    description: "Dritbra publikum i storsalen henda i været yippiiii",
    year: 2026,
    orientation: "landscape",
  },
  {
    url: konradsen,
    title: "Konradsen",
    description: "Konsert i Skala, var veldig vibes",
    year: 2026,
    orientation: "landscape",
  },
];

export default photos;
