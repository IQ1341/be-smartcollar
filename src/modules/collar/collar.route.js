import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";

import {
  createCollarSchema,
  updateCollarSchema,
} from "./collar.schema.js";

import * as controller from "./collar.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.post(
  "/",
  validationMiddleware(createCollarSchema),
  controller.create
);

router.put(
  "/:id",
  validationMiddleware(updateCollarSchema),
  controller.update
);

router.delete(
  "/:id",
  controller.deleteById
);

export default router;