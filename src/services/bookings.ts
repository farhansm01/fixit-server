import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middlewares/auth";

const router = Router();

/**
 * POST /api/v1/bookings
 * Create a new service booking
 */
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || req.body.userId;
    const { serviceId, bookingDate, address, notes } = req.body;

    if (!userId || !serviceId || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "User ID, service ID, and booking date are required",
      });
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Service not found or unavailable",
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        bookingDate: new Date(bookingDate),
        totalAmount: service.price,
        status: "PENDING",
        address,
        notes,
      },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/bookings
 * Get all bookings with filtering & status
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string | undefined;
    const status = req.query.status as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 10);
    const includeDeleted = req.query.includeDeleted === "true";

    const skip = (page - 1) * limit;

    const whereCondition: any = {
      isDeleted: includeDeleted ? undefined : false,
    };

    if (userId) whereCondition.userId = userId;
    if (status) whereCondition.status = status.toUpperCase();

    const bookings = await prisma.booking.findMany({
      where: whereCondition,
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const totalCount = await prisma.booking.count({
      where: whereCondition,
    });

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalBookings: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
});

/**
 * GET /api/v1/bookings/:id
 * Get single booking by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          include: { category: true },
        },
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!booking || booking.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
});

/**
 * PATCH /api/v1/bookings/:id
 * Update booking status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, address, notes, bookingDate } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status.toUpperCase();
    if (address !== undefined) updateData.address = address;
    if (notes !== undefined) updateData.notes = notes;
    if (bookingDate) updateData.bookingDate = new Date(bookingDate);

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error.message,
    });
  }
});

/**
 * DELETE /api/v1/bookings/:id
 * Cancel / Soft delete booking
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const permanent = req.query.permanent === "true";

    if (permanent) {
      await prisma.booking.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Booking permanently deleted",
      });
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED", isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelledBooking,
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error cancelling booking",
      error: error.message,
    });
  }
});

export default router;
