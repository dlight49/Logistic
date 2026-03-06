"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./auth.routes.js"));
const shipments_routes_js_1 = __importDefault(require("./shipments.routes.js"));
const operators_routes_js_1 = __importDefault(require("./operators.routes.js"));
const stats_routes_js_1 = __importDefault(require("./stats.routes.js"));
const tickets_routes_js_1 = __importDefault(require("./tickets.routes.js"));
const messages_routes_js_1 = __importDefault(require("./messages.routes.js"));
const misc_routes_js_1 = __importDefault(require("./misc.routes.js"));
const router = (0, express_1.Router)();
router.use('/', auth_routes_js_1.default);
router.use('/shipments', shipments_routes_js_1.default);
router.use('/operators', operators_routes_js_1.default);
router.use('/stats', stats_routes_js_1.default);
router.use('/tickets', tickets_routes_js_1.default);
router.use('/chat', messages_routes_js_1.default);
router.use('/', misc_routes_js_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map