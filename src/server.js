import app from "./app.js";
import config from "./config/env.config.js";
import connectDB from "./config/database.config.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`ShipNow corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Error al iniciar ShipNow:", error.message);
    process.exit(1);
  }
};

startServer();
