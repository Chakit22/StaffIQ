"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tutorformtype } from "@/types/Tutorformtype";
import { useAuth } from "@/context/UserProvider";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { courses } from "@/utils/courses";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roles } from "@/utils/roles";
import { availability } from "@/utils/availbility";
import Layout from "@/components/layout";
import { ApplicantProvider, useApplicant } from "@/context/ApplicantProvider";
import TutorComponent from "@/components/tutor";

export default function Tutor() {
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
    toast.success("Application submitted sucessfully!");
    // Reset the form
    // Add a new applicant
    reset();
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      router.replace("/");
    }
  }, []);

  return (
    <Layout>
      <TutorComponent />
    </Layout>
  );
}
