import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";

import validationMiddleware from "../../middlewares/validation.middleware.js";

import {
  attachSchema,
  detachSchema
} from "./assignment.schema.js";

import * as controller from "./assignment.controller.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  controller.getAll
);

router.post(
  "/attach",
  validationMiddleware(
    attachSchema
  ),
  controller.attach
);

router.post(
  "/detach",
  validationMiddleware(
    detachSchema
  ),
  controller.detach
);

export default router;