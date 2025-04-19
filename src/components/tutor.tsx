"use client";

import React from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tutorformtype } from "@/types/Tutorformtype";
import { useAuth } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { courses } from "@/utils/courses";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { roles } from "@/utils/roles";
import { availability } from "@/utils/availbility";
import { useApplicant } from "@/context/ApplicantProvider";
import { Applicant } from "@/types/ApplicantType";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";
import LoaderComponent from "./Loading";

export default function TutorComponent() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  const {
    addApplicant,
    applicants,
    getApplicationsOfCurrentUser,
    applicantsLoading,
  } = useApplicant();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [id, setId] = useQueryState<number>(
    "id",
    parseAsInteger.withDefault(-1)
  );

  const form = useForm<Tutorformtype>({
    defaultValues: {
      course_code: "",
      role: "",
      availability: "",
      skills: "",
      academic_creds: "",
    },
  });

  useEffect(() => {
    if (!userLoading) {
      if (!user) router.replace("/signin"); //redirect if not logged in
      else setId(user.id);
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    // Update the form's skills value when skills array changes
    form.setValue("skills", skills.join(", "));
  }, [skills, form]);

  if (userLoading || applicantsLoading) {
    // User is still loading
    return <LoaderComponent />;
  }

  const previousRoles = useMemo(() => {
    if (!user) return [];
    return getApplicationsOfCurrentUser(user.id);
  }, [applicants, user, getApplicationsOfCurrentUser]);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    console.log(skillToRemove);
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = (formData: Tutorformtype) => {
    console.log(formData.skills);
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    const { id, ...filteredUser } = user; //remove sensitive fields

    const newApplicant = {
      id: applicants.length + 1,
      ...filteredUser,
      ...formData,
      user_id: id,
    };

    addApplicant(newApplicant); //save applicant
    toast.success("Application submitted successfully!");

    // Reset the form and skills state
    setSkills([]);
    form.reset({
      course_code: "",
      role: "",
      availability: "",
      skills: "",
      academic_creds: "",
    });
  };

  // Show loading overlay while loading
  if (isLoading) {
    return (
      <div className="w-full h-screen relative">
        <LoadingOverlay fullScreen text="Loading..." />
      </div>
    );
  }

  // Rest of the component remains unchanged
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
          <Form {...form}>
            <form
              className="flex flex-col justify-center gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Course */}
              <FormField
                control={form.control}
                name="course_code"
                rules={{ required: "Please select your course" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {courses.map((course, i) => (
                            <SelectItem key={i} value={course.code}>
                              {course.code} - {course.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                rules={{ required: "Please select a role" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Availability */}
              <FormField
                control={form.control}
                name="availability"
                rules={{ required: "Please select your availability" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills */}
              <FormField
                control={form.control}
                name="skills"
                rules={{
                  required: "Please add at least one skill",
                  validate: (value) =>
                    value.length > 0 || "Please add at least one skill",
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input
                          placeholder="Type a skill and press Enter..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleAddSkill}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="inline-flex items-center justify-center h-4 w-4 rounded-full hover:bg-gray-300 focus:outline-none"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <input type="hidden" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Academic Credentials */}
              <FormField
                control={form.control}
                name="academic_creds"
                rules={{
                  required: "Credentials must be at least 5 characters",
                  minLength: {
                    value: 5,
                    message: "Credentials must be at least 5 characters",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Credentials</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your academic qualifications..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="py-8 rounded-lg shadow-2xl w-2xs md:w-md">
        <CardHeader>
          <CardTitle>Previous Roles</CardTitle>
          <CardDescription>
            List of previous roles you have applied for and general experience
          </CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col gap-4">
          {previousRoles.length > 0 &&
            previousRoles.map((role: Applicant) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle>{role.role.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <span className="font-bold">Skills:</span> {role.skills}
                  </p>
                  <p>
                    <span className="font-bold">Academic Credentials:</span>{" "}
                    {role.academic_creds}
                  </p>
                  <p>
                    <span className="font-bold">Availability:</span>{" "}
                    {role.availability}
                  </p>
                </CardContent>
              </Card>
            ))}
          {previousRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No previous applications found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
