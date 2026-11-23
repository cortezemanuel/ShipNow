import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";
import logger from "../utils/logger.js";

class OrderService {
  async findAll() {
    return orderRepository.findAll();
  }

  async findById(orderId) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    return order;
  }

  async create(orderData) {
    const { customer } = orderData;

    if (!customer) {
      throw new AppError("ORDER_CUSTOMER_REQUIRED");
    }

    const user = await userRepository.findById(customer);

    if (!user) {
      throw new AppError("ORDER_CUSTOMER_NOT_FOUND");
    }

    if (user.role !== USER_ROLES.CUSTOMER) {
      throw new AppError("ORDER_CUSTOMER_FORBIDDEN");
    }

    const order = await orderRepository.create(orderData);

    logger.info("Pedido creado correctamente", {
      orderId: order._id.toString(),
      customerId: customer.toString(),
    });

    return order;
  }
}

export default new OrderService();
