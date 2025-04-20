Project Rules
This document provides a detailed specification for the family tree application, including requirements, architecture, and development guidelines. It serves as a reference for all contributors to ensure consistency and alignment with the project’s goals.
Project Overview
The family tree application is a web-based tool designed to help users visualize and manage their family genealogy. It allows users to create multiple family trees, add family members, upload related files (images and PDFs), and search for specific members. The application is intended to be lightweight, user-friendly, and secure.
Key Features

Family Tree Visualization: Interactive, zoomable tree with vertical layout.
Multiple Trees: Support for creating and managing multiple family trees (e.g., paternal, maternal).
Member Management: Add, edit, and view family members with details like name, birthday, place of birth, and description.
File Uploads: Upload images and PDFs (up to 500MB) associated with family members.
Search Functionality: Case-insensitive, partial-match search with preview results.
Authentication: Basic login and signup functionality with JWT-based session management.
Public Access: Non-authenticated users can view family trees but cannot edit or add data.

Target Audience

Primary User: The client’s father, who is enthusiastic about genealogy.
Secondary Users: Other family members or researchers who may view the family trees.

Deployment

Hosting: The application will be hosted on a Hetzner server.
Containerization: Dockerized for easy deployment and scalability.

Functional Requirements
Frontend

User Interface:

Simple, intuitive design with a focus on usability.
Responsive layout to support various screen sizes.
Interactive family tree visualization with zoom and pan capabilities.
Search bar with real-time preview of matching family members.
Forms for adding/editing family members and uploading files.
Modal for login and signup.


Interactions:

Click on a tree node to view member details.
Select a family tree from a dropdown to switch between trees.
Authenticated users can add/edit members and upload files.



Backend

API Endpoints:

Authentication: /signup, /login, /me.
Trees: /trees (GET, POST).
Members: /members?treeId (GET), /members (POST), /members/:id (GET).
Files: /members/:id/files (POST), /members/:id/files/:fileId (GET).


Data Storage:

SQLite database for storing users, trees, members, and file metadata.
File storage on the server’s filesystem ( ./uploads ).


Security:

Password hashing with bcrypt.
JWT tokens for session management.
Input validation to prevent SQL injection and other attacks.



Database Schema

Users:

id (INTEGER, PRIMARY KEY)
email (TEXT, UNIQUE)
password (TEXT)


Trees:

id (INTEGER, PRIMARY KEY)
name (TEXT)
userId (INTEGER, FOREIGN KEY to users.id)


Members:

id (INTEGER, PRIMARY KEY)
treeId (INTEGER, FOREIGN KEY to trees.id)
name (TEXT)
birthday (TEXT)
placeOfBirth (TEXT)
description (TEXT)


Files:

id (INTEGER, PRIMARY KEY)
memberId (INTEGER, FOREIGN KEY to members.id)
filename (TEXT)
filepath (TEXT)



Non-Functional Requirements

Performance:

Support up to 2,000 family members per tree.
Fast load times for tree visualization and search results.
Efficient handling of file uploads up to 500MB.


Scalability:

The architecture should allow for easy scaling, such as switching to a more robust database if needed.
Dockerized setup for easy deployment and replication.


Security:

Secure handling of user credentials and session tokens.
Protection against common web vulnerabilities (e.g., SQL injection, XSS).
HTTPS enforcement in production.


Usability:

Intuitive user interface with minimal learning curve.
Clear feedback for user actions (e.g., success messages, error handling).


Maintainability:

Modular code structure for easy updates and feature additions.
Comprehensive documentation and comments in the codebase.



Development Guidelines
Technology Stack

Frontend:

React with Tailwind CSS for UI components.
Cytoscape.js for family tree visualization.


Backend:

Node.js with Express for API development.
SQLite for data storage.
Multer for file uploads.
JWT and bcrypt for authentication.


DevOps:

Docker and Docker Compose for containerization.
Git for version control.



Project Structure

frontend/: React application source code.
backend/: Node.js/Express server code.
uploads/: Directory for uploaded files.
public/: Static files, including the frontend build.
docker/: Docker configuration files.

Coding Standards

Naming Conventions:

Variables and functions: camelCase.
Components: PascalCase.
Constants: UPPERCASE.


Formatting:

Indentation: 2 spaces.
Line length: <80 characters.
Strings: Single quotes.


Comments:

Use JSDoc for functions and components.
Comment complex logic for clarity.


Error Handling:

Implement try-catch blocks for asynchronous operations.
Provide user-friendly error messages.



Best Practices

Frontend:

Use functional components and hooks.
Optimize rendering with memoization techniques.
Manage global state with Context API or Redux.


Backend:

Use parameterized queries for database interactions.
Validate and sanitize all user inputs.
Implement logging for debugging and monitoring.


Testing:

Write unit tests for critical components (e.g., authentication, data fetching).
Use a testing framework like Jest or Mocha.


Version Control:

Commit changes frequently with descriptive messages.
Use branches for new features or bug fixes.
Conduct code reviews before merging.



Deployment

Environment:

Production environment on Hetzner server.
Use Docker Compose to manage containers.


Configuration:

Environment variables for sensitive data (e.g., JWT secret, database path).
Persistent volumes for database and uploads.


Monitoring:

Implement basic logging for API requests and errors.
Monitor server resources and application performance.



Future Enhancements
While the current scope meets the initial requirements, the following enhancements could be considered for future iterations:

Parent-Child Relationships: Add support for defining relationships between family members to create a true hierarchical tree structure.
Advanced Search: Implement filters for searching by birthday, place of birth, etc.
User Roles: Introduce roles (e.g., admin, editor, viewer) for finer access control.
Internationalization: Support multiple languages for broader accessibility.
Mobile App: Develop a mobile version using React Native for on-the-go access.

These enhancements should be evaluated based on user feedback and project priorities.
