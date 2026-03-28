import "dotenv/config";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/backend/config/db.js";
import apiRoutes from "./src/backend/routes/index.js";
import logger from "./src/backend/utils/logger.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again after 15 minutes" }
});

async function startServer() {
  logger.info("=== Server Starting with Hardened Security ===");
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  // Security Headers
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to ensure Vite works in dev
  }));

  // CORS — allow frontend origin in dev, configurable in prod
  app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Rate Limiting
  app.use("/api/", limiter);

  app.use(express.json());

  // Log all requests (can be noisy, adjust as needed)
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
  });

  // Debug
  logger.info(`[Server] NODE_ENV: ${process.env.NODE_ENV}`);
  app.get('/ping', (req, res) => {
    logger.info('[Request] GET /ping');
    res.send('pong');
  });

  // Modular routes
  app.use('/api', apiRoutes);

  logger.info("[Server] API routes registered");

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error("API Error:", { error: err.message, stack: err.stack });
    res.status(500).json({ error: "Internal Server Error" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();

      const url = req.originalUrl;
      logger.debug(`[Dev Server] Serving index.html for ${url}`);
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        logger.error(`[Dev Server] Error transformation HTML:`, { error: e });
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  logger.error("Critical Server Start Failure:", { error: err });
});
