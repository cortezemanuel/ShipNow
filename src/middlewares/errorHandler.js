import ERROR_DICTIONARY from "../utils/errorDictionary.js";
import logger from "../utils/logger.js";

const errorHandler = (error, req, res, next) => {
  let errorCode = error.code;

  if (!ERROR_DICTIONARY[errorCode]) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      errorCode = "VALIDATION_ERROR";
    } else if (error.code === 11000) {
      errorCode = "DUPLICATE_KEY";
    } else {
      errorCode = "INTERNAL_SERVER_ERROR";
    }
  }

  const errorDefinition = ERROR_DICTIONARY[errorCode];
  const isKnownAppError = error.name === "AppError";

  const logData = {
    code: errorCode,
    method: req.method,
    url: req.originalUrl,
    message: error.message,
    stack: error.stack,
  };

  if (errorDefinition.statusCode >= 500) {
    logger.error("Error interno de la API", logData);
  } else {
    logger.warning("Error controlado de la API", logData);
  }

  res.status(errorDefinition.statusCode).json({
    status: "error",
    message: isKnownAppError ? error.message : errorDefinition.message,
    code: errorCode,
  });
};

export default errorHandler;
