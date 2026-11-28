import { expect } from "chai";
import request from "supertest";
import { unlink } from "fs/promises";
import path from "path";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";

const testUser = {
  firstName: "Upload",
  lastName: "Test",
  email: "upload_endpoint_test@shipnow.com",
  password: "123456",
};

const orderData = {
  items: [{ name: "Cafe molido", quantity: 1, price: 1500 }],
  deliveryAddress: "Av. Siempre Viva 742",
  total: 1500,
};

const pdfBuffer = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF",
);

let userId;
let orderId;
let deliveryId;

async function removeFile(filePath) {
  if (filePath) {
    await unlink(path.resolve(process.cwd(), filePath)).catch(() => {});
  }
}

describe("Testing endpoints de carga de archivos", () => {
  beforeEach(async () => {
    const existingUser = await User.findOne({ email: testUser.email });

    if (existingUser) {
      const existingOrders = await Order.find({
        customer: existingUser._id,
      }).select("_id");

      const existingOrderIds = existingOrders.map((order) => order._id);

      const existingDeliveries = await Delivery.find({
        order: { $in: existingOrderIds },
      });

      for (const delivery of existingDeliveries) {
        for (const receipt of delivery.receipts) {
          await removeFile(receipt.path);
        }
      }

      await Delivery.deleteMany({
        order: { $in: existingOrderIds },
      });

      await Order.deleteMany({
        _id: { $in: existingOrderIds },
      });

      for (const document of existingUser.documents) {
        await removeFile(document.path);
      }

      await User.deleteOne({ _id: existingUser._id });
    }

    const user = await User.create(testUser);
    userId = user._id;

    const order = await Order.create({
      ...orderData,
      customer: userId,
    });

    orderId = order._id;

    const delivery = await Delivery.create({
      order: orderId,
    });

    deliveryId = delivery._id;

    await Order.findByIdAndUpdate(orderId, {
      delivery: deliveryId,
    });
  });

  afterEach(async () => {
    const user = await User.findById(userId);
    const delivery = await Delivery.findById(deliveryId);

    if (user) {
      for (const document of user.documents) {
        await removeFile(document.path);
      }
    }

    if (delivery) {
      for (const receipt of delivery.receipts) {
        await removeFile(receipt.path);
      }
    }

    await Delivery.deleteOne({ _id: deliveryId });
    await Order.deleteOne({ _id: orderId });
    await User.deleteOne({ _id: userId });
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

  it("Rechazar un archivo con MIME no permitido", async () => {
    const response = await request(app)
      .post(`/api/users/${userId}/documents`)
      .field("documentType", "user_document")
      .attach("document", Buffer.from("archivo de texto"), {
        filename: "test.txt",
        contentType: "text/plain",
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("FILE_INVALID_TYPE");
  });

  it("Rechazar un archivo superior a 5 MB", async () => {
    const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1, "a");

    const response = await request(app)
      .post(`/api/users/${userId}/documents`)
      .field("documentType", "user_document")
      .attach("document", largeBuffer, {
        filename: "large.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(413);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("FILE_TOO_LARGE");
  });

  it("Cargar un comprobante correctamente", async () => {
    const response = await request(app)
      .post(`/api/deliveries/${deliveryId}/receipts`)
      .attach("receipt", pdfBuffer, {
        filename: "receipt.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload.receipts).to.have.lengthOf(1);
    expect(response.body.payload.receipts[0].originalName).to.equal(
      "receipt.pdf",
    );
    expect(response.body.payload.receipts[0].mimeType).to.equal(
      "application/pdf",
    );

    const delivery = await Delivery.findById(deliveryId);

    expect(delivery.receipts).to.have.lengthOf(1);
    expect(delivery.receipts[0].documentType).to.equal("delivery_proof");
  });

  it("Rechazar un comprobante sin archivo", async () => {
    const response = await request(app).post(
      `/api/deliveries/${deliveryId}/receipts`,
    );

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("FILE_REQUIRED");
  });

  it("Rechazar un campo de archivo inesperado", async () => {
    const response = await request(app)
      .post(`/api/deliveries/${deliveryId}/receipts`)
      .attach("unexpected", pdfBuffer, {
        filename: "unexpected.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("FILE_UNEXPECTED_FIELD");
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
