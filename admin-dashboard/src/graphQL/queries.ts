// src/graphQL/queries.ts
import { gql } from "@apollo/client";

// Current admin user
export const ME_QUERY = gql`
  query Me {
    me {
      admin {
        id
        email
        firstName
        lastName
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
          email
          role
        }
        applications {
          id
          user {
            name
            email
          }
        }
      }
      error
    }
  }
`;

// User Management Queries
export const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
      role
      access
      dateOfJoining
      applications {
        id
        course {
          name
        }
      }
      courses {
        id
        name
      }
    }
  }
`;

export const GET_ALL_CANDIDATES = gql`
  query GetAllCandidates {
    getAllCandidates {
      id
      name
      email
      access
      applications {
        id
        course {
          name
          course_code
        }
        role {
          name
        }
      }
    }
  }
`;

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
      applicationCount
    }
  }
`;

export const GET_ALL_LECTURERS_WITH_COURSE_ASSIGNMENTS = gql`
  query GetAllLecturersWithCourseAssignments {
    getAllLecturersWithCourseAssignments {
      id
      name
      email
      courses {
        id
        name
        course_code
      }
    }
  }
`;

export const GET_ALL_APPLICATIONS = gql`
  query GetAllApplications {
    getAllApplications {
      id
      academic_creds
      user {
        id
        name
        email
      }
      course {
        id
        name
        course_code
      }
      role {
        id
        name
      }
      availability {
        id
        availability
      }
      skills {
        name
      }
    }
  }
`;
