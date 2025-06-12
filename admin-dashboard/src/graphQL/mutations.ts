import { gql } from "@apollo/client";

// Authentication
export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(input: { email: $email, password: $password }) {
      token
      admin {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

// Course Management
export const CREATE_COURSE = gql`
  mutation CreateCourse($name: String!, $course_code: String!) {
    createCourse(input: { name: $name, course_code: $course_code }) {
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
  mutation UpdateCourse($id: ID!, $name: String!, $course_code: String!) {
    updateCourse(input: { id: $id, name: $name, course_code: $course_code }) {
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
      }
      error
    }
  }
`;

export const ASSIGN_LECTURER_TO_COURSES = gql`
  mutation AssignLecturerToCourses($lecturerId: ID!, $courseIds: [ID!]!) {
    assignLecturerToCourses(
      input: { lecturerId: $lecturerId, courseIds: $courseIds }
    ) {
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
      access
    }
  }
`;

export const UNBLOCK_USER = gql`
  mutation UnblockUser($userId: ID!) {
    unblockUser(userId: $userId) {
      id
      name
      email
      access
    }
  }
`;
