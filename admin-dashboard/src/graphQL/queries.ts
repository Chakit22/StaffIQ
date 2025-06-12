// src/graphQL/queries.ts
import { gql } from "@apollo/client";

// Current admin user
export const ME_QUERY = gql`
  query Me {
    me {
      admin {
        id
        username
      }
      error
    }
  }
`;

// Course Management Queries
export const GET_ALL_COURSES = gql`
  query GetAllCourses {
    getAllCourses {
      courses {
        id
        name
        course_code
        users {
          id
          name
        }
      }
      error
    }
  }
`;

// User Management Queries - Note: Check if this resolver exists
export const GET_ALL_LECTURERS = gql`
  query GetAllLecturers {
    getAllLecturers {
      id
      name
      email
      access
      courses {
        id
        name
        course_code
      }
      experiences {
        id
      }
    }
  }
`;

// Report Queries
export const GET_CANDIDATES_CHOSEN_FOR_EACH_COURSE = gql`
  query GetCandidatesChosenForEachCourse {
    getCandidatesChosenForEachCourse {
      course {
        id
        name
        course_code
      }
      candidates {
        id
        name
        email
        access
      }
      candidateCount
    }
  }
`;

export const GET_CANDIDATES_CHOSEN_FOR_MORE_THAN_THREE_COURSES = gql`
  query GetCandidatesChosenForMoreThanThreeCourses {
    getCandidatesChosenForMoreThanThreeCourses {
      candidate {
        id
        name
        email
      }
      courseCount
      courses {
        id
        name
        course_code
      }
    }
  }
`;

export const GET_CANDIDATES_NOT_CHOSEN_FOR_ANY_COURSE = gql`
  query GetCandidatesNotChosenForAnyCourse {
    getCandidatesNotChosenForAnyCourse {
      candidate {
        id
        name
        email
        dateOfJoining
      }
    }
  }
`;
