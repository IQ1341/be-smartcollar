import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";

import { syncUserSchema } from "./auth.schema.js";

import {
  sync,
  me,
} from "./auth.controller.js";

const router = Router();

router.post(
  "/sync",
  authMiddleware,
  validationMiddleware(syncUserSchema),
  sync
);

router.get(
  "/me",
  authMiddleware,
  me
);

export default router;