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
});
