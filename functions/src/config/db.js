"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.auth = exports.db = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const app = (0, app_1.initializeApp)();
exports.db = (0, firestore_1.getFirestore)(app);
exports.auth = (0, auth_1.getAuth)(app);
// Simple prisma-like wrapper if needed for minimal changes, 
// but we'll mostly refactor to use standard Firestore patterns.
exports.prisma = {
// This is a placeholder to prevent immediate build errors 
// while we refactor the controllers.
};
//# sourceMappingURL=db.js.map