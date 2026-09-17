/**
 * Project data — image paths reference files in /public/images/projects/.
 *
 * Place the following images in your /public/images/projects/ directory:
 *
 *   bluecode-hero.jpg      — Bluecode main project image
 *   bluecode-secondary.jpg — Bluecode marketing materials
 *   numberx-hero.jpg       — NumberX app and card design
 *   numberx-secondary.jpg  — NumberX brand lifestyle
 *   paydora-hero.jpg       — Paydora platform visual
 *   paydora-team.jpg       — Paydora team photo
 *   baqme-hero.jpg         — Baqme cargo bike branding
 *   baqme-secondary.jpg    — Baqme community mobility
 *   baqme-tertiary.jpg     — Baqme app and cargo bike
 *   betterdeals-hero.jpg   — Better Deals brand visual
 *
 * Recommended: Export at 1600×900 (16:9) for hero images, optimize with
 * squoosh.app or sharp to keep each file < 200 KB.
 */

const IMG = "/images/projects";

export interface GalleryAsset {
  type: "image" | "video" | "youtube";
  src: string;
  alt: string;
  /** Optional aspect ratio hint: "wide" (16:9), "square", "tall" (3:4). Default "wide" */
  aspect?: "wide" | "square" | "tall";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  /** Extended description shown on the Work detail page */
  longDescription?: string;
  /** One-line role descriptor */
  role: string;
  scope: string[];
  location: { city: string; country: string };
  /** Static image — always shown as poster / fallback */
  image: string;
  /** Dedicated preview thumbnail (e.g. YouTube maxres); falls back to `image` */
  thumbnail?: string;
  /** If present, the card plays a looping video after entering the viewport */
  video?: string;
  /** YouTube video ID for embedded playback */
  youtubeId?: string;
  /** 0-1 brightness reduction applied to the image (higher = darker) */
  overlay: number;
  /** Gallery assets for the Work page */
  gallery: GalleryAsset[];
}

export const PROJECTS: Project[] = [
  {
    id: "bluecode",
    title: "Bluecode",
    description:
      "Product design and UX for a European mobile payment platform.",
    longDescription:
      "Interface design and user experience across multiple product surfaces, focusing on clarity, scalability, and real-world usability. Also developed sales presentations and keynote materials to support product communication and stakeholder engagement.",
    role: "Product design and UI/UX",
    scope: [
      "Product Design",
      "UX Design",
      "Design Systems",
      "Sales Presentations",
    ],
    location: { city: "Vienna", country: "Austria" },
    image: `${IMG}/bluecode-hero.jpg`,
    overlay: 0.2,
    gallery: [
      {
        type: "image",
        src: `${IMG}/bluecode-hero.jpg`,
        alt: "Bluecode mobile payment app",
        aspect: "wide",
      },
      {
        type: "image",
        src: `${IMG}/bluecode-secondary.jpg`,
        alt: "Bluecode marketing materials",
        aspect: "wide",
      },
    ],
  },
  {
    id: "numberx",
    title: "NumberX",
    description:
      "Brand and product design for a next-generation fintech platform in the card and payments space.",
    longDescription:
      "Built as a modern alternative to traditional payment experiences, combining brand identity and product design across multiple touchpoints. The company was later acquired by Dock Financial.",
    role: "Brand development and interface design",
    scope: ["Brand Identity", "Product Design", "UI/UX", "Design System"],
    location: { city: "Vienna", country: "Austria" },
    image: `${IMG}/numberx-hero.jpg`,
    thumbnail: "https://img.youtube.com/vi/s-0GvtbNxX4/maxresdefault.jpg",
    youtubeId: "s-0GvtbNxX4",
    overlay: 0.2,
    gallery: [
      {
        type: "youtube",
        src: "s-0GvtbNxX4",
        alt: "NumberX brand film",
        aspect: "wide",
      },
      {
        type: "image",
        src: `${IMG}/numberx-hero.jpg`,
        alt: "NumberX app and card design",
        aspect: "wide",
      },
      {
        type: "image",
        src: `${IMG}/numberx-secondary.jpg`,
        alt: "NumberX brand lifestyle",
        aspect: "wide",
      },
    ],
  },
  {
    id: "paydora",
    title: "Paydora",
    description:
      "Brand and product design for a B2B fintech platform.",
    longDescription:
      "Contributed to early brand direction and initial product design, followed by expansion into additional product surfaces and supporting materials for sales and communication. The company was later acquired by Dock Financial.",
    role: "Brand identity and product design",
    scope: [
      "Visual Identity",
      "Brand System",
      "Product Design",
      "Sales Materials",
    ],
    location: { city: "Munich", country: "Germany" },
    image: `${IMG}/paydora-hero.jpg`,
    overlay: 0.25,
    gallery: [
      {
        type: "image",
        src: `${IMG}/paydora-team.jpg`,
        alt: "Paydora team",
        aspect: "square",
      },
    ],
  },
  {
    id: "baqme",
    title: "Baqme",
    description:
      "Brand and interface design for a cargo bike rental platform.",
    longDescription:
      "A rental experience allowing users to locate, unlock, and ride cargo bikes on demand, focused on creating a simple and intuitive flow for real-world usage in urban environments.",
    role: "Brand identity and interface design",
    scope: [
      "Brand Identity",
      "Color System",
      "Interface Design",
      "Marketing Materials",
    ],
    location: { city: "Rotterdam", country: "Netherlands" },
    image: `${IMG}/baqme-hero.jpg`,
    overlay: 0.3,
    gallery: [
      {
        type: "image",
        src: `${IMG}/baqme-hero.jpg`,
        alt: "Baqme cargo bike branding",
        aspect: "wide",
      },
      {
        type: "image",
        src: `${IMG}/baqme-secondary.jpg`,
        alt: "Baqme community mobility campaign",
        aspect: "wide",
      },
      {
        type: "image",
        src: `${IMG}/baqme-tertiary.jpg`,
        alt: "Baqme app and cargo bike",
        aspect: "wide",
      },
    ],
  },
  {
    id: "betterdeals",
    title: "Better Deals",
    description:
      "Branding, marketing, and campaign execution for a leading electronics retailer in Curacao.",
    longDescription:
      "Led brand development and high-impact marketing initiatives, including TV commercial production and large-scale campaigns, ensuring consistent and effective communication across key channels.",
    role: "Brand development and campaign design",
    scope: [
      "Branding",
      "Marketing Design",
      "Campaign Strategy",
      "TV Commercial Production",
    ],
    location: { city: "Willemstad", country: "Curacao" },
    image: `${IMG}/betterdeals-hero.jpg`,
    youtubeId: "_vVF66yfxTA",
    overlay: 0.22,
    gallery: [
      {
        type: "youtube",
        src: "_vVF66yfxTA",
        alt: "Better Deals TV commercial",
        aspect: "wide",
      },
    ],
  },
];
