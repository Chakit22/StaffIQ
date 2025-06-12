# Sample GraphQL Queries for Admin Dashboard

## Authentication

### 1. Admin Login

```graphql
mutation AdminLogin {
  adminLogin(input: { email: "admin", password: "admin" }) {
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
```

### 2. Check Current Admin

```graphql
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
```

## Course Management

### 3. Get All Courses

```graphql
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
```

### 4. Create New Course

```graphql
mutation CreateCourse {
  createCourse(
    input: { name: "Advanced Database Systems", course_code: "COMP3506" }
  ) {
    course {
      id
      name
      course_code
    }
    error
  }
}
```

### 5. Update Course

```graphql
mutation UpdateCourse {
  updateCourse(
    input: {
      id: "course-id-here"
      name: "Updated Course Name"
      course_code: "COMP3507"
    }
  ) {
    course {
      id
      name
      course_code
    }
    error
  }
}
```

### 6. Delete Course

```graphql
mutation DeleteCourse {
  deleteCourse(id: "course-id-here") {
    course {
      id
      name
    }
    error
  }
}
```

### 7. Assign Lecturer to Courses

```graphql
mutation AssignLecturerToCourses {
  assignLecturerToCourses(
    input: {
      lecturerId: "lecturer-id-here"
      courseIds: ["course-id-1", "course-id-2"]
    }
  ) {
    error
  }
}
```

## User Management

### 8. Get All Users

```graphql
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
```

### 9. Get All Candidates

```graphql
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
```

### 10. Get All Lecturers

```graphql
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
```

### 11. Block User

```graphql
mutation BlockUser {
  blockUser(userId: "user-id-here") {
    id
    name
    email
    access
  }
}
```

### 12. Unblock User

```graphql
mutation UnblockUser {
  unblockUser(userId: "user-id-here") {
    id
    name
    email
    access
  }
}
```

## Reports

### 13. Candidates Chosen for Each Course

```graphql
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
```

### 14. Candidates Chosen for More Than 3 Courses

```graphql
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
```

### 15. Candidates Not Chosen for Any Course

```graphql
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
```

### 16. All Lecturers with Course Assignments

```graphql
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
```

### 17. All Applications

```graphql
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
```

## Headers for Authentication

For protected queries/mutations, include the JWT token in the headers:

```json
{
  "Authorization": "Bearer YOUR_JWT_TOKEN_HERE"
}
```

## Testing Flow

1. **Login** using query #1 to get a JWT token
2. **Set the token** in the Authorization header
3. **Test course management** with queries #3-7
4. **Test user management** with queries #8-12
5. **Generate reports** with queries #13-17

## Error Handling

All mutations return an `error` field that will contain error messages if something goes wrong:

```graphql
{
  "data": {
    "createCourse": {
      "course": null,
      "error": "Course code already exists"
    }
  }
}
```
