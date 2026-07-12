import { Router } from "express";
import * as controller from "./notification.controller.js";
import testController from "./notification.test.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import validationMiddleware from "../../middlewares/validation.middleware.js";
import {
  sendWhatsAppSchema,
  sendTestWhatsAppSchema,
} from "./notification.schema.js";

const router = Router();

router.post(
  "/whatsapp",
  authMiddleware,
  validationMiddleware(sendWhatsAppSchema),
  controller.sendWhatsApp
);

router.post(
  "/whatsapp/test",
  authMiddleware,
  validationMiddleware(sendTestWhatsAppSchema),
  testController.sendTestWhatsApp
);

export default router;
