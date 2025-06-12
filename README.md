# Tutor Assignment System

This project is a comprehensive tutor assignment system consisting of a frontend application, backend API, and admin dashboard.

## Project Structure

- **frontend**: React-based user interface for candidates and lecturers
- **backend**: Express.js REST API with TypeORM for data management
- **admin-backend**: GraphQL API for administrative functions
- **admin-dashboard**: React-based admin interface

## Development Tools

This project was developed with the assistance of CursorAI (claude-3.7-sonnet, claude-4-sonnet), which was used to build the basic folder structure for the APIs and application components. The AI helped establish the initial project architecture and folder organization to ensure a clean and maintainable codebase.

## Features

- User authentication and authorization
- Course management
- Application submission and review
- Lecturer preferences and rankings
- Admin reporting and management

## Installation & Setup

Each component has its own setup instructions. Please refer to the README.md files in each directory for detailed setup instructions.

## References

### Authentication

- JWT Authentication was implemented following the guide at [Understanding Modern Web Authentication Flows](https://dev.to/jamescroissant/understanding-modern-web-authentication-flows-session-vs-jwt-vs-oauth-1jk6?utm_source=chatgpt.com#jwt-authentication-flow)

### GraphQL Implementation

- The admin backend uses GraphQL following the official documentation at [GraphQL.org Learn](https://graphql.org/learn/)
- Apollo Server Documentation: https://www.apollographql.com/docs/apollo-server/
- Type-GraphQL: https://typegraphql.com/docs/introduction.html - Used extensively in the admin-backend for schema definition and resolver implementation

### ORM and Database

- TypeORM was used for database operations following the guide at [TypeORM Getting Started](https://typeorm.io/docs/getting-started)
- MySQL Documentation: https://dev.mysql.com/doc/
- Database migrations were implemented using TypeORM's migration system

### Frontend Development

- React Documentation: https://react.dev/
- Next.js Documentation: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- ShadcnUI: https://ui.shadcn.com/ - Used for building the UI components with a consistent design system
- React Hook Form: https://react-hook-form.com/ - Used for form handling and validation throughout the frontend

### Backend Development

- Express.js Documentation: https://expressjs.com/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- Zod Validation Library: https://zod.dev/ - Used for schema validation in both frontend and backend applications

### Testing

- Jest Documentation: https://jestjs.io/docs/getting-started

### Design Patterns

- React Patterns: https://reactpatterns.com/
- Node.js Design Patterns: https://github.com/diegomais/node-js-design-patterns

## Important Note

This project uses standard libraries and follows best practices for authentication, data management, and API design. All code is original or properly referenced when based on tutorials or documentation. The implementation follows security best practices and does not contain any suspicious or malicious code.

## License

This project is academic work for RMIT University.

## Repository

https://github.com/rmit-fsd-2025-s1/s4058437-s4061305-a2/
