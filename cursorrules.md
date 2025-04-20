Cursor Rules
This document outlines the guidelines for contributing to the family tree application. It ensures that all contributions align with the project's architectural principles, maintain the correct project structure, and adhere to coding standards and best practices.
Architectural Principles
The family tree application is designed to be lightweight, simplistic, and easy to use. The following architectural principles guide its development:

Modularity: The application is divided into frontend and backend components. The frontend handles user interactions and visualization, while the backend manages data storage and retrieval. This separation allows for easier development, testing, and maintenance.

Scalability: The application is built to support up to 2,000 family members efficiently. The architecture is designed to accommodate future growth, such as switching to a more robust database if needed.

Security: Basic authentication is implemented to protect user data. Passwords are hashed using bcrypt, and JWT tokens are used for session management. All sensitive operations require authentication.

Performance: The application is optimized for quick load times and responsive interactions. This includes efficient data fetching, caching where appropriate, and minimizing unnecessary re-renders in the frontend.


Project Structure
The project is organized into the following directories:

frontend/: Contains all frontend code.

components/: Reusable React components (e.g., TreeNode.js, SearchBar.js).
pages/: Top-level pages (e.g., Home.js, Login.js).
styles/: CSS or Tailwind CSS configurations.
assets/: Static assets like images and fonts.


backend/: Contains all backend code.

routes/: API route handlers (e.g., auth.js, trees.js).
models/: Database models and schemas (e.g., User.js, Tree.js).
middleware/: Custom middleware (e.g., authMiddleware.js).
config/: Configuration files (e.g., database.js).


uploads/: Directory for storing uploaded files (e.g., images, PDFs).

public/: Static files served by the backend, including the frontend build.


Coding Standards
To maintain code quality and consistency, adhere to the following standards:

Naming Conventions:

Variables and functions: camelCase (e.g., fetchMembers, selectedTree).
Components: PascalCase (e.g., FamilyTree, MemberForm).
Constants: UPPERCASE (e.g., MAX_FILE_SIZE).


Formatting:

Indentation: 2 spaces.
Line length: Keep lines under 80 characters.
Strings: Use single quotes ('string').


Comments:

Write clear, concise comments for complex logic.
Use JSDoc for documenting functions and components.


Error Handling:

Always handle errors gracefully and provide user-friendly messages.
Log errors for debugging purposes.


Testing:

Write unit tests for critical components using a framework like Jest.
Ensure tests cover key functionality and edge cases.



Best Practices
In addition to the coding standards, follow these best practices:

Frontend:

Use functional components with hooks for better readability and performance.
Manage state with React Context or a state management library like Redux for complex state.
Optimize rendering with React.memo and useMemo where necessary.


Backend:

Use async/await for handling asynchronous operations.
Validate all input data to prevent SQL injection and other attacks.
Use environment variables for sensitive information (e.g., database credentials, JWT secret).


Database:

Use parameterized queries to prevent SQL injection.
Optimize queries for performance, especially for large datasets.


Security:

Never store passwords in plain text; always hash them.
Use HTTPS in production to encrypt data in transit.
Keep dependencies up to date to mitigate security vulnerabilities.




