import { Router } from "express";
import auth from "../services/auth";
import users from "../services/users";
import categories from "../services/categories";
import services from "../services/services";
import bookings from "../services/bookings";
import reviews from "../services/reviews";

const router = Router();

/**
 * Main API Router Registration for FixIt REST API
 * Base Path: /api/v1
 */

// Authentication Routes
router.use("/auth", auth);

// User Management Routes
router.use("/users", users);

// Category Management Routes
router.use("/categories", categories);

// Home Services Routes
router.use("/services", services);

// Booking Management Routes
router.use("/bookings", bookings);

// Ratings & Reviews Routes
router.use("/reviews", reviews);

export default router;
