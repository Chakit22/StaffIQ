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
import { X, Upload, FileText } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";
import LoaderComponent from "./Loading";
import MyApplications from "./MyApplications";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/animations";

// API Hooks
import useApplication from "@/hooks/useApplication";
import useCourse from "@/hooks/useCourse";
import useRole from "@/hooks/useRole";
import useAvailability from "@/hooks/useAvailability";
import useSkill from "@/hooks/useSkill";
import useUser from "@/hooks/useUser";

// Types and Schemas
import { CreateApplicationSchema } from "@/schemas/applications/create-application.schema";
import { Course } from "@/types/Course";
import { Role } from "@/types/Role";
import { Availability } from "@/types/Availability";
import { Skill } from "@/types/Skill";
import { Experience } from "@/types/Experience";

export default function CandidateComponent() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  // API Hooks
  const { createNewApplication, uploadResume } = useApplication();
  const { getAllCourses } = useCourse();
  const { getAllRoles } = useRole();
  const { getAllAvailabilities } = useAvailability();
  const { getAllSkills } = useSkill();
  const { getAllExperiences } = useUser();

  // State for dropdown data
  const [courses, setCourses] = useState<Course[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  // State for user data
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // State for skills management
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  // Resume file state
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Cover letter mode
  const [coverLetterMode, setCoverLetterMode] = useState<"write" | "upload">("write");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<"apply" | "my-applications">("apply");

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // URL state
  const [, setId] = useQueryState("id", parseAsString.withDefault(""));

  const form = useForm<CreateApplicationSchema>({
    resolver: zodResolver(CreateApplicationSchema),
    defaultValues: {
      academic_creds: "",
      cover_letter: "",
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
      const [
        coursesRes,
        rolesRes,
        availabilitiesRes,
        skillsRes,
        experiencesRes,
      ] = await Promise.all([
        getAllCourses(),
        getAllRoles(),
        getAllAvailabilities(),
        getAllSkills(),
        user
          ? getAllExperiences(user.id)
          : Promise.resolve({ success: false, body: [] }),
      ]);

      console.log("API Responses:", {
        courses: coursesRes,
        roles: rolesRes,
        availabilities: availabilitiesRes,
        skills: skillsRes,
        experiences: experiencesRes,
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

      if (experiencesRes.success) {
        setExperiences(experiencesRes.body as Experience[]);
        console.log("Experiences loaded:", experiencesRes.body);
      } else if ("message" in experiencesRes) {
        console.error("Failed to load experiences:", experiencesRes.message);
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

    if (!resumeFile) {
      toast.error("Please upload your resume (PDF) before submitting.");
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
        // Upload resume if provided
        const createdApp = response.body as { id?: string } | null;
        if (resumeFile && createdApp?.id) {
          const uploadRes = await uploadResume(createdApp.id, resumeFile);
          if (!uploadRes.success) {
            toast.error("Application created but resume upload failed. You can upload it later from My Applications.");
          }
        }

        toast.success("Application submitted successfully!");

        // Reset form and skills
        setSkills([]);
        setResumeFile(null);
        setCoverLetterFile(null);
        setCoverLetterMode("write");
        form.reset({
          academic_creds: "",
          cover_letter: "",
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
    <div className="flex flex-col gap-6 p-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={activeTab === "apply" ? "default" : "outline"}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Roles
        </Button>
        <Button
          variant={activeTab === "my-applications" ? "default" : "outline"}
          onClick={() => setActiveTab("my-applications")}
        >
          My Applications
        </Button>
      </div>

      {/* My Applications Tab */}
      {activeTab === "my-applications" && user && (
        <div className="max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-bold mb-4">My Applications</h2>
          <MyApplications userId={user.id} />
        </div>
      )}

      {/* Apply Tab */}
      {activeTab === "apply" && (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center"
      >
      {/* Application Form */}
      <motion.div variants={staggerItem} className="w-full max-w-2xl">
      <Card className="py-8 shadow-2xl bg-card border-border w-full max-w-2xl">
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
                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredSkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="px-3 py-2 hover:bg-accent/20 cursor-pointer"
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
                      className="flex items-center gap-1 pr-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveSkill(skill);
                        }}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
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

              {/* Cover Letter */}
              <div>
                <FormLabel>Cover Letter (Optional)</FormLabel>
                <div className="flex gap-2 mt-1 mb-2">
                  <Button
                    type="button"
                    variant={coverLetterMode === "write" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCoverLetterMode("write")}
                  >
                    Write
                  </Button>
                  <Button
                    type="button"
                    variant={coverLetterMode === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCoverLetterMode("upload")}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
                {coverLetterMode === "write" ? (
                  <FormField
                    control={form.control}
                    name="cover_letter"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Write a cover letter to support your application..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      className="hidden"
                      id="cover-letter-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCoverLetterFile(file);
                          // Read text content for .txt files
                          if (file.type === "text/plain") {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              form.setValue("cover_letter", ev.target?.result as string || "");
                            };
                            reader.readAsText(file);
                          } else {
                            form.setValue("cover_letter", `[Uploaded: ${file.name}]`);
                          }
                        }
                      }}
                    />
                    <label htmlFor="cover-letter-upload" className="cursor-pointer">
                      {coverLetterFile ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm">{coverLetterFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setCoverLetterFile(null);
                              form.setValue("cover_letter", "");
                            }}
                            className="ml-2"
                          >
                            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <Upload className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Click to upload cover letter</p>
                          <p className="text-xs mt-1">PDF, TXT, DOC, DOCX</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Resume Upload */}
              <div>
                <FormLabel>Resume <span className="text-destructive">*</span></FormLabel>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center mt-1 ${resumeFile ? "border-primary/50" : "border-border"}`}>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type !== "application/pdf") {
                          toast.error("Only PDF files are allowed for resumes");
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("Resume must be under 5MB");
                          return;
                        }
                        setResumeFile(file);
                      }
                    }}
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {resumeFile ? (
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">{resumeFile.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setResumeFile(null);
                          }}
                          className="ml-2"
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Click to upload resume (PDF)</p>
                        <p className="text-xs mt-1">Max 5MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Previous Experience */}
      <motion.div variants={staggerItem} className="w-full max-w-2xl">
      <Card className="py-8 rounded-lg shadow-2xl bg-card border-border w-full max-w-2xl">
        <div className="text-2xl font-bold px-6">Work Experience</div>
        <div className="text-sm text-muted-foreground px-6">
          Your professional work experience history
        </div>
        <CardContent className="flex flex-col gap-4">
          <div>
            {experiences.length > 0 ? (
              experiences.map((experience) => (
                <Card key={experience.id} className="px-4 py-3 mb-3">
                  <div className="text-lg font-semibold">{experience.role}</div>
                  <p>
                    <span className="font-bold">Company:</span>{" "}
                    {experience.company_name}
                  </p>
                  <p>
                    <span className="font-bold">Description:</span>{" "}
                    {experience.description}
                  </p>
                  <p>
                    <span className="font-bold">Duration:</span>{" "}
                    {new Date(experience.start_date).toLocaleDateString()} -{" "}
                    {experience.end_date
                      ? new Date(experience.end_date).toLocaleDateString()
                      : "Present"}
                  </p>
                </Card>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No work experience found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </motion.div>
      </motion.div>
      )}
    </div>
  );
}
