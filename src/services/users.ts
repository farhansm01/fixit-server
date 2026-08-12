import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { authenticate, authorizeRoles } from "../middlewares/auth";

const router = Router();

/**
 * POST /api/v1/users
 * Create a new user (Admin access or registration)
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || "CUSTOMER",
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/users
 * Get all active users
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";

    const users = await prisma.user.findMany({
      where: includeDeleted ? {} : { isDeleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/users/:id
 * Get single user by ID with bookings & reviews
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          where: { isDeleted: false },
          include: { service: true },
        },
        reviews: {
          where: { isDeleted: false },
          include: { service: true },
        },
      },
    });

    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

/**
 * PATCH /api/v1/users/:id
 * Update user information
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, phone, password, role } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (role) updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/users/:id
 * Soft delete user
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const permanent = req.query.permanent === "true";

    if (permanent) {
      await prisma.user.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "User permanently deleted",
      });
    }

    const deletedUser = await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      select: { id: true, isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully (soft delete)",
      data: deletedUser,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});

export default router;
