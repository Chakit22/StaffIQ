"use client";

import { Tutorformtype } from "@/types/Tutorformtype";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Layout from "@/components/layout";
import { ApplicantProvider } from "@/context/ApplicantProvider";
import LecturerComponent from "@/components/lecturer";

export default function Lecturer() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Tutorformtype>();

  const onSubmit = (formData: Tutorformtype) => {
    console.log(formData);
    toast.success("Application submitted sucessfully!");
    // Reset the form
    reset();
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.replace("/");
    }
  }, []);

  return (
    <ApplicantProvider>
      <LecturerComponent />
    </ApplicantProvider>
  );
}
