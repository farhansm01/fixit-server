import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { authenticate, AuthRequest } from "../../middlewares/auth";

const router = Router();

/**
 * POST /api/v1/reviews
 */
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const { serviceId, rating, comment } = req.body;

    if (!userId || !serviceId || rating === undefined || !comment) {
      return res.status(400).json({
        success: false,
        message: "User ID, service ID, rating (1-5), and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    const review = await prisma.review.create({
      data: {
        userId,
        serviceId,
        rating: parseInt(rating),
        comment,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        service: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error submitting review",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/reviews
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const serviceId = req.query.serviceId as string | undefined;
    const userId = req.query.userId as string | undefined;
    const includeDeleted = req.query.includeDeleted === "true";

    const whereCondition: any = {
      isDeleted: includeDeleted ? undefined : false,
    };

    if (serviceId) whereCondition.serviceId = serviceId;
    if (userId) whereCondition.userId = userId;

    const reviews = await prisma.review.findMany({
      where: whereCondition,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        service: {
          select: { id: true, title: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/reviews/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        service: true,
      },
    });

    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review retrieved successfully",
      data: review,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching review",
      error: error.message,
    });
  }
});

/**
 * PATCH /api/v1/reviews/:id
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { rating, comment } = req.body;

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (comment !== undefined) updateData.comment = comment;

    const updatedReview = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/reviews/:id
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const permanent = req.query.permanent === "true";

    if (permanent) {
      await prisma.review.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Review permanently deleted",
      });
    }

    const deletedReview = await prisma.review.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: deletedReview,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
});

export default router;
