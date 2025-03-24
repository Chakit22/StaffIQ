"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";

const images = [
  "/images/dog1.jpg",
  "/images/dog2.jpg",
  "/images/dog3.jpg",
  "/images/cat1.jpg",
  "/images/cat2.jpg",
  "/images/elephant1.jpg",
  "/images/elephant2.jpg",
  "/images/bird1.jpg",
  "/images/bird2.jpg",
];

export default function CAPTCHA() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger onClick={() => setOpenDialog(true)}>
        Verify CAPTCHA
      </DialogTrigger>
      <DialogContent>
        <DialogDescription asChild>
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            {images.map((path, i) => (
              <div className="flex flex-col justify-center items-center gap-2 w-full">
                <div key={i} className="relative aspect-[16/9] w-full">
                  <Image
                    key={i}
                    src={path}
                    alt=""
                    fill
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                    className="absolute"
                  />
                </div>
                <Checkbox />
              </div>
            ))}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

// asChild passes all the props through the child element and does not add a wrapper around the child elements
