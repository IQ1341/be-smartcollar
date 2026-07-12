import fonnte from "../../config/fonnte.js";
import * as notificationRepository from "./notification.repository.js";

const DEFAULT_COOLDOWN_MS = 1000 * 60 * 10; // 10 menit

const sendWhatsApp = async (phone, message, opts = {}) => {
  const payload = {
    target: phone,
    message,
    ...(opts.template ? { template: opts.template } : {}),
  };

  const res = await fonnte.post("/send", payload);
  return res.data;
};

const shouldSendAlert = async (
  ownerId,
  cowId,
  alertType,
  cooldownMs = DEFAULT_COOLDOWN_MS
) => {
  const lastAlert = await notificationRepository.getLastAlert(
    ownerId,
    cowId,
    alertType
  );

  if (!lastAlert || !lastAlert.timestamp) {
    return true;
  }

  const elapsed = Date.now() - lastAlert.timestamp;
  return elapsed > cooldownMs;
};

const saveAlertSent = async (
  ownerId,
  cowId,
  alertType,
  message
) => {
  await notificationRepository.saveLastAlert(ownerId, cowId, alertType, {
    timestamp: Date.now(),
    message,
  });
};

const logNotification = async (
  ownerId,
  cowId,
  alertType,
  phone,
  message,
  sent,
  error = null,
  suppressed = false
) => {
  await notificationRepository.saveNotificationLog(ownerId, cowId, {
    alertType,
    phone,
    message,
    sent,
    suppressed,
    error,
  });
};

const sendAlertIfAllowed = async (
  ownerId,
  cowId,
  alertType,
  phone,
  message,
  cooldownMs = DEFAULT_COOLDOWN_MS
) => {
  const canSend = await shouldSendAlert(ownerId, cowId, alertType, cooldownMs);

  if (!canSend) {
    await logNotification(ownerId, cowId, alertType, phone, message, false, null, true);
    return null;
  }

  try {
    const result = await sendWhatsApp(phone, message);
    await saveAlertSent(ownerId, cowId, alertType, message);
    await logNotification(ownerId, cowId, alertType, phone, message, true, null, false);
    return result;
  } catch (error) {
    await logNotification(ownerId, cowId, alertType, phone, message, false, error?.message || error, false);
    throw error;
  }
};

export default {
  sendWhatsApp,
  shouldSendAlert,
  saveAlertSent,
  logNotification,
  sendAlertIfAllowed,
};
