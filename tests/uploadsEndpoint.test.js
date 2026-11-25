import { expect } from "chai";
import request from "supertest";
import { unlink } from "fs/promises";
import path from "path";
import app from "../src/app.js";
import User from "../src/models/user.model.js";

const testUser = {
  firstName: "Upload",
  lastName: "Test",
  email: "upload_endpoint_test@shipnow.com",
  password: "123456",
};

const pdfBuffer = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

let userId;

describe("Testing endpoints de carga de archivos", () => {
  beforeEach(async () => {
    await User.deleteMany({ email: testUser.email });

    const user = await User.create(testUser);
    userId = String(user._id);
  });

  afterEach(async () => {
    const user = await User.findById(userId);

    if (user) {
      for (const document of user.documents) {
        if (document.path) {
          const filePath = path.resolve(process.cwd(), document.path);
          await unlink(filePath).catch(() => {});
        }
      }
    }

    await User.deleteMany({ email: testUser.email });
  });

  it("Cargar un documento correctamente", async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/documents`)
      .field("documentType", "user_document")
      .attach("document", pdfBuffer, {
        filename: "test.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.documents).to.have.lengthOf(1);
    expect(response.body.payload.documents[0].originalName).to.equal(
      "test.pdf",
    );
    expect(response.body.payload.documents[0].documentType).to.equal(
      "user_document",
    );
  });

  it("Rechazar la carga cuando falta el archivo", async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/documents`)
      .field("documentType", "user_document");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("FILE_REQUIRED");
  });

  it("Rechazar un tipo de documento inválido", async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/documents`)
      .field("documentType", "invalid_document")
      .attach("document", pdfBuffer, {
        filename: "invalid.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("INVALID_DOCUMENT_TYPE");

    const user = await User.findById(userId);

    expect(user.documents).to.have.lengthOf(0);
  });

  it("Rechazar un comprobante cuando la entrega no existe", async () => {
    const response = await request(app)
      .post("/api/deliveries/000000000000000000000000/receipts")
      .attach("receipt", pdfBuffer, {
        filename: "receipt.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_NOT_FOUND");
  });
});
