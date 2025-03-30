"use client";

import { Tutorformtype } from "@/types/Tutorformtype";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { UseFormRegister } from "react-hook-form";

interface SelectMenuProps {
  placeholder: string;
  items: any[];
  register: UseFormRegister<Tutorformtype>;
}

export default function SelectMenu({
  placeholder,
  items,
  register,
}: SelectMenuProps) {
  return (
    <Select {...register}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item, i) => (
            <SelectItem value={item.label}>{item.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
