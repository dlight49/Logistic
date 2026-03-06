"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes imports
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const shipments_routes_js_1 = __importDefault(require("./routes/shipments.routes.js"));
const operators_routes_js_1 = __importDefault(require("./routes/operators.routes.js"));
const tickets_routes_js_1 = __importDefault(require("./routes/tickets.routes.js"));
const stats_routes_js_1 = __importDefault(require("./routes/stats.routes.js"));
const messages_routes_js_1 = __importDefault(require("./routes/messages.routes.js"));
const misc_routes_js_1 = __importDefault(require("./routes/misc.routes.js"));
const driver_routes_js_1 = __importDefault(require("./routes/driver.routes.js"));
// Load env vars
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_routes_js_1.default);
app.use("/shipments", shipments_routes_js_1.default);
app.use("/operators", operators_routes_js_1.default);
app.use("/tickets", tickets_routes_js_1.default);
app.use("/stats", stats_routes_js_1.default);
app.use("/messages", messages_routes_js_1.default);
app.use("/misc", misc_routes_js_1.default);
app.use("/driver", driver_routes_js_1.default);
// Root health check
app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString(), service: "Lumin Logistics API" });
});
// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map