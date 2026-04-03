"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Course } from "@/types/Course";
import { Role } from "@/types/Role";
import { Availability } from "@/types/Availability";
import { Skill } from "@/types/Skill";

type FilterSidebarProps = {
  courses: Course[];
  roles: Role[];
  availabilities: Availability[];
  skills: Skill[];
  onApplyFilters: (filters: {
    courses?: string[];
    roles?: string[];
    availabilities?: string[];
    skills?: string[];
  }) => void;
};

const FilterSidebar = ({
  courses,
  roles,
  availabilities,
  skills,
  onApplyFilters,
}: FilterSidebarProps) => {
  // State for tracking which sections are expanded
  const [expandedSections, setExpandedSections] = useState<{
    courses: boolean;
    roles: boolean;
    availabilities: boolean;
    skills: boolean;
  }>({
    courses: false,
    roles: false,
    availabilities: false,
    skills: false,
  });

  // State for tracking selected filters
  const [selectedFilters, setSelectedFilters] = useState<{
    courses: string[];
    roles: string[];
    availabilities: string[];
    skills: string[];
  }>({
    courses: [],
    roles: [],
    availabilities: [],
    skills: [],
  });

  // Toggle expanded section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Handle checkbox change
  const handleCheckboxChange = (
    type: keyof typeof selectedFilters,
    id: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedFilters({
        ...selectedFilters,
        [type]: [...selectedFilters[type], id],
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [type]: selectedFilters[type].filter((item) => item !== id),
      });
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters({
      courses:
        selectedFilters.courses.length > 0
          ? selectedFilters.courses
          : undefined,
      roles:
        selectedFilters.roles.length > 0 ? selectedFilters.roles : undefined,
      availabilities:
        selectedFilters.availabilities.length > 0
          ? selectedFilters.availabilities
          : undefined,
      skills:
        selectedFilters.skills.length > 0 ? selectedFilters.skills : undefined,
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-md shadow-sm p-4 flex flex-col gap-4">
      <div className="text-lg font-semibold flex items-center gap-2">
        <Filter size={18} />
        Filters
      </div>

      {/* Courses Section */}
      <div className="border-b pb-3">
        <button
          onClick={() => toggleSection("courses")}
          className="flex justify-between items-center w-full text-left font-medium py-2"
          aria-expanded={expandedSections.courses}
          aria-controls="courses-content"
        >
          Courses
          {expandedSections.courses ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {expandedSections.courses && (
          <div
            id="courses-content"
            className="pl-2 mt-2 space-y-2 max-h-60 overflow-y-auto"
          >
            {courses.map((course) => (
              <div key={course.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`course-${course.id}`}
                  checked={selectedFilters.courses.includes(course.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "courses",
                      course.id,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={`course-${course.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {course.course_code} - {course.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roles Section */}
      <div className="border-b pb-3">
        <button
          onClick={() => toggleSection("roles")}
          className="flex justify-between items-center w-full text-left font-medium py-2"
          aria-expanded={expandedSections.roles}
          aria-controls="roles-content"
        >
          Roles
          {expandedSections.roles ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {expandedSections.roles && (
          <div
            id="roles-content"
            className="pl-2 mt-2 space-y-2 max-h-60 overflow-y-auto"
          >
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={selectedFilters.roles.includes(role.id)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("roles", role.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={`role-${role.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availabilities Section */}
      <div className="border-b pb-3">
        <button
          onClick={() => toggleSection("availabilities")}
          className="flex justify-between items-center w-full text-left font-medium py-2"
          aria-expanded={expandedSections.availabilities}
          aria-controls="availabilities-content"
        >
          Availabilities
          {expandedSections.availabilities ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {expandedSections.availabilities && (
          <div
            id="availabilities-content"
            className="pl-2 mt-2 space-y-2 max-h-60 overflow-y-auto"
          >
            {availabilities.map((availability) => (
              <div
                key={availability.id}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={`availability-${availability.id}`}
                  checked={selectedFilters.availabilities.includes(
                    availability.id
                  )}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "availabilities",
                      availability.id,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={`availability-${availability.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {availability.availability}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div className="border-b pb-3">
        <button
          onClick={() => toggleSection("skills")}
          className="flex justify-between items-center w-full text-left font-medium py-2"
          aria-expanded={expandedSections.skills}
          aria-controls="skills-content"
        >
          Skills
          {expandedSections.skills ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        {expandedSections.skills && (
          <div
            id="skills-content"
            className="pl-2 mt-2 space-y-2 max-h-60 overflow-y-auto"
          >
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${index}`}
                  checked={selectedFilters.skills.includes(skill.name)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "skills",
                      skill.name,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={`skill-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Filters Button */}
      <Button onClick={handleApplyFilters} className="mt-4 w-full">
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterSidebar;
