import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.router.js";
import usersRouter from "./routes/users.js";
import mocksRouter from "./routes/mocks.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/errors.js";
import loggerRouter from "./routes/logger.router.js";
import ordersRouter from "./routes/orders.js";
import deliveriesRouter from "./routes/deliveries.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import config from "./config/env.config.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShipNow API funcionando correctamente",
    environment: config.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/deliveries", deliveriesRouter);
app.use("/api/users", usersRouter);

if (config.nodeEnv !== "production") {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api/docs-json", (req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use("/api/mocks", mocksRouter);
  app.use("/api/logger", loggerRouter);
}

app.use((req, res, next) => {
  next(new AppError("ROUTE_NOT_FOUND"));
});

app.use(errorHandler);

export default app;
