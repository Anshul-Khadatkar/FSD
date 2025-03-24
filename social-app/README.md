# Participation

A full-stack participation platform built with Angular and Node.js

## Features

- User authentication (registration, login)
- Profile management
- Responsive design
- JWT-based authentication
- PostgreSQL database
- RESTful API

## Technology Stack

### Frontend

- Angular 17
- SCSS for styling
- Angular Reactive Forms

### Backend

- Node.js
- Express
- PostgreSQL
- JSON Web Tokens (JWT)

## Project Structure

- `frontend/` - Angular application
- `backend/` - Node.js + Express API

## Setup Instructions

### Prerequisites

- Node.js v14+ and npm
- PostgreSQL

### Database Setup

1. Create a PostgreSQL user and database:

```sql
CREATE USER fsd_user WITH PASSWORD 'password';
CREATE DATABASE participation_platform;
GRANT ALL PRIVILEGES ON DATABASE participation_platform TO fsd_user;
```

2. Update the `.env` file in the backend directory if needed:

```
PORT=5005
JWT_SECRET=yourSecretKey123
DB_USER=fsd_user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=participation_platform
NODE_ENV=development
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend/social-media-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires auth)

### Profile

- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)

## Testing the API

A Postman collection is included in the backend directory for testing the API endpoints.

## License

MIT
