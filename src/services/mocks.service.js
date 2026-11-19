import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { MOCKING_PARAMETERS, USER_ROLES } from "../constants/index.js";
import { generateMockUsers } from "../mocks/user.mocks.js";
import { generateMockOrders } from "../mocks/order.mocks.js";
import { generateMockDeliveries } from "../mocks/delivery.mocks.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";
import AppError from "../utils/errors.js";

class MocksService {
  validateQuantity(qty) {
    const quantity = Number(qty ?? MOCKING_PARAMETERS.DEFAULT);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new AppError("La cantidad debe ser un número entero positivo", 400);
    }

    if (quantity > MOCKING_PARAMETERS.MAX) {
      throw new AppError(
        `La cantidad máxima permitida es ${MOCKING_PARAMETERS.MAX}`,
        400,
      );
    }

    return quantity;
  }

  getUsers(qty) {
    const quantity = this.validateQuantity(qty);
    return generateMockUsers(quantity);
  }

  async seedUsers(qty, session) {
    const quantity = this.validateQuantity(qty);

    if (quantity < 2) {
      throw new AppError(
        "Se necesitan al menos dos usuarios para generar el seed",
        400,
      );
    }

    const mockUsers = this.getUsers(quantity);

    const users = await Promise.all(
      mockUsers.map(async (user, index) => ({
        ...user,
        role: index % 2 === 0 ? USER_ROLES.CUSTOMER : USER_ROLES.DRIVER,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    return userRepository.insertMany(users, session);
  }

  async seedOrders(users, session) {
    const customers = users.filter((user) => user.role === USER_ROLES.CUSTOMER);

    const orders = generateMockOrders(customers);

    return orderRepository.insertMany(orders, session);
  }

  async seedDeliveries(orders, users, session) {
    const drivers = users.filter((user) => user.role === USER_ROLES.DRIVER);

    const deliveryData = generateMockDeliveries(orders, drivers);
    const deliveries = await deliveryRepository.insertMany(
      deliveryData,
      session,
    );

    await Promise.all(
      deliveries.map((delivery) =>
        orderRepository.updateDelivery(delivery.order, delivery._id, session),
      ),
    );

    return deliveries;
  }

  async seed(qty) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const users = await this.seedUsers(qty, session);
      const orders = await this.seedOrders(users, session);
      const deliveries = await this.seedDeliveries(orders, users, session);

      await session.commitTransaction();

      return {
        users: users.length,
        orders: orders.length,
        deliveries: deliveries.length,
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

export default new MocksService();
