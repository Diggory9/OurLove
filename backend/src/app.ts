import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";

import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import siteConfigRoutes from "./routes/siteConfig.routes";
import albumRoutes from "./routes/album.routes";
import photoRoutes from "./routes/photo.routes";
import timelineRoutes from "./routes/timeline.routes";
import musicRoutes from "./routes/music.routes";

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/music", musicRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "OurLove API is running" });
});

// Error handler
app.use(errorHandler);

export default app;
