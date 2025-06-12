# Admin Dashboard Backend - GraphQL API

This is a comprehensive Admin Dashboard backend built with GraphQL, TypeScript, Apollo Server 4, and TypeORM. It provides admin functionalities for managing courses, lecturers, candidates, and generating reports.

## Features

### 🔐 Authentication

- Admin login with hardcoded credentials (admin/admin)
- JWT token-based authentication
- Protected GraphQL operations

### 📚 Course Management

- Create, update, and delete courses
- Assign lecturers to courses
- Remove lecturers from courses
- View all courses with relationships

### 👥 User Management

- View all users (candidates and lecturers)
- Block/unblock user access
- Filter users by role

### 📊 Reporting

- List candidates chosen for each course
- Find candidates chosen for more than 3 courses
- Identify candidates not chosen for any courses
- Lecturer course assignments

## Technology Stack

- **Backend Framework**: Node.js with Express
- **GraphQL**: Apollo Server 4 with Type-GraphQL
- **Database**: MySQL with TypeORM
- **Authentication**: JWT
- **Language**: TypeScript

## Key Features Implementation

### 📋 Admin Requirements Fulfilled

✅ **Requirement #1**: Uses GraphQL for all data fetching operations
✅ **Requirement #2**: Admin authentication with hardcoded credentials (admin/admin)

### 🎯 Admin Functionalities (3 marks)

✅ **Assign lecturer to course(s)**: `assignLecturerToCourses` mutation
✅ **Add/Edit/Delete courses**: `createCourse`, `updateCourse`, `deleteCourse` mutations
✅ **Block/unblock candidates**: `blockUser`, `unblockUser` mutations

### 📊 Admin Reports (3 marks)

✅ **List of candidates chosen for each course**: `getCandidatesChosenForEachCourse` query
✅ **Candidates chosen for more than 3 courses**: `getCandidatesChosenForMoreThanThreeCourses` query
✅ **Candidates not chosen for any courses**: `getCandidatesNotChosenForAnyCourse` query

## Installation & Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file with:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=tutor_assignment
   JWT_SECRET=admin-dashboard-super-secret-key-2024
   PORT=8000
   ```

3. **Database Setup**:

   - Ensure MySQL is running
   - Create the database: `tutor_assignment`
   - TypeORM will auto-create tables on startup

4. **Start Development Server**:

   ```bash
   npm run dev
   ```

5. **Access GraphQL Playground**:
   - Open: `http://localhost:8000/graphql`

---

**Note**: This admin dashboard is separate from the main TT website as per requirements.
