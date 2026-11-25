import { unlink } from "fs/promises";
import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";
import logger from "../utils/logger.js";

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

  async addReceipt(deliveryId, file) {
    if (!file) {
      throw new AppError("FILE_REQUIRED");
    }

    try {
      await this.findById(deliveryId);

      const receiptPath = `uploads/delivery-receipts/${file.filename}`;

      const receiptData = {
        originalName: file.originalname,
        fileName: file.filename,
        path: receiptPath,
        mimeType: file.mimetype,
        size: file.size,
        documentType: DOCUMENT_TYPES.DELIVERY_PROOF,
        uploadedAt: new Date(),
      };

      const updatedDelivery = await deliveryRepository.addReceipt(
        deliveryId,
        receiptData,
      );
      if (!updatedDelivery) {
        throw new AppError("DELIVERY_NOT_FOUND");
      }

      logger.info("Comprobante asociado a una entrega", {
        deliveryId,
        fileName: file.filename,
      });

      return updatedDelivery;
    } catch (error) {
      logger.error("Error al cargar comprobante de entrega", {
        deliveryId,
        fileName: file.filename,
        error: error.message,
      });

      await unlink(file.path).catch(() => {});

      throw error;
    }
  }

  async insertMany(deliveries) {
    return deliveryRepository.insertMany(deliveries);
  }

  async deleteAll() {
    return deliveryRepository.deleteAll();
  }
}

export default new DeliveryService();
