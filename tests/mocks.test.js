import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../src/app.js";
import logger from "../src/utils/logger.js";

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

test("GET /api/logger/test debe ejecutar todos los niveles de log", async () => {
  const levels = ["debug", "http", "info", "warning", "error", "fatal"];
  const calls = {};

  for (const level of levels) {
    calls[level] = 0;
  }

  const originalMethods = {};

  for (const level of levels) {
    originalMethods[level] = logger[level];
    logger[level] = () => {
      calls[level]++;
    };
  }

  try {
    const response = await request(app).get("/api/logger/test");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "success");
    assert.equal(
      response.body.message,
      "Se generaron registros de prueba en todos los niveles",
    );

    for (const level of levels) {
      assert.equal(calls[level], 1, `El nivel ${level} no fue ejecutado`);
    }
  } finally {
    for (const level of levels) {
      logger[level] = originalMethods[level];
    }
  }
});
