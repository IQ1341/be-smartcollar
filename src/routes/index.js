import { Router } from "express";
import authRoute from "../modules/auth/auth.route.js";
import cowRoute from "../modules/cow/cow.route.js";
import collarRoute from "../modules/collar/collar.route.js";
import assignmentRoute from "../modules/assignment/assignment.route.js";
import monitoringRoute from "../modules/monitoring/monitoring.route.js";
import notificationRoute from "../modules/notification/notification.route.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Smart Collar API v1",
    data: null,
  });
});

/*
|--------------------------------------------------------------------------
| Modules
|--------------------------------------------------------------------------
*/


router.use("/auth", authRoute);
router.use("/cows", cowRoute);
router.use("/collars", collarRoute);
router.use("/assignments", assignmentRoute);
router.use("/monitoring", monitoringRoute);
router.use("/notifications", notificationRoute);
// router.use("/settings", settingRoute);

export default router;