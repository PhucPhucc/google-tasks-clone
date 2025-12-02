import express from "express";
import {
  refreshToken,
  logIn,
  logOut,
  register,
} from "../controllers/authController.js";

const router = express.Router();
//api/auth/register
router.post("/register", register);

router.post("/login", logIn);

router.post("/logout", logOut);

router.post("/refresh", refreshToken);

export default router;