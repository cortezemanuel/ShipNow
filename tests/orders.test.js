import { expect } from "chai";
import orderRepository from "../src/repositories/order.repository.js";
import userRepository from "../src/repositories/user.repository.js";
import User from "../src/models/user.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";
import { USER_ROLES } from "../src/constants/index.js";

const customerData = {
  firstName: "Ana",
  lastName: "Gomez",
  email: "ana_gomez_orders_test@shipnow.com",
  password: "123456",
  role: USER_ROLES.CUSTOMER,
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

let customerId;
let orderId;

describe("Testing Repository de Orders", () => {
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

      await User.deleteOne({
        _id: existingCustomer._id,
      });
    }

    const customer = await userRepository.create(customerData);
    customerId = customer._id;
  });

  after(async () => {
    if (orderId) {
      await Delivery.deleteMany({ order: orderId });
      await Order.deleteOne({ _id: orderId });
    }

    if (customerId) {
      await User.deleteOne({ _id: customerId });
    }
  });

  it("Crear un pedido completo", async () => {
    const orderCreated = await orderRepository.create({
      ...orderData,
      customer: customerId,
    });

    orderId = orderCreated._id;

    expect(orderCreated).to.have.property("_id");
    expect(String(orderCreated.customer)).to.equal(String(customerId));
    expect(orderCreated).to.have.property(
      "deliveryAddress",
      "Av. Siempre Viva 742",
    );
    expect(orderCreated.delivery).to.be.null;
  });

  it("Buscar pedido por ID", async () => {
    const orderFound = await orderRepository.findById(orderId);

    expect(String(orderFound._id)).to.equal(String(orderId));
    expect(orderFound.customer).to.have.property("firstName", "Ana");
    expect(orderFound.customer).to.have.property("email", customerData.email);
  });

  it("Buscar todos los pedidos", async () => {
    const result = await orderRepository.findAll({
      page: 1,
      limit: 100,
      status: "",
      priority: "",
    });

    expect(result.orders).to.be.an("array");
    expect(result.total).to.be.a("number");

    const orderFound = result.orders.find(
      (order) => String(order._id) === String(orderId),
    );

    expect(orderFound).to.exist;
    expect(orderFound.customer).to.have.property("lastName", "Gomez");
  });
});
