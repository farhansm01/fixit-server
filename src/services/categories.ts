import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

/**
 * POST /api/v1/categories
 * Create a new service category
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, image } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        image,
      },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Category name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/categories
 * Get all categories with optional services inclusion
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const includeServices = req.query.includeServices === "true";
    const includeDeleted = req.query.includeDeleted === "true";

    const categories = await prisma.category.findMany({
      where: includeDeleted ? {} : { isDeleted: false },
      include: {
        services: includeServices
          ? { where: { isDeleted: false } }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/categories/:id
 * Get specific category by ID with associated services
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        services: {
          where: { isDeleted: false },
        },
      },
    });

    if (!category || category.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
});

/**
 * PATCH /api/v1/categories/:id
 * Update category details
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, image } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (image !== undefined) updateData.image = image;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/categories/:id
 * Soft delete category
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const permanent = req.query.permanent === "true";

    if (permanent) {
      await prisma.category.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Category permanently deleted",
      });
    }

    const deletedCategory = await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
});

export default router;
