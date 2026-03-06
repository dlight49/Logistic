import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// Routes imports
import authRoutes from "./routes/auth.routes.js";
import shipmentRoutes from "./routes/shipments.routes.js";
import operatorRoutes from "./routes/operators.routes.js";
import ticketRoutes from "./routes/tickets.routes.js";
import statRoutes from "./routes/stats.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import miscRoutes from "./routes/misc.routes.js";
import driverRoutes from "./routes/driver.routes.js";
// Load env vars
dotenv.config();
const app = express();
// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
// Routes
app.use("/auth", authRoutes);
app.use("/shipments", shipmentRoutes);
app.use("/operators", operatorRoutes);
app.use("/tickets", ticketRoutes);
app.use("/stats", statRoutes);
app.use("/messages", messageRoutes);
app.use("/misc", miscRoutes);
app.use("/driver", driverRoutes);
// Root health check
app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString(), service: "Lumin Logistics API" });
});
// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map