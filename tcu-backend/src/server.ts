import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import routes from "./routes/index";

const app = express();

// Global Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

// Health Check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", app: "TCU Platform v2.0" });
});

// Mount Super Router
app.use("/api", routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "not_found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  }
);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TCU Platform v2.0 backend running on port ${PORT}`);
});

export default app;
