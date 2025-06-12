import { gql } from "@apollo/client";

// Authentication
export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($input: LoginInput!) {
    adminLogin(input: $input) {
      token
      admin {
        id
        username
      }
    }
  }
`;

// Course Management
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      course {
        id
        name
        course_code
      }
      error
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(input: $input) {
      course {
        id
        name
        course_code
      }
      error
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id) {
      course {
        id
        name
        course_code
      }
      error
    }
  }
`;

// Assign a lecturer to courses
export const ASSIGN_LECTURER_TO_COURSES = gql`
  mutation AssignLecturerToCourses($input: AssignLecturerInput!) {
    assignLecturerToCourses(input: $input) {
      course {
        id
        name
        course_code
      }
      error
    }
  }
`;

// User Management
export const BLOCK_USER = gql`
  mutation BlockUser($userId: ID!) {
    blockUser(userId: $userId) {
      id
      name
      email
      role
      access
      dateOfJoining
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userId: ID!) {
    unblockUser(userId: $userId) {
      id
      name
      email
      role
      access
      dateOfJoining
    }
  }
`;
