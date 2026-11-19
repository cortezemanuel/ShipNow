import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";

class OrderService {
  async findAll() {
    return orderRepository.findAll();
  }

  async findById(orderId) {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Pedido no encontrado", 404);
    }

    return order;
  }

  async create(orderData) {
    const { customer } = orderData;

    if (!customer) {
      throw new AppError("El cliente es obligatorio", 400);
    }

    const user = await userRepository.findById(customer);

    if (!user) {
      throw new AppError("Cliente no encontrado", 404);
    }

    if (user.role !== USER_ROLES.CUSTOMER) {
      throw new AppError("Solo los clientes pueden realizar pedidos", 403);
    }

    return orderRepository.create(orderData);
  }

  async insertMany(orders) {
    return orderRepository.insertMany(orders);
  }

  async deleteAll() {
    return orderRepository.deleteAll();
  }
}

export default new OrderService();
