type Photo = {
    url: string;
    title: string;
    description?: string;
    year: number;
    orientation: "landscape" | "portrait";
}

const photoUrls = Object.values(import.meta.glob<string>("@/assets/images/frontpage/*", {
    query: "?url",
    eager: true,
    import: "default"
}));

const photos: Photo[] = [
    {
        url: photoUrls[0],
        title: "No.4",
        description: "Dritfet konsert i storsalen, skulle vært der du",
        year: 2026,
        orientation: "landscape",
    },
    {
        url: photoUrls[1],
        title: "Swingmaraton",
        description: "Med S. Møller Storband og venner",
        year: 2026,
        orientation: "portrait",
    },
    {
        url: photoUrls[2],
        title: "Pø om Pø",
        description: "funnyyyyyy",
        year: 2026,
        orientation: "landscape",
    },
    {
        url: photoUrls[3],
        title: "Harvest",
        description: "23.59 i Vuelie",
        year: 2026,
        orientation: "landscape",
    },
    {
        url: photoUrls[4],
        title: "Symforch",
        description: "A puppy playing outdoors.",
        year: 2026,
        orientation: "portrait",
    },
    {
        url: photoUrls[5],
        title: "No.4",
        description: "Dritbra publikum i storsalen henda i været yippiiii",
        year: 2026,
        orientation: "landscape",
    },
    {
        url: photoUrls[6],
        title: "Konradsen",
        description: "Konsert i Skala, var veldig vibes",
        year: 2026,
        orientation: "landscape",
    },
];

export default photos;
