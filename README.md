# Yoliday Assignment - Experiences Marketplace Backend

A robust backend API for an "Experiences" marketplace where users can book activities hosted by others. Built with Node.js, Express, TypeScript, and Prisma (PostgreSQL).

## Features

- **Authentication:** Secure JWT-based authentication with password hashing (bcrypt).
- **Role-Based Access Control (RBAC):** Strict authorization for `user`, `host`, and `admin` roles.
- **Database:** PostgreSQL with Prisma ORM, featuring relation constraints and indexes.
- **Validation:** Request validation using Zod schemas.
- **Observability:** Structured logging (Pino) and request monitoring.

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- pnpm (recommended) or npm

### 1. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/ShivamMishra828/yoliday-assignment.git
cd yoliday-assignment
pnpm install
```

### 2. Environment Configuration
Create a .env file in the root directory. You can copy the following template:

```text
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/yoliday_db?schema=public"

# Security
JWT_SECRET="your-super-secret-key-change-this"
CORS_ORIGIN="http://localhost:3000"

# Rate Limiting (Optional)
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_GLOBAL_MAX=100
```

### 3. Database Setup
Run the Prisma migrations to create the tables (users, experiences, bookings) in your local database:

```bash
# Apply migrations
pnpm dlx prisma migrate dev --name init

# Generate Prisma Client
pnpm dlx prisma generate
```

### 4. Seeding Admin User
To create an initial Admin user for testing moderation features, run the seed script:

```bash
pnpm run seed
```

#### Default Admin Credentials:
- Email: admin@yoliday.com 
- Password: password123

---

## Project Structure

```
src/
├── config/         # Environment, Logger, Database configs
├── controllers/    # Request handlers
├── middlewares/    # Auth, RBAC, Validation, Error handling
├── repositories/   # Database access layer
├── routes/         # API Route definitions
├── schemas/        # Zod validation schemas
├── services/       # Business logic
├── scripts/        # Seeder scripts
└── utils/          # Helper functions
```

---

## How to Run

### Development Mode
Starts the server with hot-reloading (nodemon):

```bash
pnpm run start:dev
```

### Production Build
Builds the TypeScript code and starts the production server:

```bash
pnpm run build
pnpm run start
```

The server will start at http://localhost:3000 (or your configured PORT).

### Health Check:

```bash
curl http://localhost:3000/health
```

---

## RBAC Rules Implemented

The following strict authorization rules are enforced via middleware and service logic:

- **Experience Creation:** Only `host` or `admin` roles can create experiences. New experiences are created in `draft` status by default. 
- **Publishing:**
  - **Hosts** can only publish experiences they created (Ownership Check).
  - **Admins** can publish any experience.
- **Moderation (Blocking):** Only admin users can block an experience.
- **Booking:**
  - **Hosts** cannot book their own experiences (Conflict of Interest). 
  - Users can only book published experiences. 
  - Duplicate confirmed bookings by the same user for the same experience are prevented.

---

## API Documentation

### Authentication

#### POST `/api/v1/auth/signup`
**Request Body:**
```bash
{
  "email": "host@example.com",
  "password": "password123",
  "role": "host"  // Options: "host" | "user"
}
```

**Response:**
```bash
{
  "success": {
    "message": "User successfully created",
    "data": {
      "id": "uuid-string",
      "email": "host@example.com",
      "role": "host",
      "createdAt": "2026-02-08T10:00:00.000Z"
    }
  }
}
```

#### POST `/api/v1/auth/login`
**Request Body:**
```bash
{
  "email": "host@example.com",
  "password": "password123"
}
```

**Response:** Sets a generic token httpOnly cookie.
```bash
{
  "success": {
    "message": "User successfully logged in",
    "data": {
      "user": {
        "id": "uuid-string",
        "email": "host@example.com",
        "role": "host",
        "createdAt": "2026-02-08T10:00:00.000Z"
      },
      "token": "jwt-token-string"
    }
  }
}
```

---

### Experiences

#### POST `/api/v1/experiences` (Requires Auth: Host or Admin)

**Request Body:**
```bash
{
  "title": "Sunset Kayaking",
  "description": "A 2-hour kayaking session during sunset.",
  "location": "Kerala",
  "price": 1200,
  "startTime": "2026-05-20T17:00:00Z"
}
```

**Response:**
```bash
{
  "success": {
    "message": "Experience created successfully",
    "data": {
      "id": "exp-uuid",
      "title": "Sunset Kayaking",
      "description": "A 2-hour kayaking session during sunset.",
      "location": "Kerala",
      "price": 1200,
      "startTime": "2026-05-20T17:00:00.000Z",
      "status": "draft",
      "createdBy": "user-uuid"
    }
  }
}
```

#### GET `/api/v1/experiences` (Public)

**Query Params:**
- location (optional): Filter by location name (e.g., ?location=Kerala)
- sort (optional): asc | desc (Sort by start time)
- from (optional): YYYY-MM-DD 
- to (optional): YYYY-MM-DD

**Response:**
```bash
{
  "success": {
    "message": "Fetched all experiences successfully",
    "data": [
      {
        "id": "exp-uuid",
        "title": "Sunset Kayaking",
        "location": "Kerala",
        "price": 1200,
        "status": "published",
        "startTime": "2026-05-20T17:00:00.000Z"
        // ... other fields
      }
    ]
  }
}
```

#### PATCH `/api/v1/experiences/:id/publish` (Requires Auth: Admin or Owner)

**Params:**
- id: The UUID of the experience.

**Response:**
```bash
{
  "success": {
    "message": "Experience published successfully",
    "data": {
      "id": "exp-uuid",
      "status": "published"
      // ... other fields
    }
  }
}
```

#### PATCH `/api/v1/experiences/:id/block` (Requires Auth: Admin Only)

**Params:**
- id: The UUID of the experience.

**Response:**
```bash
{
  "success": {
    "message": "Experience blocked successfully",
    "data": {
      "id": "exp-uuid",
      "status": "blocked"
      // ... other fields
    }
  }
}
```

---

### Booking

#### POST /api/v1/experiences/:id/book (Requires Auth: User)

**Params:**
- id: The UUID of the experience to book.

**Request Body:**
```bash
{
  "seats": 2
}
```

**Response:**
```bash
{
  "success": {
    "message": "Experience booked successfully",
    "data": {
      "id": "booking-uuid",
      "seats": 2,
      "status": "confirmed",
      "experienceId": "exp-uuid",
      "userId": "user-uuid",
      "createdAt": "2026-02-08T12:00:00.000Z"
    }
  }
}
```