import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import { USER_ROLES } from "../src/constants/index.js";

const customerData = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana_orders_endpoint_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.CUSTOMER,
};

const regularUserData = {
  firstName: "Carlos",
  lastName: "Lopez",
  email: "carlos_orders_endpoint_test@shipnow.com",
  password: "123456",
};

const orderData = {
  items: [
    { name: "Café molido", quantity: 1, price: 1500 },
    { name: "Café en grano", quantity: 2, price: 50 },
  ],
  deliveryAddress: "Av. Siempre Viva 742",
  total: 1600,
  shippingCost: 200,
  declaredValue: 1600,
};

const nonexistentId = new mongoose.Types.ObjectId().toString();

let customerId;
let regularUserId;
let orderId;

describe("Testing endpoints de Orders", () => {
  before(async () => {
    await User.deleteMany({
      email: {
        $in: [customerData.email, regularUserData.email],
      },
    });

    const customer = await User.create(customerData);
    const regularUser = await User.create(regularUserData);

    customerId = customer._id;
    regularUserId = regularUser._id;
  });

  after(async () => {
    await Order.deleteMany({
      customer: { $in: [customerId, regularUserId] },
    });

    await User.deleteMany({
      email: {
        $in: [customerData.email, regularUserData.email],
      },
    });
  });

  it("Crear un pedido correctamente", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        ...orderData,
        customer: String(customerId),
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload).to.have.property(
      "deliveryAddress",
      orderData.deliveryAddress,
    );

    orderId = response.body.payload._id;
  });

  it("Rechazar la creación sin cliente", async () => {
    const response = await request(app).post("/api/orders").send(orderData);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_CUSTOMER_REQUIRED");
  });

  it("Rechazar un cliente inexistente", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        ...orderData,
        customer: nonexistentId,
      });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_CUSTOMER_NOT_FOUND");
  });

  it("Rechazar un usuario que no tenga rol de cliente", async () => {
    const response = await request(app)
      .post("/api/orders")
      .send({
        ...orderData,
        customer: String(regularUserId),
      });

    expect(response.status).to.equal(403);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_CUSTOMER_FORBIDDEN");
  });

  it("Listar todos los pedidos", async () => {
    const response = await request(app).get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");

    const orderFound = response.body.payload.find(
      (order) => String(order._id) === String(orderId),
    );

    expect(orderFound).to.exist;
  });

  it("Buscar un pedido por ID", async () => {
    const response = await request(app).get(`/api/orders/${orderId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id", orderId);
    expect(response.body.payload).to.have.property(
      "deliveryAddress",
      orderData.deliveryAddress,
    );
  });

  it("Rechazar un ID inválido", async () => {
    const response = await request(app).get("/api/orders/123abc");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("VALIDATION_ERROR");
  });

  it("Rechazar un pedido inexistente", async () => {
    const response = await request(app).get(`/api/orders/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
  });
});
