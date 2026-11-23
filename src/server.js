import app from "./app.js";
import config from "./config/env.config.js";
import connectDB from "./config/database.config.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      logger.info(`ShipNow corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.fatal("Error al iniciar ShipNow", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startServer();
