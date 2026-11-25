import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "MONGODB_URI", "NODE_ENV"];

const missingEnvVars = requiredEnvVars.filter(
  (variable) => !process.env[variable]?.trim(),
);

if (missingEnvVars.length > 0) {
  throw new Error(`Faltan variables de entorno: ${missingEnvVars.join(", ")}`);
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const allowedEnvironments = ["development", "test", "production"];

const nodeEnv = process.env.NODE_ENV.trim();

if (!allowedEnvironments.includes(nodeEnv)) {
  throw new Error("NODE_ENV debe ser development, test o production.");
}

const allowedLogLevels = ["fatal", "error", "warning", "info", "http", "debug"];

const logLevel =
  process.env.LOG_LEVEL?.trim() ||
  (nodeEnv === "production" ? "info" : "debug");

if (!allowedLogLevels.includes(logLevel)) {
  throw new Error("LOG_LEVEL contiene un nivel no permitido.");
}

const config = {
  port,
  mongoUri: process.env.MONGODB_URI.trim(),
  nodeEnv,
  logLevel,
};

export default Object.freeze(config);
