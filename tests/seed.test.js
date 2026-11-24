import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";

describe("Testing endpoint Seed", () => {
  let existingUsers;
  let existingOrders;
  let existingDeliveries;

  before(async () => {
    existingUsers = await mongoose.connection
      .collection("users")
      .distinct("_id");
    existingOrders = await mongoose.connection
      .collection("orders")
      .distinct("_id");
    existingDeliveries = await mongoose.connection
      .collection("deliveries")
      .distinct("_id");
  });

  after(async () => {
    await mongoose.connection.collection("deliveries").deleteMany({
      _id: { $nin: existingDeliveries },
    });
    await mongoose.connection.collection("orders").deleteMany({
      _id: { $nin: existingOrders },
    });
    await mongoose.connection.collection("users").deleteMany({
      _id: { $nin: existingUsers },
    });
  });

  it("debe generar datos relacionados correctamente", async () => {
    const response = await request(app).post("/api/mocks/seed?qty=4");

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal(
      "Datos de prueba generados correctamente",
    );
    expect(response.body.payload.users).to.equal(4);
    expect(response.body.payload.orders).to.equal(2);
    expect(response.body.payload.deliveries).to.equal(2);
  });

  it("debe rechazar una cantidad menor al mínimo requerido", async () => {
    const response = await request(app).post("/api/mocks/seed?qty=1");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("MOCK_SEED_MINIMUM");
  });

  it("debe rechazar una cantidad inválida", async () => {
    const response = await request(app).post("/api/mocks/seed?qty=abc");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_MOCK_QUANTITY");
  });
});
