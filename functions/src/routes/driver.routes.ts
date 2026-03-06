import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// PUT /api/driver/location - Update driver GPS coordinates
router.put("/location", AuthMiddleware.verifyToken, UserController.updateLocation);

export default router;
