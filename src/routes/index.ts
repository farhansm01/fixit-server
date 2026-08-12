import { Router } from "express";
import auth from "../services/auth";
import user from "../services/user";
import category from "../services/category";
import service from "../services/service";
import booking from "../services/booking";
import review from "../services/review";

const router = Router();

/**
 * Main API Router Registration for FixIt REST API
 * Base Path: /api/v1
 */

// Authentication Routes (/api/v1/auth)
router.use("/auth", auth);

// User Management Routes (/api/v1/users)
router.use("/users", user);

// Category Management Routes (/api/v1/categories)
router.use("/categories", category);

// Home Services Routes (/api/v1/services)
router.use("/services", service);

// Booking Management Routes (/api/v1/bookings)
router.use("/bookings", booking);

// Ratings & Reviews Routes (/api/v1/reviews)
router.use("/reviews", review);

export default router;
