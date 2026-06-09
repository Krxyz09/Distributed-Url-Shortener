import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import urlRoutes from "./routes/urlRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { redirectAndLog } from "./controllers/urlController.js";

const app = express();

// FIX 1: Uncommented and set the default fallback to 5000 to match Docker
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// API routes
app.use("/api", urlRoutes);
app.use("/api/analytics", analyticsRoutes);

// Public redirect: GET /:slug -> long URL
// (This is perfectly configured to catch http://localhost/2Bn via Nginx!)
app.get("/:slug", redirectAndLog);

const start = async () => {
  await connectDB();
  // FIX 2: PORT variable is now safely defined and accessible here
  app.listen(PORT, () => {
    console.log(`🚀 Backend running internally at port: ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});