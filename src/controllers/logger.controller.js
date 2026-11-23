import logger from "../utils/logger.js";

const testLogger = (req, res) => {
  logger.debug("Mensaje de prueba nivel DEBUG");
  logger.http("Mensaje de prueba nivel HTTP");
  logger.info("Mensaje de prueba nivel INFO");
  logger.warning("Mensaje de prueba nivel WARNING");
  logger.error("Mensaje de prueba nivel ERROR");
  logger.fatal("Mensaje de prueba nivel FATAL");

  res.status(200).json({
    status: "success",
    message: "Se generaron registros de prueba en todos los niveles",
  });
};

export { testLogger };
