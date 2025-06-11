"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { useAuthContext } from "@/context/UserProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import LoaderComponent from "./Loading";
import { zodResolver } from "@hookform/resolvers/zod";

// API Hooks
import useApplication from "@/hooks/useApplication";
import useCourse from "@/hooks/useCourse";
import useRole from "@/hooks/useRole";
import useAvailability from "@/hooks/useAvailability";
import useSkill from "@/hooks/useSkill";

// Types and Schemas
import { CreateApplicationSchema } from "@/schemas/applications/create-application.schema";
import { Course } from "@/types/Course";
import { Role } from "@/types/Role";
import { Availability } from "@/types/Availability";
import { Skill } from "@/types/Skill";

export default function CandidateComponent() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  // API Hooks
  const { createNewApplication } = useApplication();
  const { getAllCourses } = useCourse();
  const { getAllRoles } = useRole();
  const { getAllAvailabilities } = useAvailability();
  const { getAllSkills } = useSkill();

  // State for dropdown data
  const [courses, setCourses] = useState<Course[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // State for skills management
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // URL state
  const [, setId] = useQueryState("id", parseAsString.withDefault(""));

  const form = useForm<CreateApplicationSchema>({
    resolver: zodResolver(CreateApplicationSchema),
    defaultValues: {
      academic_creds: "",
      userId: "",
      courseId: "",
      roleId: "",
      availabilityId: "",
      skills: [],
    },
  });

  // Fetch initial data
  useEffect(() => {
    if (!loading && user) {
      setId(user.id);
      form.setValue("userId", user.id);
      fetchInitialData();
    } else if (!loading && !user) {
      router.replace("/signin");
    }
  }, [loading, user, router, setId, form]);

  // Filter skills based on input
  useEffect(() => {
    if (skillInput.trim()) {
      const filtered = allSkills
        .filter(
          (skill) =>
            skill.name.toLowerCase().includes(skillInput.toLowerCase()) &&
            !skills.includes(skill.name)
        )
        .slice(0, 5); // Top 5 matches
      setFilteredSkills(filtered);
      setShowSkillDropdown(filtered.length > 0);
    } else {
      setFilteredSkills([]);
      setShowSkillDropdown(false);
    }
  }, [skillInput, allSkills, skills]);

  const fetchInitialData = async () => {
    try {
      setIsLoadingData(true);

      console.log("Fetching initial data...");

      // Fetch all dropdown data in parallel
      const [coursesRes, rolesRes, availabilitiesRes, skillsRes] =
        await Promise.all([
          getAllCourses(),
          getAllRoles(),
          getAllAvailabilities(),
          getAllSkills(),
        ]);

      console.log("API Responses:", {
        courses: coursesRes,
        roles: rolesRes,
        availabilities: availabilitiesRes,
        skills: skillsRes,
      });

      if (coursesRes.success) {
        setCourses(coursesRes.body as Course[]);
        console.log("Courses loaded:", coursesRes.body);
      } else {
        console.error("Failed to load courses:", coursesRes.message);
        toast.error(`Failed to load courses: ${coursesRes.message}`);
      }

      if (rolesRes.success) {
        setRoles(rolesRes.body as Role[]);
        console.log("Roles loaded:", rolesRes.body);
      } else {
        console.error("Failed to load roles:", rolesRes.message);
        toast.error(`Failed to load roles: ${rolesRes.message}`);
      }

      if (availabilitiesRes.success) {
        setAvailabilities(availabilitiesRes.body as Availability[]);
        console.log("Availabilities loaded:", availabilitiesRes.body);
      } else {
        console.error(
          "Failed to load availabilities:",
          availabilitiesRes.message
        );
        toast.error(
          `Failed to load availabilities: ${availabilitiesRes.message}`
        );
      }

      if (skillsRes.success) {
        setAllSkills(skillsRes.body as Skill[]);
        console.log("Skills loaded:", skillsRes.body);
      } else {
        console.error("Failed to load skills:", skillsRes.message);
        toast.error(`Failed to load skills: ${skillsRes.message}`);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkillInput(e.target.value);
  };

  const handleSkillSelect = (skillName: string) => {
    if (!skills.includes(skillName)) {
      setSkills([...skills, skillName]);
    }
    setSkillInput("");
    setShowSkillDropdown(false);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
      setShowSkillDropdown(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const onSubmit = async (formData: CreateApplicationSchema) => {
    if (!user) {
      toast.error("User not logged in.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert skills array to the required format
      const skillObjects = skills.map((skill) => ({ name: skill }));

      const applicationData: CreateApplicationSchema = {
        ...formData,
        skills: skillObjects,
      };

      console.log("Submitting application:", applicationData);

      const response = await createNewApplication(applicationData);

      if (response.success) {
        toast.success("Application submitted successfully!");

        // Reset form and skills
        setSkills([]);
        form.reset({
          academic_creds: "",
          userId: user.id,
          courseId: "",
          roleId: "",
          availabilityId: "",
          skills: [],
        });
      } else {
        toast.error(response.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred while submitting the application");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading overlay while loading
  if (loading || isLoadingData) {
    return <LoaderComponent />;
  }

  // Redirect if user is not logged in
  if (!user) {
    router.replace("/signin");
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="py-8 shadow-2xl bg-blue-50 w-full max-w-2xl">
        <div className="text-2xl font-bold px-6">Apply for Roles</div>
        <div className="text-sm text-muted-foreground px-6">
          Apply for tutor and lab-assistant roles for the current semester
        </div>
        <CardContent>
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Course */}
              <FormField
                control={form.control}
                name="courseId"
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
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.course_code} - {course.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-courses" disabled>
                              No courses available
                            </SelectItem>
                          )}
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
                name="roleId"
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
                          {roles.length > 0 ? (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-roles" disabled>
                              No roles available
                            </SelectItem>
                          )}
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
                name="availabilityId"
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
                          {availabilities.length > 0 ? (
                            availabilities.map((availability) => (
                              <SelectItem
                                key={availability.id}
                                value={availability.id}
                              >
                                {availability.availability}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-availabilities" disabled>
                              No availabilities available
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skills with Autocomplete */}
              <div>
                <FormLabel>Skills</FormLabel>
                <div className="relative">
                  <Input
                    placeholder="Type skill and press Enter or select from suggestions"
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    onKeyDown={handleAddSkill}
                    onFocus={() =>
                      skillInput &&
                      setShowSkillDropdown(filteredSkills.length > 0)
                    }
                    onBlur={() =>
                      setTimeout(() => setShowSkillDropdown(false), 200)
                    }
                  />

                  {/* Skills Dropdown */}
                  {showSkillDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredSkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSkillSelect(skill.name)}
                        >
                          {skill.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Academic Credentials */}
              <FormField
                control={form.control}
                name="academic_creds"
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

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
