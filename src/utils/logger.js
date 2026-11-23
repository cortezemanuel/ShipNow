import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config/env.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    const extra = Object.keys(metadata).length
      ? ` ${JSON.stringify(metadata)}`
      : "";

    return `${timestamp} [${level}] ${message}${extra}`;
  }),
);
const errorOnlyFormat = winston.format((info) => {
  return ["error", "fatal"].includes(info.level) ? info : false;
});

const logger = winston.createLogger({
  levels,
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat,
      ),
    }),
    new DailyRotateFile({
      dirname: logsDirectory,
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "14d",
      level: "debug",
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, "error.log"),
      level: "debug",
      format: winston.format.combine(errorOnlyFormat(), logFormat),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
  ],
});

export default logger;
