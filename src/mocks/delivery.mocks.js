import { faker } from "@faker-js/faker";
import { DELIVERY_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

export const generateMockDelivery = (order, driver = null) => {
  if (!order?._id) {
    throw new Error("La entrega necesita un pedido válido");
  }

  const isAssigned = Boolean(driver?._id);

  return {
    order: order._id,
    driver: isAssigned ? driver._id : null,
    status: isAssigned ? DELIVERY_STATUS.ASSIGNED : DELIVERY_STATUS.PENDING,
    priority: order.priority || DELIVERY_PRIORITY.NORMAL,
    assignedAt: isAssigned ? faker.date.recent() : null,
    deliveredAt: null,
  };
};

export const generateMockDeliveries = (orders, drivers = []) => {
  return orders.map((order) => {
    const availableDrivers = drivers.filter((driver) => driver?._id);

    const driver = availableDrivers.length
      ? faker.helpers.arrayElement(availableDrivers)
      : null;

    return generateMockDelivery(order, driver);
  });
};
