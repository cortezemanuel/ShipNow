import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import AppError from "../utils/errors.js";
import logger from "../utils/logger.js";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadsDirectory = path.resolve(currentDirectory, "../../uploads");

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function buildStorage(folder) {
  const destination = path.join(uploadsDirectory, folder);

  fs.mkdirSync(destination, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, destination);
    },
    filename: (_req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      callback(null, filename);
    },
  });
}

function fileFilter(req, file, callback) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    logger.warning("Intento de carga de archivo con formato no permitido", {
      route: req.originalUrl,
      field: file.fieldname,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    return callback(new AppError("FILE_INVALID_TYPE"));
  }

  callback(null, true);
}

function buildUpload(folder) {
  return multer({
    storage: buildStorage(folder),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
    fileFilter,
  });
}

export const uploadDocument = buildUpload("user-documents");
export const uploadReceipt = buildUpload("delivery-receipts");
