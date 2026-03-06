"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const operators_controller_js_1 = require("../controllers/operators.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
// Only Admins can manage operators
router.use(authMiddleware_js_1.requireAuth);
router.use(authMiddleware_js_1.requireAdmin);
router.get('/', operators_controller_js_1.getOperators);
router.post('/', operators_controller_js_1.createOperator);
router.patch('/:id', operators_controller_js_1.updateOperator);
exports.default = router;
//# sourceMappingURL=operators.routes.js.map