import ERROR_DICTIONARY from "./errorDictionary.js";

class AppError extends Error {
  constructor(errorCode, customMessage = null) {
    const errorDefinition =
      ERROR_DICTIONARY[errorCode] || ERROR_DICTIONARY.INTERNAL_SERVER_ERROR;

    super(customMessage || errorDefinition.message);

    this.name = "AppError";
    this.statusCode = errorDefinition.statusCode;
    this.code = ERROR_DICTIONARY[errorCode]
      ? errorCode
      : "INTERNAL_SERVER_ERROR";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
