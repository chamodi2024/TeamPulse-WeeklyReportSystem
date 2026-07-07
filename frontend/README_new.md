# Weekly Report Generator & Team Dashboard

This frontend project provides a role-based weekly reporting experience for team members and managers. It includes:

- Authentication with member and manager roles
- A personal weekly report page for creating and editing reports
- A manager dashboard with summary cards and charts
- Team report filtering and project/category management

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Run the frontend locally
   ```bash
   npm run dev
   ```

3. Run the backend locally
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Open the frontend URL shown by Vite in your browser.

## Project structure

- src/api - mock data and API placeholders
- src/components - shared layout and route guard
- src/context - authentication and application state
- src/pages/auth - login and registration
- src/pages/member - personal report experience
- src/pages/manager - dashboard, reports, and projects
- src/routes - application routing

## Notes

The current version uses local mock data and a simple Express backend so the UI can be reviewed immediately. For a full-stack version, the next step would be to connect this UI to a production database and real authentication.
