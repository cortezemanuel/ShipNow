import { unlink } from "fs/promises";
import deliveryRepository from "../repositories/delivery.repository.js";
import orderRepository from "../repositories/order.repository.js";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import {
  USER_ROLES,
  DOCUMENT_TYPES,
  DELIVERY_STATUS,
  DELIVERY_PRIORITY,
  ORDER_STATUS,
} from "../constants/index.js";
import logger from "../utils/logger.js";

class DeliveryService {
  async findAll({
    page = 1,
    limit = 10,
    status = "",
    priority = "",
    driver = "",
  } = {}) {
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
    const normalizedDriver = String(driver).trim();

    if (
      normalizedStatus &&
      !Object.values(DELIVERY_STATUS).includes(normalizedStatus)
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El estado de la entrega no es válido",
      );
    }

    if (
      normalizedPriority &&
      !Object.values(DELIVERY_PRIORITY).includes(normalizedPriority)
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "La prioridad de la entrega no es válida",
      );
    }

    if (normalizedDriver && !/^[0-9a-fA-F]{24}$/.test(normalizedDriver)) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El ID del conductor no es válido",
      );
    }

    const { deliveries, total } = await deliveryRepository.findAll({
      page: parsedPage,
      limit: parsedLimit,
      status: normalizedStatus,
      priority: normalizedPriority,
      driver: normalizedDriver,
    });

    return {
      deliveries,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };
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

  async updateStatus(deliveryId, newStatus) {
    const delivery = await this.findById(deliveryId);

    const transitions = {
      [DELIVERY_STATUS.PENDING]: [DELIVERY_STATUS.ASSIGNED],
      [DELIVERY_STATUS.ASSIGNED]: [DELIVERY_STATUS.IN_TRANSIT],
      [DELIVERY_STATUS.IN_TRANSIT]: [DELIVERY_STATUS.DELIVERED],
    };

    if (!Object.values(DELIVERY_STATUS).includes(newStatus)) {
      throw new AppError("INVALID_STATUS");
    }

    if (!transitions[delivery.status]?.includes(newStatus)) {
      throw new AppError("INVALID_STATUS");
    }

    if (newStatus === DELIVERY_STATUS.ASSIGNED && !delivery.driver) {
      throw new AppError(
        "DELIVERY_DRIVER_NOT_FOUND",
        "No se puede asignar una entrega sin repartidor",
      );
    }

    const orderStatuses = {
      [DELIVERY_STATUS.ASSIGNED]: ORDER_STATUS.ASSIGNED,
      [DELIVERY_STATUS.IN_TRANSIT]: ORDER_STATUS.IN_TRANSIT,
      [DELIVERY_STATUS.DELIVERED]: ORDER_STATUS.DELIVERED,
    };

    const dates = {};

    if (newStatus === DELIVERY_STATUS.ASSIGNED) {
      dates.assignedAt = new Date();
    }

    if (newStatus === DELIVERY_STATUS.DELIVERED) {
      dates.deliveredAt = new Date();
    }

    const descriptions = {
      [DELIVERY_STATUS.ASSIGNED]: "Entrega asignada a un repartidor",
      [DELIVERY_STATUS.IN_TRANSIT]: "El pedido está en camino",
      [DELIVERY_STATUS.DELIVERED]: "Pedido entregado correctamente",
    };

    const trackingEntry = {
      status: newStatus,
      description: descriptions[newStatus],
      timestamp: new Date(),
    };

    const updatedDelivery = await deliveryRepository.updateStatus(
      deliveryId,
      newStatus,
      trackingEntry,
      dates,
    );

    await orderRepository.updateDelivery(
      delivery.order._id,
      deliveryId,
      orderStatuses[newStatus],
    );

    return updatedDelivery;
  }

  async insertMany(deliveries) {
    return deliveryRepository.insertMany(deliveries);
  }

  async deleteAll() {
    return deliveryRepository.deleteAll();
  }
}

export default new DeliveryService();
