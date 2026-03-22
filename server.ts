import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/backend/config/db.js";
import apiRoutes from "./src/backend/routes/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("=== Server Starting with Catch-All Fix ===");
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json());

  // Artificial Delay for Premium UI feel — DISABLED FOR PRODUCTION
  app.use(async (req, res, next) => {
    // console.log(`[Request] ${req.method} ${req.path}`);
    // if (req.path.startsWith('/api/')) {
    //   await new Promise(r => setTimeout(r, 500));
    // }
    next();
  });

  // Debug
  console.log(`[Server] NODE_ENV: ${process.env.NODE_ENV}`);
  app.get('/ping', (req, res) => {
    console.log('[Request] GET /ping');
    res.send('pong');
  });

  // Modular routes
  app.use('/api', apiRoutes);

  // Real GPS Tracking Endpoint
  app.put('/api/driver/location', async (req, res) => {
    const { userId, lat, lng } = req.body;
    if (!userId || lat === undefined || lng === undefined) {
      return res.status(400).json({ error: "Missing userId, lat, or lng" });
    }
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { current_lat: lat, current_lng: lng }
      });
      res.json({ success: true });
    } catch (err) {
      console.error("Failed to update location:", err);
      res.status(500).json({ error: "Database update failed" });
    }
  });

  console.log("[Server] API routes registered");

  // Global Error Handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("API Error:", err);
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
      console.log(`[Dev Server] Serving index.html for ${url}`);
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        console.error(`[Dev Server] Error transformation HTML:`, e);
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical Server Start Failure:", err);
});
