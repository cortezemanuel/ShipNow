import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";

class DeliveryService {
  async findAll() {
    return deliveryRepository.findAll();
  }

  async findById(deliveryId) {
    const delivery = await deliveryRepository.findById(deliveryId);

    if (!delivery) {
      throw new AppError("Entrega no encontrada", 404);
    }

    return delivery;
  }

  async create(deliveryData) {
    const { order, driver } = deliveryData;

    if (!order) {
      throw new AppError("El pedido es obligatorio", 400);
    }

    const existingOrder = await orderRepository.findById(order);

    if (!existingOrder) {
      throw new AppError("Pedido no encontrado", 404);
    }

    if (existingOrder.delivery) {
      throw new AppError("El pedido ya tiene una entrega asignada", 409);
    }

    if (driver) {
      const existingDriver = await userRepository.findById(driver);

      if (!existingDriver) {
        throw new AppError("Repartidor no encontrado", 404);
      }

      if (existingDriver.role !== USER_ROLES.DRIVER) {
        throw new AppError(
          "El usuario asignado no tiene el rol de repartidor",
          400,
        );
      }
    }

    const delivery = await deliveryRepository.create(deliveryData);

    await orderRepository.updateDelivery(order, delivery._id);

    return delivery;
  }

  async insertMany(deliveries) {
    return deliveryRepository.insertMany(deliveries);
  }

  async deleteAll() {
    return deliveryRepository.deleteAll();
  }
}

export default new DeliveryService();
