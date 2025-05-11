"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { CaptchaImage } from "../types/CaptchaImage";
import { useState } from "react";
import { shuffleArray } from "../utils/shuffleArray";
import { images } from "../utils/captcha";
import { Button } from "./ui/button";
import { captchaCategories } from "../utils/captcha";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function CAPTCHA({
  setIsVerified,
}: {
  setIsVerified: (isVerified: boolean) => void;
}) {
  const [currentCaptchaImages, setCurrentCaptchaImages] =
    useState<CaptchaImage[]>(images);
  const [selectedImages, setSelectedImages] = useState<CaptchaImage[]>([]);
  const [currentCategoryIdx, setCurrentCategoryIdx] = useState<number>(0);

  const handleImageToggleChange = (image: CaptchaImage) => {
    setSelectedImages((prev) =>
      prev.includes(image)
        ? prev.filter((img) => img != image)
        : [...prev, image]
    );
  };

  const handleVerifyCaptcha = () => {
    if (!selectedImages.length) {
      toast.error("Please select atleast one image.");
      return;
    }

    if (
      selectedImages.length ==
        currentCaptchaImages.filter(
          (captchaImage) =>
            captchaImage.category == captchaCategories[currentCategoryIdx]
        ).length &&
      selectedImages.every(
        (captchaImage) =>
          captchaImage.category == captchaCategories[currentCategoryIdx]
      )
    ) {
      // Sucesfully verified
      toast.success("Verified. You are a human!");

      setIsVerified(true);
    } else {
      // Not verified
      toast.error("Please try again!");

      // Clear out all the checkboxes
      setSelectedImages([]);

      // Shuffle the Images
      setCurrentCaptchaImages(shuffleArray(images));

      // Shuffle the current Category
      setCurrentCategoryIdx(
        Math.floor(Math.random() * captchaCategories.length)
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex justify-center items-center gap-2 w-2/5">
          <Shield className="h-5 w-5" />
          Verify Captcha
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-black">CAPTCHA Verification</DialogTitle>
        <DialogDescription asChild>
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            {currentCaptchaImages.map((image, i) => (
              <div
                key={i}
                className="flex flex-col justify-center items-center gap-2 w-full"
              >
                <div className="relative aspect-square w-full h-full">
                  <Image
                    key={i}
                    src={image.path}
                    alt=""
                    fill
                    sizes="
                    (max-width: 640px) 100vw,
                    (max-width: 768px) 50vw,
                    (max-width: 1024px) 33vw,
                    25vw
                    "
                  />
                </div>
                <Checkbox
                  checked={selectedImages.includes(image)}
                  onCheckedChange={() => {
                    handleImageToggleChange(image);
                  }}
                />
              </div>
            ))}
          </div>
        </DialogDescription>
        <div className="text-sm text-black flex justify-center">
          Please select all the images that are{" "}
          {captchaCategories[currentCategoryIdx]}
        </div>
        <Button onClick={handleVerifyCaptcha}>Verify</Button>
      </DialogContent>
    </Dialog>
  );
}

// asChild passes all the props through the child element and does not add a wrapper around the child elements
