import multer from "multer";
import { uploadDocument, uploadReceipt } from "../config/multer.config.js";
import AppError from "../utils/errors.js";

function handleUpload(upload, fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      if (!error) {
        return next();
      }

      if (error instanceof AppError) {
        return next(error);
      }

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return next(new AppError("FILE_TOO_LARGE"));
        }

        if (
          error.code === "LIMIT_UNEXPECTED_FILE" ||
          error.code === "LIMIT_FILE_COUNT"
        ) {
          return next(new AppError("FILE_UNEXPECTED_FIELD"));
        }
      }

      return next(new AppError("FILE_STORAGE_ERROR"));
    });
  };
}

export const uploadUserDocument = handleUpload(uploadDocument, "document");

export const uploadDeliveryReceipt = handleUpload(uploadReceipt, "receipt");
