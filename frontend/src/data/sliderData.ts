type Slide = {
  id: number;
  title: string;
  description: string;
  price: string;
  img: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Xbox Consoles",
    description:
      "Save up to 50% on select Xbox games. Get 3 months of PC Game Pass for $2 USD.",
    price: "$299",
    img: "/xbox.png",
  },
  {
    id: 2,
    title: "PlayStation Consoles",
    description:
      "Get exclusive titles and save up to 40% on PS Plus subscriptions.",
    price: "$399",
    img: "/ps4.png",
  },
  {
    id: 3,
    title: "Nintendo Consoles",
    description:
      "Enjoy family-friendly fun and top-rated games with Nintendo Switch.",
    price: "$349",
    img: "/switch2.png",
  },
];

export default slides;
