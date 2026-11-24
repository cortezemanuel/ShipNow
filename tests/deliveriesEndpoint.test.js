import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";
import { USER_ROLES } from "../src/constants/index.js";

const customerData = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana_deliveries_endpoint_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.CUSTOMER,
};

const driverData = {
  firstName: "Carlos",
  lastName: "Lopez",
  email: "carlos_deliveries_endpoint_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.DRIVER,
};

const regularUserData = {
  firstName: "Pedro",
  lastName: "Diaz",
  email: "pedro_deliveries_endpoint_test@shipnow.com",
  password: "123456",
};

const orderData = {
  items: [{ name: "Café molido", quantity: 1, price: 1500 }],
  deliveryAddress: "Av. Siempre Viva 742",
  total: 1500,
};

const nonexistentId = new mongoose.Types.ObjectId().toString();

let customerId;
let driverId;
let regularUserId;
let orderId;
let deliveryId;
let orderWithoutDriverId;
let orderWithInvalidDriverId;

describe("Testing endpoints de Deliveries", () => {
  before(async () => {
    const existingCustomer = await User.findOne({
      email: customerData.email,
    });

    if (existingCustomer) {
      const oldOrders = await Order.find({
        customer: existingCustomer._id,
      });

      const oldOrderIds = oldOrders.map((order) => order._id);

      await Delivery.deleteMany({
        order: { $in: oldOrderIds },
      });

      await Order.deleteMany({
        customer: existingCustomer._id,
      });
    }

    const existingDriver = await User.findOne({
      email: driverData.email,
    });

    if (existingDriver) {
      await Delivery.deleteMany({
        driver: existingDriver._id,
      });
    }

    await User.deleteMany({
      email: {
        $in: [customerData.email, driverData.email, regularUserData.email],
      },
    });

    const customer = await User.create(customerData);
    const driver = await User.create(driverData);
    const regularUser = await User.create(regularUserData);

    customerId = customer._id;
    driverId = driver._id;
    regularUserId = regularUser._id;

    const order = await Order.create({
      ...orderData,
      customer: customerId,
    });

    orderId = order._id;

    const orderWithoutDriver = await Order.create({
      ...orderData,
      customer: customerId,
    });

    const orderWithInvalidDriver = await Order.create({
      ...orderData,
      customer: customerId,
    });

    orderWithoutDriverId = orderWithoutDriver._id;
    orderWithInvalidDriverId = orderWithInvalidDriver._id;
  });

  after(async () => {
    const testOrderIds = [
      orderId,
      orderWithoutDriverId,
      orderWithInvalidDriverId,
    ].filter(Boolean);

    await Delivery.deleteMany({
      order: { $in: testOrderIds },
    });

    await Order.deleteMany({
      _id: { $in: testOrderIds },
    });

    await User.deleteMany({
      email: {
        $in: [customerData.email, driverData.email, regularUserData.email],
      },
    });
  });

  it("Crear una entrega correctamente", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        order: String(orderId),
        driver: String(driverId),
      });

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload.status).to.equal("pending");

    deliveryId = response.body.payload._id;
  });

  it("Rechazar la creación sin pedido", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        driver: String(driverId),
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_ORDER_REQUIRED");
  });

  it("Rechazar un pedido inexistente", async () => {
    const response = await request(app).post("/api/deliveries").send({
      order: nonexistentId,
    });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
  });

  it("Rechazar un pedido que ya tiene una entrega", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        order: String(orderId),
      });

    expect(response.status).to.equal(409);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_ORDER_ALREADY_ASSIGNED");
  });

  it("Rechazar un repartidor inexistente", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        order: String(orderWithoutDriverId),
        driver: nonexistentId,
      });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_DRIVER_NOT_FOUND");
  });

  it("Rechazar un usuario que no tenga rol de repartidor", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        order: String(orderWithInvalidDriverId),
        driver: String(regularUserId),
      });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_DRIVER_INVALID_ROLE");
  });

  it("Listar todas las entregas", async () => {
    const response = await request(app).get("/api/deliveries");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");

    const deliveryFound = response.body.payload.find(
      (delivery) => String(delivery._id) === String(deliveryId),
    );

    expect(deliveryFound).to.exist;
  });

  it("Buscar una entrega por ID", async () => {
    const response = await request(app).get(`/api/deliveries/${deliveryId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id", String(deliveryId));
  });

  it("Rechazar un ID inválido", async () => {
    const response = await request(app).get("/api/deliveries/123abc");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("VALIDATION_ERROR");
  });

  it("Rechazar una entrega inexistente", async () => {
    const response = await request(app).get(`/api/deliveries/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_NOT_FOUND");
  });
});
