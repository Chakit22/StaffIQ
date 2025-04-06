"use client";

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
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { courses } from "@/utils/courses";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roles } from "@/utils/roles";
import { availability } from "@/utils/availbility";
import { useApplicant } from "@/context/ApplicantProvider";

export default function TutorComponent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addApplicant, applicants } = useApplicant();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<Tutorformtype>();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin"); //redirect if not logged in
    }
  }, [loading, user]);

  const onSubmit = (formData: Tutorformtype) => {
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const { id, password, role, ...filteredUser } = user; //remove sensitive fields

    const hasAlreadyApplied = applicants.some(
      (a) =>
        a.id === id &&
        a.course_code === formData.course_code &&
        a.role === formData.role
    );

    if (hasAlreadyApplied) {
      toast.error("You've already applied for this role in this course."); //prevent duplicate
      return;
    }

    const newApplicant = {
      id,
      ...filteredUser,
      ...formData,
    };

    addApplicant(newApplicant); //save applicant
    toast.success("Application submitted successfully!");
    reset(); //reset form
  };

  return (
    <div className="grid grid-cols-2 w-full p-8 justify-items-center">
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
            {/*Course*/}
            <div className="flex flex-col gap-2">
              <Label>Course</Label>
              <Controller
                control={control}
                name="course_code"
                rules={{ required: "Please select your course" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {courses.map((course, i) => (
                          <SelectItem key={i} value={course.code}>
                            {course.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.course_code && (
                <span className="text-red-500">
                  {errors.course_code.message}
                </span>
              )}
            </div>

            {/*Role*/}
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Controller
                control={control}
                name="role"
                rules={{ required: "Please select a role" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {roles.map((role, i) => (
                          <SelectItem key={i} value={role}>
                            {role}
                          </SelectItem>
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

            {/*Availability*/}
            <div className="flex flex-col gap-2">
              <Label>Availability</Label>
              <Controller
                control={control}
                name="availability"
                rules={{ required: "Please select your availability" }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {availability.map((a, i) => (
                          <SelectItem key={i} value={a}>
                            {a}
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

            {/*Skills*/}
            <div className="flex flex-col gap-2">
              <Label>Skills</Label>
              <Textarea
                placeholder="List your relevant skills..."
                {...register("skills", {
                  required: "Skills must be at least 10 characters",
                  minLength: 10,
                })}
              />
              {errors.skills && (
                <span className="text-red-500">{errors.skills.message}</span>
              )}
            </div>

            {/*Academic Credentials*/}
            <div className="flex flex-col gap-2">
              <Label>Academic Credentials</Label>
              <Textarea
                placeholder="Your academic qualifications..."
                {...register("academic_creds", {
                  required: "Credentials must be at least 10 characters",
                  minLength: 10,
                })}
              />
              {errors.academic_creds && (
                <span className="text-red-500">
                  {errors.academic_creds.message}
                </span>
              )}
            </div>

            <Button type="submit" className="w-full">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>Previous Roles</div>
    </div>
  );
}
