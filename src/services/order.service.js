import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import {
  USER_ROLES,
  ORDER_STATUS,
  DELIVERY_PRIORITY,
} from "../constants/index.js";
import logger from "../utils/logger.js";

class OrderService {
  async findAll({ page = 1, limit = 10, status = "", priority = "" } = {}) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new AppError(
        "VALIDATION_ERROR",
        "La página debe ser un entero mayor a cero",
      );
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El límite debe ser un entero entre 1 y 100",
      );
    }

    const normalizedStatus = String(status).trim();
    const normalizedPriority = String(priority).trim();

    if (
      normalizedStatus &&
      !Object.values(ORDER_STATUS).includes(normalizedStatus)
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El estado del pedido no es válido",
      );
    }

    if (
      normalizedPriority &&
      !Object.values(DELIVERY_PRIORITY).includes(normalizedPriority)
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "La prioridad del pedido no es válida",
      );
    }

    const { orders, total } = await orderRepository.findAll({
      page: parsedPage,
      limit: parsedLimit,
      status: normalizedStatus,
      priority: normalizedPriority,
    });

    return {
      orders,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };
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
