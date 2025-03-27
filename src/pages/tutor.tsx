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
      <div className="grid grid-cols-2 w-full p-8 justify-items-center">
        {/* Form to fill the information */}
        <Card className="py-8 rounded-lg shadow-2xl w-2xs md:w-md bg-blue-50">
          <CardHeader>
            <CardTitle>Apply for Roles</CardTitle>
            <CardDescription>
              Apply for tutor and lab-assistant roles for the current semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col justify-center gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Select a course */}
              <div className="flex flex-col gap-2 justify-center">
                <Label>Course</Label>
                <Controller
                  control={control}
                  name="course"
                  rules={{ required: "Please select your course" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {courses.map((course, i) => (
                            <SelectItem value={course.label}>
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.course && (
                  <span className="text-red-500">{errors.course.message}</span>
                )}
              </div>

              {/* Select a role */}
              <div className="flex flex-col gap-2 justify-center">
                <Label>Role</Label>
                <Controller
                  control={control}
                  name="role"
                  rules={{ required: "Please select a role" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {roles.map((role, i) => (
                            <SelectItem value={role}>{role}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && (
                  <span className="text-red-500">{errors.role.message}</span>
                )}
              </div>

              {/* Select availability */}
              <div className="flex flex-col gap-2 justify-center">
                <Label>Availability</Label>
                <Controller
                  control={control}
                  name="availability"
                  rules={{ required: "Please select your availability" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {availability.map((availability, i) => (
                            <SelectItem value={availability}>
                              {availability}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.availability && (
                  <span className="text-red-500">
                    {errors.availability.message}
                  </span>
                )}
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2 justify-center">
                <Label>Skills</Label>
                <Textarea
                  placeholder="List your relavant skills and experience..."
                  {...register("skills", {
                    required: "Skills must be atleast 10 characters",
                  })}
                />
                {errors.skills && (
                  <span className="text-red-500">{errors.skills.message}</span>
                )}
              </div>

              {/* Aacademic credentials */}
              <div className="flex flex-col gap-2 justify-center">
                <Label>Academic Credentials</Label>
                <Textarea
                  placeholder="List your academic qualifications..."
                  {...register("academic_creds", {
                    required:
                      "Academic Credentials must be atleast 10 characters",
                  })}
                />
                {errors.academic_creds && (
                  <span className="text-red-500">
                    {errors.academic_creds.message}
                  </span>
                )}
              </div>

              <Button type="submit" className="w-full rounded-sm text-md">
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
        <div>Previous Roles</div>
      </div>
      <Footer />
    </>
  );
}
