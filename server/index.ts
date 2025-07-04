import express, { type Request, type Response, type NextFunction } from "express";
import 'dotenv/config';
// import { setupVite, serveStatic, log } from "./vite";
import { demoModeMiddleware } from "./src/constants/demo-model.contant";
import { router } from "./src/routes";
import { app, server } from "./src/server";
import { uploadDir } from "./src/middlewares/multer/multer.middleware";
import cors from 'cors'
const isDev = app.get("env") === "development";
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static upload directory
app.use("/uploads", express.static(uploadDir));

app.use(demoModeMiddleware);

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;

  let capturedResponse: any;

  res.json = function (body, ...args) {
    capturedResponse = body;
    return originalJson.apply(this, [body, ...args]);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (capturedResponse) {
        logLine += ` :: ${JSON.stringify(capturedResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

// Async server bootstrapping
(async () => {
  console.log("🔧 Setting up server...");

  // // Priority /api middleware (for debugging)
  app.use("/api", (req, _res, next) => {
    console.log(`Priority API: ${req.method} ${req.path}`);
    next();
  });
  app.use("/api", router);

  app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
  });
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
    console.error("🔥 Server Error:", err);
  });

  // Dev: Vite middleware, Prod: static client files
  // if (isDev) {
  //   await setupVite(app, server);
  // } else {
  //   serveStatic(app);
  // }

  // listen server
  server.listen(port, () => {

    console.log(`✅ Server is running at http://localhost:${port}`);

  });
})();
