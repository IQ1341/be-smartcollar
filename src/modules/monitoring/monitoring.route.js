import { Router } from "express";

import * as controller from "./monitoring.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";

import {
  createMonitoringSchema
} from "./monitoring.schema.js";

const router=Router();

/*
|--------------------------------------------------------------------------
| ESP32
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  validationMiddleware(createMonitoringSchema),
  controller.receive
);

/*
|--------------------------------------------------------------------------
| Mobile
|--------------------------------------------------------------------------
*/

router.get(
  "/latest",
  authMiddleware,
  controller.getLatest
);

router.get(
  "/latest/:cowId",
  authMiddleware,
  controller.getLatestByCow
);

router.get(
  "/history/:cowId",
  authMiddleware,
  controller.getHistory
);

/*
|--------------------------------------------------------------------------
| Debug endpoint - no authentication required
|--------------------------------------------------------------------------
*/

router.get(
    "/debug/latest",
    controller.getLatestDebug
);

export default router;