import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";

import {
  createCowSchema,
  updateCowSchema,
} from "./cow.schema.js";

import * as controller from "./cow.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", controller.getAll);

router.get("/:id", controller.getById);

router.post(
  "/",
  validationMiddleware(createCowSchema),
  controller.create
);

router.put(
  "/:id",
  validationMiddleware(updateCowSchema),
  controller.update
);

router.delete(
  "/:id",
  controller.remove
);

export default router;