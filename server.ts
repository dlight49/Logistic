import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("logistics.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    name TEXT,
    phone TEXT
  );

  CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    sender_name TEXT,
    sender_city TEXT,
    sender_country TEXT,
    sender_address TEXT,
    receiver_name TEXT,
    receiver_city TEXT,
    receiver_country TEXT,
    receiver_address TEXT,
    receiver_phone TEXT,
    receiver_email TEXT,
    status TEXT,
    weight REAL,
    type TEXT,
    est_delivery TEXT,
    operator_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(operator_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS tracking_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id TEXT,
    status TEXT,
    location TEXT,
    notes TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id)
  );

  CREATE TABLE IF NOT EXISTS customs_docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id TEXT,
    doc_type TEXT,
    status TEXT, -- verified, pending, missing
    uploaded_at DATETIME,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id)
  );

  CREATE TABLE IF NOT EXISTS notification_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipment_id TEXT,
    channel TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(shipment_id) REFERENCES shipments(id)
  );
`);

// Migration: Add phone to users and operator_id to shipments if they don't exist
try {
  db.prepare("ALTER TABLE users ADD COLUMN phone TEXT").run();
} catch (e) {}
try {
  db.prepare("ALTER TABLE shipments ADD COLUMN operator_id TEXT").run();
} catch (e) {}

// Seed initial data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (id, email, password, role, name) VALUES (?, ?, ?, ?, ?)").run(
    "1", "admin@logistics.com", "admin123", "admin", "Alex Rivera"
  );
  db.prepare("INSERT INTO users (id, email, password, role, name) VALUES (?, ?, ?, ?, ?)").run(
    "2", "driver@logistics.com", "driver123", "operator", "John Driver"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/shipments", (req, res) => {
    const { status, start_date, end_date, sender_country, receiver_country, type } = req.query;
    let query = "SELECT * FROM shipments WHERE 1=1";
    const params: any[] = [];

    if (status) {
      query += " AND status = ?";
      params.push(status);
    }
    if (start_date) {
      query += " AND created_at >= ?";
      params.push(start_date);
    }
    if (end_date) {
      query += " AND created_at <= ?";
      params.push(end_date);
    }
    if (sender_country) {
      query += " AND sender_country = ?";
      params.push(sender_country);
    }
    if (receiver_country) {
      query += " AND receiver_country = ?";
      params.push(receiver_country);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }

    query += " ORDER BY created_at DESC";
    const shipments = db.prepare(query).all(...params);
    res.json(shipments);
  });

  app.get("/api/operators", (req, res) => {
    const operators = db.prepare("SELECT id, name, email, phone, role FROM users WHERE role = 'operator'").all();
    const operatorsWithShipments = operators.map((op: any) => {
      const assignedShipments = db.prepare("SELECT id, status FROM shipments WHERE operator_id = ?").all(op.id);
      return { ...op, assignedShipments };
    });
    res.json(operatorsWithShipments);
  });

  app.post("/api/operators", (req, res) => {
    const { name, email, phone, password } = req.body;
    const id = Math.random().toString(36).substring(2, 10);
    try {
      db.prepare("INSERT INTO users (id, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, 'operator')")
        .run(id, name, email, phone, password || "driver123");
      res.status(201).json({ id });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch("/api/operators/:id", (req, res) => {
    const { name, email, phone } = req.body;
    db.prepare("UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ? AND role = 'operator'")
      .run(name, email, phone, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/shipments/:id/assign", (req, res) => {
    const { operator_id } = req.body;
    db.prepare("UPDATE shipments SET operator_id = ? WHERE id = ?").run(operator_id, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/shipments/:id", (req, res) => {
    const shipment = db.prepare("SELECT * FROM shipments WHERE id = ?").get(req.params.id);
    if (!shipment) return res.status(404).json({ error: "Shipment not found" });
    
    const updates = db.prepare("SELECT * FROM tracking_updates WHERE shipment_id = ? ORDER BY timestamp DESC").all(req.params.id);
    const docs = db.prepare("SELECT * FROM customs_docs WHERE shipment_id = ?").all(req.params.id);
    
    res.json({ ...shipment, updates, docs });
  });

  app.post("/api/shipments", (req, res) => {
    const { 
      sender_name, sender_city, sender_country, sender_address,
      receiver_name, receiver_city, receiver_country, receiver_address, receiver_phone, receiver_email,
      weight, type, est_delivery 
    } = req.body;

    const id = `GS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const insert = db.prepare(`
      INSERT INTO shipments (
        id, sender_name, sender_city, sender_country, sender_address,
        receiver_name, receiver_city, receiver_country, receiver_address, receiver_phone, receiver_email,
        status, weight, type, est_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id, sender_name, sender_city, sender_country, sender_address,
      receiver_name, receiver_city, receiver_country, receiver_address, receiver_phone, receiver_email,
      "Order Created", weight, type, est_delivery
    );

    db.prepare("INSERT INTO tracking_updates (shipment_id, status, location, notes) VALUES (?, ?, ?, ?)")
      .run(id, "Order Created", `${sender_city}, ${sender_country}`, "Shipment information received");

    res.status(201).json({ id });
  });

  app.post("/api/shipments/:id/updates", (req, res) => {
    const { status, location, notes } = req.body;
    const shipmentId = req.params.id;

    db.prepare("INSERT INTO tracking_updates (shipment_id, status, location, notes) VALUES (?, ?, ?, ?)")
      .run(shipmentId, status, location, notes);

    db.prepare("UPDATE shipments SET status = ? WHERE id = ?").run(status, shipmentId);

    // Mock Notification Trigger
    db.prepare("INSERT INTO notification_logs (shipment_id, channel, message) VALUES (?, ?, ?)")
      .run(shipmentId, "Email", `Status update for ${shipmentId}: ${status}`);

    res.json({ success: true });
  });

  app.get("/api/stats", (req, res) => {
    const total = db.prepare("SELECT count(*) as count FROM shipments").get() as any;
    const inTransit = db.prepare("SELECT count(*) as count FROM shipments WHERE status = 'In Transit'").get() as any;
    const inCustoms = db.prepare("SELECT count(*) as count FROM shipments WHERE status = 'Held by Customs'").get() as any;
    const issues = db.prepare("SELECT count(*) as count FROM shipments WHERE status = 'Delayed'").get() as any;
    const delivered = db.prepare("SELECT count(*) as count FROM shipments WHERE status = 'Delivered'").get() as any;

    res.json({
      total: total.count,
      inTransit: inTransit.count,
      inCustoms: inCustoms.count,
      issues: issues.count,
      delivered: delivered.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
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

startServer();
