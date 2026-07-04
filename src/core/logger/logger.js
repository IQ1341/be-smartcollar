const getCurrentTime = () => {
  return new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
  });
};

const logger = {
  info(message, data = null) {
    console.log(
      `[INFO] ${getCurrentTime()} - ${message}`,
      data ?? ""
    );
  },

  warn(message, data = null) {
    console.warn(
      `[WARN] ${getCurrentTime()} - ${message}`,
      data ?? ""
    );
  },

  error(message, error = null) {
    console.error(
      `[ERROR] ${getCurrentTime()} - ${message}`,
      error ?? ""
    );
  },
};

export default logger;