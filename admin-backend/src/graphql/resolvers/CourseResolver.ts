import { Resolver, Query, Mutation, Arg, ID } from "type-graphql";
import { Course } from "../../entities/Course";
import { User } from "../../entities/User";
import {
  CreateCourseInput,
  UpdateCourseInput,
  AssignLecturerInput,
  CourseResponse,
  CourseListResponse,
} from "../types/CourseTypes";
import { AppDataSource } from "../../data-source";
import { In } from "typeorm";

@Resolver()
export class CourseResolver {
  // Get all courses
  @Query(() => CourseListResponse)
  async getAllCourses(): Promise<CourseListResponse> {
    try {
      const courseRepository = AppDataSource.getRepository(Course);
      const courses = await courseRepository.find({
        relations: ["users", "applications"],
      });
      return { courses };
    } catch (error) {
      return { courses: [], error: "Failed to fetch courses" };
    }
  }

  // Create a course
  @Mutation(() => CourseResponse)
  async createCourse(
    @Arg("input") input: CreateCourseInput
  ): Promise<CourseResponse> {
    try {
      const courseRepository = AppDataSource.getRepository(Course);

      // Check if course code already exists
      const existingCourse = await courseRepository.findOne({
        where: { course_code: input.course_code },
      });

      if (existingCourse) {
        return { error: "Course code already exists" };
      }

      const course = courseRepository.create(input);
      const savedCourse = await courseRepository.save(course);

      return { course: savedCourse };
    } catch (error) {
      return { error: "Failed to create course" };
    }
  }

  // Update a course
  @Mutation(() => CourseResponse)
  async updateCourse(
    @Arg("input") input: UpdateCourseInput
  ): Promise<CourseResponse> {
    try {
      const courseRepository = AppDataSource.getRepository(Course);

      const course = await courseRepository.findOne({
        where: { id: input.id },
      });

      if (!course) {
        return { error: "Course not found" };
      }

      await courseRepository.update(input.id, {
        ...(input.name && { name: input.name }),
        ...(input.course_code && { course_code: input.course_code }),
      });

      const updatedCourse = await courseRepository.findOne({
        where: { id: input.id },
        relations: ["users", "applications"],
      });

      return { course: updatedCourse! };
    } catch (error) {
      return { error: "Failed to update course" };
    }
  }

  // Delete a course
  @Mutation(() => CourseResponse)
  async deleteCourse(@Arg("id", () => ID) id: string): Promise<CourseResponse> {
    try {
      console.log("Deleting course with id: ", id);
      const courseRepository = AppDataSource.getRepository(Course);

      const course = await courseRepository.findOne({
        where: { id },
      });

      if (!course) {
        return { error: "Course not found" };
      }

      // Store course data before removal
      const deletedCourse = { ...course };

      // Remove the course
      await courseRepository.remove(course);

      // Return the stored course data
      return { course: deletedCourse as Course };
    } catch (error) {
      return { error: "Failed to delete course" };
    }
  }

  // Assign a lecturer to courses
  @Mutation(() => CourseResponse)
  async assignLecturerToCourses(
    @Arg("input") input: AssignLecturerInput
  ): Promise<CourseResponse> {
    try {
      console.log("Assigning lecturer to courses");
      console.log(input);
      const userRepository = AppDataSource.getRepository(User);
      const courseRepository = AppDataSource.getRepository(Course);

      // Verify lecturer exists and is actually a lecturer
      const lecturer = await userRepository.findOne({
        where: { id: input.lecturerId, role: "lecturer" },
        relations: ["courses"],
      });

      if (!lecturer) {
        return { error: "Lecturer not found" };
      }

      // Get courses to assign
      const courses = await courseRepository.find({
        where: { id: In(input.courseIds) },
      });

      // This happens if trying to assign a course that does not exist or assigning a course that is already assigned to the lecturer
      if (courses.length !== input.courseIds.length) {
        return { error: "Some courses not found" };
      }

      // Check if lecturer is already assigned to any of the courses
      const assignedCourses = lecturer.courses;
      const isAlreadyAssigned = assignedCourses.some((course) =>
        input.courseIds.includes(course.id)
      );

      if (isAlreadyAssigned) {
        return { error: "Lecturer already assigned to some of the courses" };
      }

      // Assign courses to lecturer
      lecturer.courses = [...lecturer.courses, ...courses];
      await userRepository.save(lecturer);

      return { course: courses[0], error: undefined };
    } catch (error) {
      return { error: "Failed to assign lecturer to courses" };
    }
  }

  // Remove a lecturer from a course
  @Mutation(() => CourseResponse)
  async removeLecturerFromCourse(
    @Arg("lecturerId", () => ID) lecturerId: string,
    @Arg("courseId", () => ID) courseId: string
  ): Promise<CourseResponse> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const lecturer = await userRepository.findOne({
        where: { id: lecturerId, role: "lecturer" },
        relations: ["courses"],
      });

      if (!lecturer) {
        return { error: "Lecturer not found" };
      }

      // Remove course from lecturer's courses
      lecturer.courses = lecturer.courses.filter(
        (course) => course.id !== courseId
      );
      await userRepository.save(lecturer);

      return { error: undefined };
    } catch (error) {
      return { error: "Failed to remove lecturer from course" };
    }
  }
}
