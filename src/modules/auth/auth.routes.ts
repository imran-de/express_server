import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

//!final route
// http://localhost:500/auth/login
router.post("/login", authController.logginUser)


export const authRoutes = router;