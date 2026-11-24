import { expect } from "chai";
import userRepository from "../src/repositories/user.repository.js";
import orderRepository from "../src/repositories/order.repository.js";
import deliveryRepository from "../src/repositories/delivery.repository.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";
import { USER_ROLES } from "../src/constants/index.js";

const driverData = {
  firstName: "Carlos",
  lastName: "Lopez",
  email: "carlos_lopez_delivery_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.DRIVER,
};

const customerData = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana_gomez_delivery_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.CUSTOMER,
};

const orderData = {
  items: [{ name: "Café molido", quantity: 1, price: 1500 }],
  deliveryAddress: "Av. Siempre Viva 742",
  total: 1500,
};

let driverId;
let customerId;
let orderId;
let deliveryId;

describe("Testing Repository de Deliveries", () => {
  before(async () => {
    const existingDriver = await User.findOne({ email: driverData.email });
    const existingCustomer = await User.findOne({ email: customerData.email });

    if (existingDriver) {
      await Delivery.deleteMany({ driver: existingDriver._id });
      await User.deleteOne({ _id: existingDriver._id });
    }

    if (existingCustomer) {
      const oldOrders = await Order.find({ customer: existingCustomer._id });
      const oldOrderIds = oldOrders.map((order) => order._id);

      await Delivery.deleteMany({ order: { $in: oldOrderIds } });
      await Order.deleteMany({ customer: existingCustomer._id });
      await User.deleteOne({ _id: existingCustomer._id });
    }

    const driver = await userRepository.create(driverData);
    const customer = await userRepository.create(customerData);

    driverId = driver._id;
    customerId = customer._id;

    const order = await orderRepository.create({
      ...orderData,
      customer: customerId,
    });

    orderId = order._id;
  });

  after(async () => {
    if (deliveryId) {
      await Delivery.deleteOne({ _id: deliveryId });
    }

    if (orderId) {
      await Order.deleteOne({ _id: orderId });
    }

    if (driverId) {
      await User.deleteOne({ _id: driverId });
    }

    if (customerId) {
      await User.deleteOne({ _id: customerId });
    }
  });

  it("Crear una entrega completa", async () => {
    const deliveryCreated = await deliveryRepository.create({
      order: orderId,
      driver: driverId,
    });

    deliveryId = deliveryCreated._id;

    expect(deliveryCreated).to.have.property("_id");
    expect(String(deliveryCreated.order)).to.equal(String(orderId));
    expect(String(deliveryCreated.driver)).to.equal(String(driverId));
    expect(deliveryCreated.status).to.equal("pending");
  });

  it("Buscar entrega por ID", async () => {
    const deliveryFound = await deliveryRepository.findById(deliveryId);

    expect(String(deliveryFound._id)).to.equal(String(deliveryId));
    expect(deliveryFound.order).to.have.property(
      "deliveryAddress",
      orderData.deliveryAddress,
    );
    expect(deliveryFound.driver).to.have.property("firstName", "Carlos");
  });

  it("Buscar todas las entregas", async () => {
    const deliveries = await deliveryRepository.findAll();

    expect(deliveries).to.be.an("array");

    const deliveryFound = deliveries.find(
      (delivery) => String(delivery._id) === String(deliveryId),
    );

    expect(deliveryFound).to.exist;
    expect(deliveryFound.order).to.have.property(
      "deliveryAddress",
      orderData.deliveryAddress,
    );
    expect(deliveryFound.driver).to.have.property("lastName", "Lopez");
  });
});
