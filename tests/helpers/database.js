import mongoose from "mongoose";

export const connectTestDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Falta MONGODB_URI para testing");
  }

  const databaseName = new URL(uri).pathname.slice(1).split("/")[0];

  if (databaseName !== "shipnow_test") {
    throw new Error("Los tests solo pueden utilizar shipnow_test");
  }

  await mongoose.connect(uri, {
    dbName: "shipnow_test",
  });

  if (mongoose.connection.name !== "shipnow_test") {
    await mongoose.disconnect();
    throw new Error("Conexión a una base de datos incorrecta");
  }
};

export const disconnectTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
