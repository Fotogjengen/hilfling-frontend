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
        title: "Live performance",
        description: "A band playing beneath concert lights.",
        year: 2025,
        orientation: "landscape",
    },
    {
        url: photoUrls[1],
        title: "Dancing mouse",
        description: "A small mouse caught mid-dance.",
        year: 2024,
        orientation: "portrait",
    },
    {
        url: photoUrls[2],
        title: "Dog with a stick",
        description: "A dog holding a branch in its mouth.",
        year: 2023,
        orientation: "landscape",
    },
    {
        url: photoUrls[3],
        title: "Kingfisher",
        description: "A kingfisher perched on a branch.",
        year: 2022,
        orientation: "landscape",
    },
    {
        url: photoUrls[4],
        title: "Puppy in the grass",
        description: "A puppy playing outdoors.",
        year: 2021,
        orientation: "portrait",
    },
    {
        url: photoUrls[5],
        title: "Sailboat at sunset",
        description: "A sailboat on the water at sunset.",
        year: 2020,
        orientation: "landscape",
    },
    {
        url: photoUrls[6],
        title: "Atlantic puffin",
        description: "A close-up of an Atlantic puffin.",
        year: 2019,
        orientation: "portrait",
    },
];

export default photos;
