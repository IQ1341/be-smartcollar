import dotenv from "dotenv";

dotenv.config();

const env = {
  app: {
    name: process.env.APP_NAME || "Smart Collar API",
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 3000,
    apiPrefix: process.env.API_PREFIX || "/api/v1",
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  },

  fonnte: {
    token: process.env.FONNTE_TOKEN,
  },

  monitoring: {
    temperatureMin: Number(process.env.DEFAULT_TEMPERATURE_MIN) || 37,
    temperatureMax: Number(process.env.DEFAULT_TEMPERATURE_MAX) || 39.5,
    batteryLow: Number(process.env.DEFAULT_BATTERY_LOW) || 20,
    offlineMinute: Number(process.env.DEVICE_TIMEOUT) || 5,
  },
};

export default env;