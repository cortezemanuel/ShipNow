import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Testing endpoint Health", () => {
  it("GET /api/health debe responder correctamente", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("status", "ok");
    expect(response.body).to.have.property(
      "message",
      "ShipNow API funcionando correctamente",
    );
    expect(response.body).to.have.property("timestamp");
  });

  it("Debe responder 404 cuando se consulta una ruta inexistente", async () => {
    const response = await request(app).get("/api/ruta-inexistente");

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("message", "Ruta no encontrada");
    expect(response.body).to.have.property("code", "ROUTE_NOT_FOUND");
  });

  it("Debe responder 413 cuando el JSON supera 1 MB", async () => {
    const largePayload = {
      data: "a".repeat(1024 * 1024 + 100),
    };

    const response = await request(app)
      .post("/api/products")
      .send(largePayload);

    expect(response.status).to.equal(413);
    expect(response.body).to.have.property("status", "error");
    expect(response.body).to.have.property("code", "PAYLOAD_TOO_LARGE");
  });
});
