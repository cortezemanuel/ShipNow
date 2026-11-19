import { faker } from "@faker-js/faker";
import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

const generateMockOrderItem = () => ({
  name: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 5 }),
  price: faker.number.int({ min: 500, max: 50000 }),
});

export const generateMockOrder = (customer) => {
  if (!customer?._id) {
    throw new Error("El pedido necesita un cliente válido");
  }

  const items = Array.from(
    { length: faker.number.int({ min: 1, max: 4 }) },
    generateMockOrderItem,
  );

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  );

  const shippingCost = faker.number.int({ min: 500, max: 5000 });

  return {
    customer: customer._id,
    items,
    deliveryAddress: faker.location.streetAddress(),
    total,
    shippingCost,
    declaredValue: total,
    status: ORDER_STATUS.CREATED,
    priority: faker.helpers.arrayElement(Object.values(DELIVERY_PRIORITY)),
    delivery: null,
  };
};

export const generateMockOrders = (customers) => {
  return customers.map(generateMockOrder);
};
