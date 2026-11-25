import Order from "../models/order.model.js";

class OrderRepository {
  async findAll({ page = 1, limit = 10, status = "", priority = "" } = {}) {
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    const [orders, total] = await Promise.all([
      Order.find(filters)
        .populate("customer", "-password")
        .populate("delivery")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Order.countDocuments(filters),
    ]);

    return { orders, total };
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
