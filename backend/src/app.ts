import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter, authLimiter, uploadLimiter } from "./middleware/rateLimit";
import { sanitizeBody } from "./middleware/validate";
import { env } from "./config/env";

import authRoutes from "./routes/auth.routes";
import uploadRoutes from "./routes/upload.routes";
import siteConfigRoutes from "./routes/siteConfig.routes";
import albumRoutes from "./routes/album.routes";
import photoRoutes from "./routes/photo.routes";
import timelineRoutes from "./routes/timeline.routes";
import musicRoutes from "./routes/music.routes";
import loveLetterRoutes from "./routes/loveLetter.routes";
import bucketListRoutes from "./routes/bucketList.routes";
import specialDayRoutes from "./routes/specialDay.routes";
import searchRoutes from "./routes/search.routes";
import placeRoutes from "./routes/place.routes";

const app = express();

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeBody);

// Rate limiting
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/upload", uploadLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/timeline", timelineRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/love-letters", loveLetterRoutes);
app.use("/api/bucket-list", bucketListRoutes);
app.use("/api/special-days", specialDayRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/places", placeRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "OurLove API is running" });
});

// Error handler
app.use(errorHandler);

export default app;
