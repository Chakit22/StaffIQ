"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

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

interface CaptchaProps {
    openDialog: boolean;;
    setOpenDialog: (openDialog: boolean) => void;
}

export default function CAPTCHA({ openDialog, setOpenDialog }: CaptchaProps) {
  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <Dialog open={openDialog} onOpenChange={toggleDialog}>
      <DialogContent>
        <div className="grid grid-cols-3 gap-3 justify-items-center">
          {images.map((path, i) => (
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
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
