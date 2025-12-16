import express from "express";

import {
  getProfile,
  changePassword,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfile);

router.patch("/", changePassword);

export default router;
