import Order from "../models/order.model.js";

class OrderRepository {
  async findAll() {
    return Order.find().populate("customer", "-password").populate("delivery");
  }

  async findById(orderId) {
    return Order.findById(orderId)
      .populate("customer", "-password")
      .populate("delivery");
  }

  async create(orderData) {
    return Order.create(orderData);
  }

  async insertMany(orders, session = null) {
    return Order.insertMany(orders, session ? { session } : {});
  }

  async updateDelivery(orderId, deliveryId, status, session = null) {
    return Order.findByIdAndUpdate(
      orderId,
      {
        delivery: deliveryId,
        status,
      },
      {
        new: true,
        runValidators: true,
        ...(session ? { session } : {}),
      },
    );
  }

  async deleteAll() {
    return Order.deleteMany({});
  }
}

export default new OrderRepository();
