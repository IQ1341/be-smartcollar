import AppError from "../../core/exceptions/AppError.js";

import * as collarRepository from "../collar/collar.repository.js";
import * as assignmentRepository from "../assignment/assignment.repository.js";
import * as monitoringRepository from "./monitoring.repository.js";
import * as authRepository from "../auth/auth.repository.js";
import notificationService from "../notification/notification.service.js";

import { buildMonitoring } from "../../shared/builders/monitoring.builder.js";

const MOVEMENT_LABELS = {
  0: "Diam",
  1: "Gerak",
  2: "Lari",
};

/**
 * Label aktivitas yang aman untuk nilai status apa pun.
 * Konsisten dengan logika di frontend (lokasi.js/dashboard.js):
 * status 0 = Diam, selain itu = Bergerak (dengan label lebih spesifik kalau dikenal).
 */
const getMovementLabel = (status) => {
  if (status === 0 || typeof status === "undefined" || status === null) {
    return MOVEMENT_LABELS[0];
  }

  return MOVEMENT_LABELS[status] ?? "Bergerak";
};

const TEMPERATURE_LABELS = {
  0: "Normal",
  1: "Peringatan",
  2: "Bahaya",
};

/*
|--------------------------------------------------------------------------
| Konfigurasi Alert (bisa di-override lewat ENV, ada default)
|--------------------------------------------------------------------------
| IDLE_ALERT_THRESHOLD_HOURS : lama diam minimal sebelum dianggap tidak wajar
| TEMP_ALERT_COOLDOWN_HOURS  : jarak minimal antar notif suhu bahaya
|                               (selama suhu masih bahaya terus-menerus)
| IDLE_ALERT_COOLDOWN_HOURS  : jarak minimal antar notif diam
|                               (selama sapi masih diam terus-menerus)
*/

const hoursToMs = (hours) => hours * 60 * 60 * 1000;

const IDLE_ALERT_THRESHOLD_MS = hoursToMs(
  Number(process.env.IDLE_ALERT_THRESHOLD_HOURS) || 24
);

// Jarak minimal antar penyimpanan ke history (menit), terpisah dari
// saveLatest() yang tetap realtime tiap request masuk dari device.
const HISTORY_INTERVAL_MS =
  (Number(process.env.HISTORY_INTERVAL_MINUTES) || 5) * 60 * 1000;

const ALERT_COOLDOWN_MS = {
  temperature: hoursToMs(Number(process.env.TEMP_ALERT_COOLDOWN_HOURS) || 3),
  immobility: hoursToMs(Number(process.env.IDLE_ALERT_COOLDOWN_HOURS) || 6),
};

const formatTimestamp = (timestamp) => {
  try {
    return new Date(timestamp).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour12: false,
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return new Date(timestamp).toISOString();
  }
};

const formatDuration = (ms) => {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${minutes} menit`;
  }

  return minutes > 0 ? `${hours} jam ${minutes} menit` : `${hours} jam`;
};

/**
 * Hanya 2 kondisi yang bisa memicu notifikasi:
 * 1) Suhu tubuh sangat tinggi (status "Bahaya")
 * 2) Sapi diam (tidak bergerak) >= IDLE_ALERT_THRESHOLD_MS berturut-turut,
 *    sementara collar online (request ini datang langsung dari device).
 *
 * Catatan: fungsi ini hanya mengecek apakah KONDISI-nya terjadi.
 * Keputusan apakah notif benar-benar dikirim (biar tidak spam) ada di
 * sendMonitoringAlerts lewat pengecekan cooldown per tipe.
 */
const buildMonitoringAlerts = (monitoring, idleDurationMs) => {
  const events = [];

  if (monitoring.temperatureStatus === 2) {
    events.push({
      type: "temperature",
      level: "Bahaya",
      message: `Suhu tubuh sangat tinggi: ${monitoring.temperature}°C. Segera periksa kondisi sapi.`,
    });
  }

  const isIdle = (monitoring.movement?.status ?? 0) === 0;

  if (isIdle && typeof idleDurationMs === "number" && idleDurationMs >= IDLE_ALERT_THRESHOLD_MS) {
    events.push({
      type: "immobility",
      level: "Peringatan",
      message: `Tidak ada gerakan selama ${formatDuration(idleDurationMs)} berturut-turut, padahal collar dalam status online.`,
    });
  }

  return events;
};

const buildAlertMessage = (owner, monitoring, events) => {
  const time = formatTimestamp(monitoring.timestamp);

  const location = monitoring.gps?.linkMaps
    || (monitoring.gps?.latitude && monitoring.gps?.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${monitoring.gps.latitude},${monitoring.gps.longitude}`
      : null);

  const isDanger = events.some((event) => event.level === "Bahaya");
  const severityIcon = isDanger ? "🔴" : "🟠";

  const ownerName = owner?.nama || owner?.name || owner?.fullName;
  const greeting = ownerName ? `Halo ${ownerName},` : "Halo,";

  const eventLines = events
    .map((event) => `${event.type === "temperature" ? "🌡️🔥" : "🐄⚠️"} *${event.level}* — ${event.message}`)
    .join("\n");

  const sensorLines = [
    `🌡️ Suhu tubuh: *${monitoring.temperature}°C* (${TEMPERATURE_LABELS[monitoring.temperatureStatus] ?? "Tidak diketahui"})`,
    `🏃 Aktivitas: *${getMovementLabel(monitoring.movement?.status)}*`,
    `📶 Sinyal Collar: ${monitoring.signal ?? "-"}`,
    `🔧 Device: ${monitoring.deviceName ?? "-"} (SN: ${monitoring.serialNumber ?? "-"})`,
  ].join("\n");

  const locationBlock = location
    ? `📍 *Lokasi Terakhir:*\n${location}`
    : `📍 *Lokasi Terakhir:*\nTidak tersedia`;

  return (
    `${severityIcon} *SMART COLLAR ALERT*\n` +
    `${greeting} ada kondisi yang perlu perhatianmu.\n\n` +
    `🐄 *Sapi:* ${monitoring.cowName} (${monitoring.cowCode ?? "-"})\n` +
    `🆔 *Collar ID:* ${monitoring.collarId ?? "-"}\n\n` +
    `*Peringatan Terdeteksi:*\n${eventLines}\n\n` +
    `*Ringkasan Sensor Saat Ini:*\n${sensorLines}\n\n` +
    `${locationBlock}\n\n` +
    `⏰ *Waktu Kejadian:* ${time}\n\n` +
    `Mohon segera dicek langsung ke lapangan untuk memastikan keamanan sapi. 🙏`
  );
};

/**
 * Kirim notifikasi WA kalau ada event yang lolos cooldown.
 *
 * Anti-spam: memanfaatkan notificationService.shouldSendAlert() yang SUDAH
 * menyimpan waktu alert terakhir per (ownerId, cowId, alertType) di
 * notificationRepository — cukup kirim cooldownMs khusus per tipe
 * (ALERT_COOLDOWN_MS), bukan default 10 menit bawaannya.
 */
const sendMonitoringAlerts = async (ownerId, monitoring, idleDurationMs) => {
  const user = await authRepository.findUserById(ownerId);

  if (!user || !user.phone) {
    return null;
  }

  const events = buildMonitoringAlerts(monitoring, idleDurationMs);

  if (events.length === 0) {
    return null;
  }

  const allowedEvents = [];
  const suppressedEvents = [];

  for (const event of events) {
    const cooldownMs = ALERT_COOLDOWN_MS[event.type] ?? undefined;

    const canSend = await notificationService.shouldSendAlert(
      ownerId,
      monitoring.cowId,
      event.type,
      cooldownMs
    );

    if (canSend) {
      allowedEvents.push(event);
    } else {
      suppressedEvents.push(event);
    }
  }

  if (allowedEvents.length === 0) {
    for (const event of suppressedEvents) {
      await notificationService.logNotification(
        ownerId,
        monitoring.cowId,
        event.type,
        user.phone,
        buildAlertMessage(user, monitoring, [event]),
        false,
        null,
        true
      );
    }
    return null;
  }

  const message = buildAlertMessage(user, monitoring, allowedEvents);

  try {
    const result = await notificationService.sendWhatsApp(user.phone, message);

    for (const event of allowedEvents) {
      await notificationService.saveAlertSent(
        ownerId,
        monitoring.cowId,
        event.type,
        buildAlertMessage(user, monitoring, [event])
      );
      await notificationService.logNotification(
        ownerId,
        monitoring.cowId,
        event.type,
        user.phone,
        buildAlertMessage(user, monitoring, [event]),
        true,
        null,
        false
      );
    }

    for (const event of suppressedEvents) {
      await notificationService.logNotification(
        ownerId,
        monitoring.cowId,
        event.type,
        user.phone,
        buildAlertMessage(user, monitoring, [event]),
        false,
        null,
        true
      );
    }

    return result;
  } catch (err) {
    console.error("[NOTIFICATION] Failed to send WhatsApp alert:", err.message || err);

    for (const event of allowedEvents) {
      await notificationService.logNotification(
        ownerId,
        monitoring.cowId,
        event.type,
        user.phone,
        buildAlertMessage(user, monitoring, [event]),
        false,
        err?.message || err,
        false
      );
    }

    return null;
  }
};

/**
 * Monitoring dari ESP32
 */
export const receiveMonitoring = async (body) => {
  const {

  serialNumber,

  deviceSecret,

  device,

  sensor,

} = body;

  /*
  |--------------------------------------------------------------------------
  | Device Authentication
  |--------------------------------------------------------------------------
  */

  const collar = await collarRepository.findByDevice(
    serialNumber,
    deviceSecret
  );

  if (!collar) {
    throw new AppError(
      "Smart Collar not found",
      401
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Resolve cow assignment
  |--------------------------------------------------------------------------
  */
  let currentCowId = collar.currentCowId;
  let currentCowCode = collar.currentCowCode;
  let currentCowName = collar.currentCowName;
  let currentAssignmentId = collar.currentAssignmentId;

  if (!currentCowId) {
    const assignment = await assignmentRepository.findActiveByCollar(
      collar.ownerId,
      collar.id
    );

    if (!assignment) {
      throw new AppError(
        "Smart Collar is not assigned",
        400
      );
    }

    currentCowId = assignment.cowId;
    currentCowCode = assignment.cowCode;
    currentCowName = assignment.cowName;
    currentAssignmentId = assignment.id;
  }

  /*
  |--------------------------------------------------------------------------
  | Timestamp
  |--------------------------------------------------------------------------
  */

  const timestamp = Date.now();

  /*
  |--------------------------------------------------------------------------
  | Update Device Status
  |--------------------------------------------------------------------------
  */

  await collarRepository.touchOnline(
    collar.ownerId,
    collar.id,
    {
      signal: device.signal,

      firmwareVersion:
        device.firmwareVersion ?? null,

      hardwareVersion:
        device.hardwareVersion ?? null,

      lastOnline: timestamp,

      lastSync: timestamp,
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Build Monitoring Snapshot
  |--------------------------------------------------------------------------
  */

  const monitoring = buildMonitoring(
    {
      ...collar,
      currentCowId,
      currentCowCode,
      currentCowName,
      currentAssignmentId,
    },
    sensor,
    device,
    timestamp
  );

  /*
  |--------------------------------------------------------------------------
  | Track Idle Duration (untuk alert "diam 24 jam")
  |--------------------------------------------------------------------------
  | movement.status: 0 = Diam, 1 = Gerak
  | lastMovementAt di-update ke waktu sekarang setiap kali sapi bergerak.
  | Kalau belum pernah tercatat (collar baru), anggap baru saja bergerak
  | supaya tidak langsung false-alert saat pertama kali online.
  */

  const isMovingNow = (monitoring.movement?.status ?? 0) !== 0;
  const previousLastMovementAt = collar.lastMovementAt ?? timestamp;
  const lastMovementAt = isMovingNow ? timestamp : previousLastMovementAt;
  const idleDurationMs = timestamp - lastMovementAt;

  /*
  |--------------------------------------------------------------------------
  | Save Latest (REALTIME — selalu update tiap request masuk dari device)
  |--------------------------------------------------------------------------
  */

  await monitoringRepository.saveLatest(
    collar.ownerId,
    currentCowId,
    monitoring
  );

  /*
  |--------------------------------------------------------------------------
  | Save History (DI-THROTTLE — hanya disimpan tiap HISTORY_INTERVAL_MS,
  | supaya tabel history tidak membanjir tiap 5 detik dari ESP32)
  |--------------------------------------------------------------------------
  */

  const previousLastHistoryAt = collar.lastHistoryAt ?? 0;
  const shouldSaveHistory = (timestamp - previousLastHistoryAt) >= HISTORY_INTERVAL_MS;

  if (shouldSaveHistory) {
    await monitoringRepository.saveHistory(
      collar.ownerId,
      currentCowId,
      monitoring
    );
  }

  const lastHistoryAt = shouldSaveHistory ? timestamp : previousLastHistoryAt;

  /*
  |--------------------------------------------------------------------------
  | Persist state collar (assignment, lastMovementAt)
  |--------------------------------------------------------------------------
  */

  await collarRepository.update(
    collar.ownerId,
    collar.id,
    {
      currentCowId,
      currentCowCode,
      currentCowName,
      currentAssignmentId,
      lastMovementAt,
      lastHistoryAt,
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Alert (anti-spam per tipe ditangani oleh notificationService, lihat
  | cooldownMs khusus per tipe di ALERT_COOLDOWN_MS)
  |--------------------------------------------------------------------------
  */

  await sendMonitoringAlerts(
    collar.ownerId,
    monitoring,
    idleDurationMs
  );

  return monitoring;
};

/**
 * Monitoring realtime semua sapi
 */
export const getLatest = async (ownerId) => {

    const latest =
        await monitoringRepository.getLatest(ownerId);

    if (!latest) {
        return {};
    }

    return latest;

};

/**
 * Monitoring realtime satu sapi
 */
export const getLatestByCow = async (
  ownerId,
  cowId
) => {

  let monitoring =
    await monitoringRepository.getLatestByCow(
      ownerId,
      cowId
    );

  if (!monitoring) {
    const latest =
      await monitoringRepository.getLatest(ownerId);

    if (latest && typeof latest === "object") {
      monitoring = Object.values(latest).find(
        (item) => item && item.cowId === cowId
      );
    }
  }

  if (!monitoring) {
    throw new AppError(
      "Monitoring not found",
      404
    );
  }

  return monitoring;

};

/**
 * History Monitoring
 */
export const getHistory = async (
  ownerId,
  cowId,
  query
) => {

  const {
    year,
    month,
    day,
  } = query;

  return await monitoringRepository.getHistoryByDay(
    ownerId,
    cowId,
    year,
    month,
    day
  );

};