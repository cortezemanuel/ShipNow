import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import connectDB from "../src/config/database.config.js";

test("POST /api/mocks/seed debe generar datos relacionados", async () => {
  await connectDB();

  try {
    const response = await request(app).post("/api/mocks/seed?qty=4");

    console.log("RESPUESTA DEL SEED:", response.status, response.body);

    assert.equal(response.status, 201);
    assert.equal(response.body.status, "success");
    assert.equal(response.body.payload.users, 4);
    assert.equal(response.body.payload.orders, 2);
    assert.equal(response.body.payload.deliveries, 2);
  } finally {
    await mongoose.disconnect();
  }
});
