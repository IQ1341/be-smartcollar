import app from "./app.js";

import env from "./config/env.js";

import logger from "./core/logger/logger.js";

const PORT = env.app.port;

app.listen(PORT, () => {
  logger.info(`${env.app.name} running on port ${PORT}`);
});