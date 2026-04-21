# Labora Server

A RESTful API backend for a job management platform built with Node.js, Express,
MongoDB, and Firebase Authentication.

## Overview

Labora Server provides a robust backend infrastructure for managing job postings
and task assignments. It features secure authentication using Firebase,
comprehensive job management capabilities, and task tracking functionality.

## Features

- **Job Management**: Create, read, update, and delete job postings
- **Task Management**: Track accepted tasks and assignments
- **Firebase Authentication**: Secure token-based authentication
- **User-specific Operations**: Filter jobs and tasks by authenticated users
- **Advanced Querying**: Support for sorting, limiting, field projection, and
  exclusion
- **MongoDB Integration**: Efficient data storage and retrieval
- **CORS Enabled**: Ready for cross-origin requests

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB
- **Authentication**: Firebase Admin SDK
- **Deployment**: Vercel

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Firebase project with Admin SDK credentials

## Installation

1. Clone the repository:

```bash
git clone https://github.com/programmerrakibul/labora-server
cd labora-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
FIREBASE_SERVICE_KEY=your_base64_encoded_firebase_service_key
```

4. Start the development server:

```bash
npm start
```

The server will run on `http://localhost:8000` by default.

## API Endpoints

### Jobs

| Method | Endpoint     | Auth Required | Description                                 |
| ------ | ------------ | ------------- | ------------------------------------------- |
| GET    | `/jobs`      | No            | Get all jobs with optional query parameters |
| GET    | `/jobs/user` | Yes           | Get jobs created by authenticated user      |
| GET    | `/jobs/:id`  | Yes           | Get a specific job by ID                    |
| POST   | `/jobs`      | Yes           | Create a new job posting                    |
| PUT    | `/jobs/:id`  | Yes           | Update a job by ID                          |
| DELETE | `/jobs/:id`  | Yes           | Delete a job by ID                          |

#### Query Parameters for GET `/jobs`

- `sortBy`: Field to sort by (default: "posted_by")
- `sortOrder`: Sort direction ("asc" or "desc")
- `limit`: Maximum number of results
- `fields`: Comma-separated fields to include
- `excludes`: Comma-separated fields to exclude

### Tasks

| Method | Endpoint            | Auth Required | Description                      |
| ------ | ------------------- | ------------- | -------------------------------- |
| POST   | `/added-tasks`      | Yes           | Create a new task                |
| GET    | `/added-tasks/user` | Yes           | Get tasks for authenticated user |
| DELETE | `/added-tasks/:id`  | Yes           | Delete a task by ID              |

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

The server validates the token using Firebase Admin SDK and extracts the user's
email for authorization checks.

## Project Structure

```
labora-server/
├── controllers/
│   ├── jobController.js      # Job-related business logic
│   └── taskController.js     # Task-related business logic
├── middlewares/
│   ├── validateTokenId.js    # Token validation middleware
│   └── verifyTokenId.js      # Firebase token verification
├── routes/
│   ├── jobRouter.js          # Job routes
│   └── taskRouter.js         # Task routes
├── db.js                     # MongoDB connection and collections
├── index.js                  # Application entry point
├── package.json              # Project dependencies
└── vercel.json              # Vercel deployment configuration
```

## Database Schema

### Jobs Collection (`all_jobs`)

- Job postings with creator information
- Fields include job details, creator email, posting date, etc.

### Tasks Collection (`added_tasks`)

- Accepted tasks linked to jobs
- Fields include job_id, accepted_user_email, accepted_user_name

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` file
contains the necessary configuration.

To deploy:

```bash
vercel
```

## Environment Variables

| Variable               | Description                                 |
| ---------------------- | ------------------------------------------- |
| `PORT`                 | Server port (default: 8000)                 |
| `MONGODB_URI`          | MongoDB connection string                   |
| `FIREBASE_SERVICE_KEY` | Base64-encoded Firebase service account key |

## Security

- Firebase Authentication for user verification
- Token validation on protected routes
- Email-based authorization for user-specific operations
- Environment variables for sensitive credentials

## Author

Md. Rakibul Islam
