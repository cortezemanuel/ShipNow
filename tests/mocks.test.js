import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";

test("GET /api/mocks/users debe generar usuarios", async () => {
  const response = await request(app).get("/api/mocks/users?qty=3");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "success");
  assert.equal(response.body.total, 3);
  assert.equal(response.body.payload.length, 3);
});

test("GET /api/mocks/orders debe generar pedidos", async () => {
  const response = await request(app).get("/api/mocks/orders?qty=3");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "success");
  assert.equal(response.body.total, 3);
  assert.equal(response.body.payload.length, 3);
});

test("GET /api/mocks/deliveries debe generar entregas", async () => {
  const response = await request(app).get("/api/mocks/deliveries?qty=3");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "success");
  assert.equal(response.body.total, 3);
  assert.equal(response.body.payload.length, 3);
});

test("GET /api/mocks/users debe rechazar cantidades inválidas", async () => {
  const invalidQuantities = ["abc", "0", "-1", "1.5", "51"];

  for (const qty of invalidQuantities) {
    const response = await request(app).get(`/api/mocks/users?qty=${qty}`);

    assert.equal(response.status, 400, `Falló la validación para qty=${qty}`);
  }
});
