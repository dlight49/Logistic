"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controllers/user.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
// PUT /api/driver/location - Update driver GPS coordinates
router.put("/location", auth_middleware_js_1.AuthMiddleware.verifyToken, user_controller_js_1.UserController.updateLocation);
exports.default = router;
//# sourceMappingURL=driver.routes.js.map