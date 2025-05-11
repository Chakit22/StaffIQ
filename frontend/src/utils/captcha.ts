import { CaptchaImage } from "../types/CaptchaImage";

export const images: CaptchaImage[] = [
  { category: "dogs", path: "/images/dog1.jpg" },
  { category: "dogs", path: "/images/dog2.jpg" },
  { category: "dogs", path: "/images/dog3.jpg" },
  { category: "cats", path: "/images/cat1.jpg" },
  { category: "cats", path: "/images/cat2.jpg" },
  { category: "elephants", path: "/images/elephant1.jpg" },
  { category: "elephants", path: "/images/elephant2.jpg" },
  { category: "birds", path: "/images/bird1.jpg" },
  { category: "birds", path: "/images/bird2.jpg" },
];

export const captchaCategories: string[] = [
  "dogs",
  "cats",
  "elephants",
  "birds",
];
