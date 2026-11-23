import mongoose from "mongoose";
import config from "./env.config.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);

    logger.info("MongoDB conectado correctamente");
  } catch (error) {
    logger.fatal("Error al conectar con MongoDB", {
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};

export default connectDB;
