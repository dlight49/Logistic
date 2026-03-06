"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messages_controller_js_1 = require("../controllers/messages.controller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = (0, express_1.Router)();
router.use(authMiddleware_js_1.requireAuth);
router.get('/:otherUserId', messages_controller_js_1.getConversation);
router.post('/send', messages_controller_js_1.sendDirectMessage);
exports.default = router;
//# sourceMappingURL=messages.routes.js.map