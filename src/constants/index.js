import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  fashionswipe,
  metaversus,
  wemakeclothes,
  rethestatew,
  nick,
  threejs,
  solidity,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Ui/UX designer",
    icon: mobile,
  }, 

  {
    title: "Web Developer",
    icon: web,
  },
 
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Web3 Developer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "solidity",
    icon: solidity,
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rio proved me wrong.",
    name: "Nick Valladares",
    designation: "CFO",
    company: "Rethestate",
    image: nick,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rio does.",
    name: "Ani Cletus",
    designation: "General manager",
    company: "Aptech",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rio optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  
  {
    name: "Metaversus",
    description:
      "I designed and developed a website that allows clients to create and customize clothing virtually. The platform provides an interactive and user-friendly interface, enabling users to experiment with designs, colors, and pictures in real time.",
    tags: [
      {
        name: "Nextjs13",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "green-text-gradient",
      },
      {
        name: "framermotion",
        color: "pink-text-gradient",
      },
    ],
    image: metaversus,
    source_code_link: "https://github.com/Riocodex/Metaversus/tree/main",
    website_link: "",
  },
  {
    name: "WeMakeClothes",
    description:
      "I designed and developed an innovative website that empowers clients to design clothing virtually. The platform allows users to explore their creativity by customizing garments with a wide range of design options. ",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tailwind",
        color: "green-text-gradient",
      },
      {
        name: "threejs",
        color: "pink-text-gradient",
      },
    ],
    image: wemakeclothes,
    source_code_link: "https://github.com/Riocodex/threejjs",
    website_link: "",
  },
  {
    name: "Rethestate",
    description:
      "A digital platform that functions as a marketplace for buying and selling houses, with the unique feature of using Non-Fungible Tokens (NFTs) to represent each individual property.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "solidity",
        color: "green-text-gradient",
      },
      {
        name: "web3js",
        color: "pink-text-gradient",
      },
    ],
    image: rethestatew,
    source_code_link: "https://github.com/Riocodex/RealNFT",
    website_link: "",
  },
  // {
  //   name: "Fashion Swipe",
  //   description:
  //     "I built an eCommerce website using the MERN stack featuring authentication, detailed views, cart management, and secure checkout for a seamless shopping experience.",
  //   tags: [
  //     {
  //       name: "react",
  //       color: "blue-text-gradient",
  //     },
  //     {
  //       name: "mongodb",
  //       color: "green-text-gradient",
  //     },
  //     {
  //       name: "node.js",
  //       color: "pink-text-gradient",
  //     },
  //   ],
  //   image: fashionswipe,
  //   source_code_link: "https://github.com/Riocodex/E-commerce",
  // },
];

export { services, technologies, testimonials, projects };
