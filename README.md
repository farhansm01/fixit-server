# 🛠️ FixIt - Home Services Booking Platform REST API

> **SCIC/EJP-13 Backend Project Submission**
> Production-ready, scalable, and well-structured REST API built using **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL (Neon Cloud)**, **JWT Authentication**, and **bcrypt**.

---

## 🔗 Live Submission Links

- **Live Deployed API URL**: [https://fixit-server-huih.onrender.com/api/v1](https://fixit-server-huih.onrender.com/api/v1)
- **Live Deployed Frontend Web App**: [https://fixit-client-three.vercel.app](https://fixit-client-three.vercel.app)
- **Backend GitHub Repository**: [https://github.com/farhansm01/fixit-server](https://github.com/farhansm01/fixit-server)
- **Frontend GitHub Repository**: [https://github.com/farhansm01/fixit-client](https://github.com/farhansm01/fixit-client)
- **Database**: Cloud PostgreSQL hosted on **Neon** (`ep-jolly-meadow-ay6a1v3w`)

---

## 🛠️ Tech Stack & Key Technologies

- **Runtime & Framework**: Node.js & Express.js (v4/v5)
- **Language**: TypeScript 5 (Strict type checking enabled)
- **Database & ORM**: PostgreSQL & Prisma ORM 7 (`@prisma/client` + `@prisma/adapter-pg`)
- **Authentication**: JWT (`jsonwebtoken`) & password hashing with `bcryptjs`
- **Middlewares**: CORS, JSON Body Parser, Error Handler, Bearer Token Auth & Role Authorization
- **Dev Tooling**: `tsx` hot-reloading watcher

---

## 📁 Project Architecture & Directory Structure

```text
fixit-backend/
├── prisma/
│   └── schema.prisma         # Relational DB models, enums & table mappings
├── src/
│   ├── app.ts                # Express app setup, CORS & global middlewares
│   ├── server.ts             # Server entrypoint
│   ├── routes/
│   │   └── index.ts          # Central API router (/api/v1)
│   ├── services/
│   │   ├── auth/             # User Registration, Login & Profile (/me)
│   │   ├── user/             # User Management & Roles
│   │   ├── category/         # Home Service Categories
│   │   ├── service/          # Home Services Catalog (Search, Pagination, Filter)
│   │   ├── booking/          # Booking Creation & Status Tracking
│   │   └── review/           # Ratings (1-5 stars) & Reviews
│   ├── middlewares/
│   │   └── auth.ts           # Bearer Token Auth & Role Guard Middlewares
│   └── lib/
│       ├── jwt.ts            # JWT signing & decoding helpers
│       └── prisma.ts         # Prisma Client instance with PG driver adapter
├── docs/
│   └── API_DOCUMENTATION.md  # Detailed API Documentation
├── .env
├── package.json
└── tsconfig.json
```

---

## 🗄️ Database Design (`prisma/schema.prisma`)

### Enums
1. `UserRole`: `ADMIN`, `CUSTOMER`, `PROVIDER`
2. `BookingStatus`: `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

### Relational Models
- **`User`** (`@@map("users")`): User authentication, profile, roles, timestamps & `isDeleted` soft delete.
- **`Category`** (`@@map("categories")`): Product/Service categories.
- **`Service`** (`@@map("services")`): Catalog services with price, duration, category relation, and search.
- **`Booking`** (`@@map("bookings")`): Customer appointments with date, total amount, status workflow, and cascade relations.
- **`Review`** (`@@map("reviews")`): Rating scores (1 to 5) and textual customer reviews.

---

## 📋 API Endpoint Summary

All API endpoints follow a standardized JSON response structure:
```json
{
  "success": true,
  "message": "Description of action",
  "data": {}
}
```

| Module | Endpoint | Method | Description |
| :--- | :--- | :---: | :--- |
| **Auth** | `/api/v1/auth/register` | `POST` | Register a new user with bcrypt password hashing |
| **Auth** | `/api/v1/auth/login` | `POST` | Authenticate credentials & return JWT token |
| **Auth** | `/api/v1/auth/me` | `GET` | Get logged-in user profile (Bearer token required) |
| **Users** | `/api/v1/users` | `GET` | List active users (`?includeDeleted=true` supported) |
| **Users** | `/api/v1/users/:id` | `GET` | Get single user with booking history & reviews |
| **Categories** | `/api/v1/categories` | `GET` | List service categories (`?includeServices=true`) |
| **Services** | `/api/v1/services` | `GET` | List services (`?search=...`, `?categoryId=...`, `?page=1`) |
| **Bookings** | `/api/v1/bookings` | `POST` | Create booking appointment |
| **Bookings** | `/api/v1/bookings/:id` | `PATCH` | Update booking status (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `COMPLETED`) |
| **Reviews** | `/api/v1/reviews` | `POST` | Submit rating (1-5 stars) and review comment |

---

## 🚀 Local Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/farhansm01/fixit-server.git
   cd fixit-server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (`.env`):
   ```env
   DATABASE_URL="postgresql://neondb_owner:npg_f18tWklqciuC@ep-jolly-meadow-ay6a1v3w.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"
   PORT=5000
   JWT_SECRET="fixit-secret-jwt-key-2026"
   JWT_EXPIRES_IN="7d"
   ```

4. **Sync Prisma Database Schema**:
   ```bash
   npx prisma db push
   ```

5. **Start Dev Server**:
   ```bash
   npm run dev
   ```

The backend server will run at `http://localhost:5000/api/v1`.
