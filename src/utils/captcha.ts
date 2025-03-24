import { CaptchaImage } from "@/types/CaptchaImage";

export const images: CaptchaImage[] = [
  { category: "dog", path: "/images/dog1.jpg" },
  { category: "dog", path: "/images/dog2.jpg" },
  { category: "dog", path: "/images/dog3.jpg" },
  { category: "cat", path: "/images/cat1.jpg" },
  { category: "cat", path: "/images/cat2.jpg" },
  { category: "elephant", path: "/images/elephant1.jpg" },
  { category: "elephant", path: "/images/elephant2.jpg" },
  { category: "bird", path: "/images/bird1.jpg" },
  { category: "bird", path: "/images/bird2.jpg" },
];

export const captchaCategories: string[] = [
  "dogs",
  "cats",
  "elephants",
  "birds",
];
