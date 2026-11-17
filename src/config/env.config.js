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

const config = {
  port,
  mongoUri: process.env.MONGODB_URI.trim(),
  nodeEnv: process.env.NODE_ENV.trim(),
};

export default Object.freeze(config);
