import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to FixIt Home Services REST API",
    version: "1.0.0",
    documentation: "/api/v1",
  });
});

// API Routes
app.use("/api/v1", routes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
