import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";

const router = Router();

/**
 * POST /api/v1/services
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, price, duration, image, categoryId } = req.body;

    if (!title || price === undefined || !categoryId) {
      return res.status(400).json({
        success: false,
        message: "Title, price, and categoryId are required",
      });
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        duration: duration ? parseInt(duration) : 60,
        image,
        categoryId,
      },
      include: { category: true },
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating service",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/services
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const categoryId = req.query.categoryId as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const includeDeleted = req.query.includeDeleted === "true";

    const skip = (page - 1) * limit;

    const whereCondition: any = {
      isDeleted: includeDeleted ? undefined : false,
    };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const services = await prisma.service.findMany({
      where: whereCondition,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalCount = await prisma.service.count({
      where: whereCondition,
    });

    res.status(200).json({
      success: true,
      message: "Services retrieved successfully",
      data: services,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalServices: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching services",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/services/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service retrieved successfully",
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching service",
      error: error.message,
    });
  }
});

/**
 * PATCH /api/v1/services/:id
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, description, price, duration, image, categoryId } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (duration !== undefined) updateData.duration = parseInt(duration);
    if (image !== undefined) updateData.image = image;
    if (categoryId) updateData.categoryId = categoryId;

    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/services/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const permanent = req.query.permanent === "true";

    if (permanent) {
      await prisma.service.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Service permanently deleted",
      });
    }

    const deletedService = await prisma.service.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message,
    });
  }
});

export default router;
