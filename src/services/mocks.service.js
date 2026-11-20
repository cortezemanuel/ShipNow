import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { generateMockUsers } from "../mocks/user.mocks.js";
import { generateMockOrders } from "../mocks/order.mocks.js";
import { generateMockDeliveries } from "../mocks/delivery.mocks.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import deliveryRepository from "../repositories/delivery.repository.js";
import AppError from "../utils/errors.js";
import {
  MOCKING_PARAMETERS,
  USER_ROLES,
  ORDER_STATUS,
} from "../constants/index.js";

class MocksService {
  validateQuantity(qty) {
    const quantity = Number(qty ?? MOCKING_PARAMETERS.DEFAULT);

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MOCKING_PARAMETERS.MAX
    ) {
      throw new AppError("INVALID_MOCK_QUANTITY");
    }

    return quantity;
  }

  getUsers(qty) {
    const quantity = this.validateQuantity(qty);
    return generateMockUsers(quantity);
  }

  getOrders(qty) {
    const quantity = this.validateQuantity(qty);

    const customers = generateMockUsers(quantity).map((user) => ({
      ...user,
      _id: new mongoose.Types.ObjectId(),
      role: USER_ROLES.CUSTOMER,
    }));

    return generateMockOrders(customers);
  }

  getDeliveries(qty) {
    const quantity = this.validateQuantity(qty);

    const customers = generateMockUsers(quantity).map((user) => ({
      ...user,
      _id: new mongoose.Types.ObjectId(),
      role: USER_ROLES.CUSTOMER,
    }));

    const drivers = generateMockUsers(quantity).map((user) => ({
      ...user,
      _id: new mongoose.Types.ObjectId(),
      role: USER_ROLES.DRIVER,
    }));

    const orders = generateMockOrders(customers).map((order) => ({
      ...order,
      _id: new mongoose.Types.ObjectId(),
    }));

    return generateMockDeliveries(orders, drivers);
  }

  async seedUsers(qty, session) {
    const quantity = this.validateQuantity(qty);

    if (quantity < 2) {
      throw new AppError("MOCK_SEED_MINIMUM");
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
        orderRepository.updateDelivery(
          delivery.order,
          delivery._id,
          delivery.driver ? ORDER_STATUS.ASSIGNED : ORDER_STATUS.CREATED,
          session,
        ),
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
      try {
        if (session.inTransaction()) {
          await session.abortTransaction();
        }
      } catch {
        // Conservamos el error original si también falla el rollback.
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("INTERNAL_SERVER_ERROR");
    } finally {
      await session.endSession();
    }
  }
}

export default new MocksService();
