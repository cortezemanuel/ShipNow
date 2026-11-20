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
      throw new AppError("DELIVERY_NOT_FOUND");
    }

    return delivery;
  }

  async create(deliveryData) {
    const { order, driver } = deliveryData;

    if (!order) {
      throw new AppError("DELIVERY_ORDER_REQUIRED");
    }

    const existingOrder = await orderRepository.findById(order);

    if (!existingOrder) {
      throw new AppError("ORDER_NOT_FOUND");
    }

    if (existingOrder.delivery) {
      throw new AppError("DELIVERY_ORDER_ALREADY_ASSIGNED");
    }

    if (driver) {
      const existingDriver = await userRepository.findById(driver);

      if (!existingDriver) {
        throw new AppError("DELIVERY_DRIVER_NOT_FOUND");
      }

      if (existingDriver.role !== USER_ROLES.DRIVER) {
        throw new AppError("DELIVERY_DRIVER_INVALID_ROLE");
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
