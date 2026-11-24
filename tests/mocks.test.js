import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import logger from "../src/utils/logger.js";

const invalidQuantities = ["abc", "0", "-1", "1.5", "51"];

const validateInvalidQuantities = async (endpoint) => {
  for (const qty of invalidQuantities) {
    const response = await request(app).get(`${endpoint}?qty=${qty}`);

    expect(response.status, `Falló la validación para qty=${qty}`).to.equal(
      400,
    );
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_MOCK_QUANTITY");
    expect(response.body.message).to.equal(
      "La cantidad debe ser un número entero entre 1 y 50",
    );
  }
};

describe("Testing endpoints de Mocks y Logger", () => {
  describe("GET /api/mocks/users", () => {
    it("debe generar usuarios ficticios", async () => {
      const response = await request(app).get("/api/mocks/users?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.total).to.equal(3);
      expect(response.body.payload).to.have.lengthOf(3);
    });

    it("debe rechazar cantidades inválidas", async () => {
      await validateInvalidQuantities("/api/mocks/users");
    });
  });

  describe("GET /api/mocks/orders", () => {
    it("debe generar pedidos ficticios", async () => {
      const response = await request(app).get("/api/mocks/orders?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.total).to.equal(3);
      expect(response.body.payload).to.have.lengthOf(3);
    });

    it("debe rechazar cantidades inválidas", async () => {
      await validateInvalidQuantities("/api/mocks/orders");
    });
  });

  describe("GET /api/mocks/deliveries", () => {
    it("debe generar entregas ficticias", async () => {
      const response = await request(app).get("/api/mocks/deliveries?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.total).to.equal(3);
      expect(response.body.payload).to.have.lengthOf(3);
    });

    it("debe rechazar cantidades inválidas", async () => {
      await validateInvalidQuantities("/api/mocks/deliveries");
    });
  });

  describe("GET /api/logger/test", () => {
    it("debe ejecutar todos los niveles de log", async () => {
      const levels = ["debug", "http", "info", "warning", "error", "fatal"];
      const calls = {};
      const originalMethods = {};

      for (const level of levels) {
        calls[level] = 0;
        originalMethods[level] = logger[level];

        logger[level] = () => {
          calls[level]++;
        };
      }

      try {
        const response = await request(app).get("/api/logger/test");

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");
        expect(response.body.message).to.equal(
          "Se generaron registros de prueba en todos los niveles",
        );

        for (const level of levels) {
          expect(calls[level], `El nivel ${level} no fue ejecutado`).to.equal(
            1,
          );
        }
      } finally {
        for (const level of levels) {
          logger[level] = originalMethods[level];
        }
      }
    });
  });
});
