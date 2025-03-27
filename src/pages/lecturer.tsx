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
import { Tutorformtype } from "@/types/TutorFormtype";
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
    <>
      <Navbar />
      {/* Main content */}
      <Card className="m-12">
        <CardHeader className="bg-blue-500">
          <CardTitle className="text-white">Select Course</CardTitle>
          <CardDescription>
            View and manage tutor applications for a specific course
          </CardDescription>
        </CardHeader>
      </Card>
      <Footer />
    </>
  );
}
