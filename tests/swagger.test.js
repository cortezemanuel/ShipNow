import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Testing documentación Swagger", () => {
  it("GET /api/docs debe responder correctamente", async () => {
    const response = await request(app).get("/api/docs/");

    expect(response.status).to.equal(200);
    expect(response.text).to.include("swagger-ui");
  });

  it("GET /api/docs-json debe devolver la documentación OpenAPI", async () => {
    const response = await request(app).get("/api/docs-json");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("openapi", "3.0.0");
    expect(response.body.info.title).to.equal("ShipNow API");
    expect(response.body).to.have.property("paths");
  });
});
