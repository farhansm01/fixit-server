# 🛠️ FixIt REST API Documentation

Comprehensive documentation for the **FixIt Home Services Booking Platform API**.

---

## 📌 Base URL
```text
http://localhost:5000/api/v1
```

## 🔐 Standard Response Format
All response payloads follow this structure:
```json
{
  "success": true,
  "message": "Description of outcome",
  "data": {}
}
```

---

## 1. 🔑 Auth API (`/auth`)

### 1.1 User Registration
- **POST** `/auth/register`
- **Description**: Register a new user account with bcrypt password hashing.
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@example.com",
    "password": "securepassword123",
    "role": "CUSTOMER",
    "phone": "+1234567890"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "uuid-string",
        "name": "Alex Johnson",
        "email": "alex@example.com",
        "role": "CUSTOMER",
        "phone": "+1234567890"
      },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 1.2 User Login
- **POST** `/auth/login`
- **Description**: Authenticate with email & password to obtain a JWT token.
- **Request Body**:
  ```json
  {
    "email": "alex@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { ... },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### 1.3 Get My Profile
- **GET** `/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response (200 OK)**: Profile data of currently logged-in user.

---

## 2. 👤 Users API (`/users`)

- **POST** `/users` — Create new user (Admin mode)
- **GET** `/users` — List all active users (`?includeDeleted=true` optional)
- **GET** `/users/:id` — Get single user with booking history & reviews
- **PATCH** `/users/:id` — Update user details or password
- **DELETE** `/users/:id` — Soft delete user (`?permanent=true` for hard delete)

---

## 3. 🏷️ Categories API (`/categories`)

- **POST** `/categories` — Create category (e.g. Plumbing, Electrical, Cleaning)
- **GET** `/categories` — List all categories (`?includeServices=true` optional)
- **GET** `/categories/:id` — Get category details with services
- **PATCH** `/categories/:id` — Update category name/image
- **DELETE** `/categories/:id` — Soft delete category

---

## 4. 🛠️ Services API (`/services`)

- **POST** `/services` — Add a new service (title, description, price, duration, categoryId)
- **GET** `/services` — List services (supports `?search=...`, `?categoryId=...`, `?page=1`, `?limit=10`)
- **GET** `/services/:id` — Get service details with customer reviews
- **PATCH** `/services/:id` — Update service info
- **DELETE** `/services/:id` — Soft delete service

---

## 5. 📅 Bookings API (`/bookings`)

- **POST** `/bookings` — Create a new service booking (`serviceId`, `bookingDate`, `address`, `notes`)
- **GET** `/bookings` — List bookings (`?userId=...`, `?status=PENDING|CONFIRMED|COMPLETED|CANCELLED`)
- **GET** `/bookings/:id` — Get single booking details
- **PATCH** `/bookings/:id` — Update status (`PENDING` -> `CONFIRMED` -> `COMPLETED`)
- **DELETE** `/bookings/:id` — Cancel / Soft delete booking

---

## 6. ⭐ Reviews API (`/reviews`)

- **POST** `/reviews` — Submit rating (1-5 stars) and comment for a service
- **GET** `/reviews` — Get reviews (`?serviceId=...` or `?userId=...`)
- **GET** `/reviews/:id` — Get single review details
- **PATCH** `/reviews/:id` — Edit review rating or comment
- **DELETE** `/reviews/:id` — Soft delete review
