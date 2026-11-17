import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.router.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ShipNow API funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    message: error.message || "Error interno del servidor",
  });
});

export default app;
