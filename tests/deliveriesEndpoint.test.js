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
let orderAlreadyAssignedId;
let deliveryId;
let orderWithoutDriverId;
let orderWithInvalidDriverId;

describe("Testing endpoints de Deliveries", () => {
  beforeEach(async () => {
    const existingUsers = await User.find({
      email: {
        $in: [customerData.email, driverData.email, regularUserData.email],
      },
    }).select("_id");

    const existingOrders = await Order.find({
      customer: { $in: existingUsers.map((user) => user._id) },
    }).select("_id");

    const existingOrderIds = existingOrders.map((order) => order._id);

    await Delivery.deleteMany({
      $or: [
        { order: { $in: existingOrderIds } },
        { driver: { $in: existingUsers.map((user) => user._id) } },
      ],
    });

    await Order.deleteMany({
      customer: { $in: existingUsers.map((user) => user._id) },
    });

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

    const orderWithoutDriver = await Order.create({
      ...orderData,
      customer: customerId,
    });

    const orderWithInvalidDriver = await Order.create({
      ...orderData,
      customer: customerId,
    });

    orderId = order._id;
    orderWithoutDriverId = orderWithoutDriver._id;
    orderWithInvalidDriverId = orderWithInvalidDriver._id;

    const orderAlreadyAssigned = await Order.create({
      ...orderData,
      customer: customerId,
    });

    orderAlreadyAssignedId = orderAlreadyAssigned._id;

    const delivery = await Delivery.create({
      order: orderAlreadyAssignedId,
      driver: driverId,
    });

    deliveryId = delivery._id;

    await Order.findByIdAndUpdate(orderAlreadyAssignedId, {
      delivery: delivery._id,
    });
  });

  after(async () => {
    const testOrderIds = [
      orderId,
      orderWithoutDriverId,
      orderWithInvalidDriverId,
      orderAlreadyAssignedId,
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
    expect(response.body.message).to.equal("El pedido es obligatorio");
  });

  it("Rechazar un pedido inexistente", async () => {
    const response = await request(app).post("/api/deliveries").send({
      order: nonexistentId,
    });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("ORDER_NOT_FOUND");
    expect(response.body.message).to.equal("Pedido no encontrado");
  });

  it("Rechazar un pedido que ya tiene una entrega", async () => {
    const response = await request(app)
      .post("/api/deliveries")
      .send({
        order: String(orderAlreadyAssignedId),
      });

    expect(response.status).to.equal(409);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_ORDER_ALREADY_ASSIGNED");
    expect(response.body.message).to.equal(
      "El pedido ya tiene una entrega asignada",
    );
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
    expect(response.body.message).to.equal("Repartidor no encontrado");
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
    expect(response.body.message).to.equal(
      "El usuario asignado no tiene el rol de repartidor",
    );
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
    expect(response.body.message).to.equal(
      "Los datos proporcionados no son válidos",
    );
  });

  it("Rechazar una entrega inexistente", async () => {
    const response = await request(app).get(`/api/deliveries/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("DELIVERY_NOT_FOUND");
  });
});
