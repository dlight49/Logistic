import express from "express";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/backend/config/db.js";
import apiRoutes from "./src/backend/routes/index.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    const settingsCount = await prisma.setting.count();
    if (settingsCount === 0) {
      console.log("[SEED] Initializing system settings...");
      await prisma.setting.createMany({
        data: [
          { key: 'notify_sms', value: 'true' },
          { key: 'notify_email', value: 'true' },
          { key: 'alert_created', value: 'true' },
          { key: 'alert_arrived', value: 'true' },
          { key: 'alert_customs', value: 'true' },
          { key: 'alert_delivered', value: 'true' }
        ]
      });
    }

    if (process.env.NODE_ENV !== "production") {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        console.log("[SEED] Initializing development mock users...");
        await prisma.user.createMany({
          data: [
            { id: "1", email: "admin@logistics.com", role: "admin", name: "Alex Rivera", phone: "555-0100" },
            { id: "2", email: "driver@logistics.com", role: "operator", name: "John Driver", phone: "555-0101" },
            { id: "3", email: "customer@logistics.com", role: "customer", name: "Jane Customer", phone: "555-0202" }
          ]
        });

        // Give the customer some dummy shipments to look at
        await prisma.shipment.createMany({
          data: [
            {
              id: "GS-2026-X8Y2",
              sender_name: "Acme Corp", sender_city: "New York", sender_country: "USA", sender_address: "123 Broad St",
              receiver_name: "Jane Customer", receiver_city: "London", receiver_country: "UK", receiver_address: "456 Narrow St", receiver_email: "customer@logistics.com", receiver_phone: "555-0202",
              status: "In Transit", weight: 15, type: "Standard", est_delivery: "Oct 12, 2026"
            },
            {
              id: "GS-2026-A1B2",
              sender_name: "Tech Flow", sender_city: "Berlin", sender_country: "GER", sender_address: "789 Tech Ave",
              receiver_name: "Jane Customer", receiver_city: "Paris", receiver_country: "FRA", receiver_address: "101 River Rd", receiver_email: "customer@logistics.com", receiver_phone: "555-0202",
              status: "Delivered", weight: 2.5, type: "Express", est_delivery: "Oct 10, 2026"
            },
          ]
        });
      }
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

seedDatabase();

async function startServer() {
  console.log("=== Server Starting with Catch-All Fix ===");
  const app = express();
  const PORT = 3000;

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
