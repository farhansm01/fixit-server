# 🛠️ FixIt - Home Services Booking Platform Backend Plan

A beginner-friendly, production-ready REST API for **FixIt** (Home Services Booking Platform) built using **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **JWT Authentication**, and **bcrypt**.

---

## 💻 What You Need to Have Installed

If you are new to TypeScript, Prisma, and PostgreSQL, here is the quick installation list:

1. **Node.js** (v18 or higher):
   - Check if installed: open terminal/cmd and run `node -v`
   - If not installed, download from [nodejs.org](https://nodejs.org/).

2. **VS Code Extensions (Recommended for beginners)**:
   - **Prisma** extension by Prisma (gives syntax highlighting & auto-complete for `schema.prisma`).
   - **Thunder Client** or **Postman** (for testing your API endpoints).

3. **PostgreSQL Database** (Choose ONE option):
   - **Option A (Easiest - Free Cloud DB, No local install needed)**:
     - Sign up at [Neon.tech](https://neon.tech/) or [Supabase.com](https://supabase.com/).
     - Create a free PostgreSQL database project and copy your database connection string (`postgresql://...`).
   - **Option B (Local DB)**:
     - Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).

4. **NPM Package Installation**:
   - Inside `c:\Next-js\fixit-backend`, run `npm install` (this will automatically install Express, TypeScript, Prisma, JWT, and bcrypt).

---

## 📋 Task Roadmap & Git Commit Plan

We will build the project step-by-step in simple, beginner-friendly pieces. After every 1-2 tasks, we will do a `git push`.

### 📌 Task 1: Project Folder & Core Configuration
- [x] Create project directory `c:\Next-js\fixit-backend`.
- [x] Configure `package.json`, `tsconfig.json`, `prisma.config.ts`, `.gitignore`, and `.env`.
- [x] Create `src/app.ts` (Express server setup, CORS, JSON parser, 404 handler) and `src/server.ts`.
- [x] Create `src/lib/prisma.ts` for database connection instantiation.
- [ ] **Git Action**: `git init`, `git add .`, `git commit -m "Task 1: Initialize FixIt backend core setup"`.

### 📌 Task 2: Database Schema & Relational Modeling (`prisma/schema.prisma`)
- [ ] Define **Enums**:
  - `UserRole`: `ADMIN`, `CUSTOMER`, `PROVIDER`
  - `BookingStatus`: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
- [ ] Define **Models**:
  - `User` (`id`, `name`, `email`, `password`, `role`, `isDeleted`, timestamps) -> `@@map("users")`
  - `Category` (`id`, `name`, `image`, `isDeleted`, timestamps) -> `@@map("categories")`
  - `Service` (`id`, `title`, `description`, `price`, `duration`, `image`, `categoryId`, `isDeleted`, timestamps) -> `@@map("services")`
  - `Booking` (`id`, `userId`, `serviceId`, `bookingDate`, `totalAmount`, `status`, `notes`, `isDeleted`, timestamps) -> `@@map("bookings")`
  - `Review` (`id`, `userId`, `serviceId`, `rating`, `comment`, `isDeleted`, timestamps) -> `@@map("reviews")`
- [ ] **Git Action**: `git add .`, `git commit -m "Task 2: Add FixIt database schema with models and relations"`.

### 📌 Task 3: Authentication System (`/api/v1/auth`)
- [ ] Create `src/lib/jwt.ts` for token signing and verification.
- [ ] Create `src/middlewares/auth.ts` to protect private endpoints.
- [ ] Create `src/services/auth.ts`:
  - `POST /api/v1/auth/register`: Register user with `bcrypt` password hashing.
  - `POST /api/v1/auth/login`: Verify password with `bcrypt.compare` and return JWT.
  - `GET /api/v1/auth/me`: Get profile of currently logged-in user.
- [ ] **Git Action**: `git add .`, `git commit -m "Task 3: Add JWT authentication and bcrypt password hashing"`.

### 📌 Task 4: Core Services & REST APIs
- [ ] **Users Service** (`src/services/users.ts`): CRUD for user accounts.
- [ ] **Categories Service** (`src/services/categories.ts`): CRUD for home service categories (Plumbing, Electrical, Cleaning).
- [ ] **Services Service** (`src/services/services.ts`): CRUD for individual services (prices, durations, descriptions).
- [ ] **Bookings Service** (`src/services/bookings.ts`): Booking creation, user booking history, status updates (`PENDING` -> `CONFIRMED` -> `COMPLETED`).
- [ ] **Reviews Service** (`src/services/reviews.ts`): User ratings and reviews for services.
- [ ] Mount all routes in `src/routes/index.ts`.
- [ ] **Git Action**: `git add .`, `git commit -m "Task 4: Implement complete REST APIs for all modules"`.

### 📌 Task 5: API Documentation & Verification
- [ ] Write `docs/API_DOCUMENTATION.md` detailing every endpoint, payload example, and status code.
- [ ] Run TypeScript validation (`npx tsc --noEmit`).
- [ ] **Git Action**: `git add .`, `git commit -m "Task 5: Complete API documentation and final verification"`.

---

## 🎯 Consistent API Response Structure

All endpoints return responses in this standard format:
```json
{
  "success": true,
  "message": "Action completed successfully",
  "data": {}
}
```
