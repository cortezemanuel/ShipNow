import { faker } from "@faker-js/faker";
import { USER_ROLES, MOCKING_PARAMETERS } from "../constants/index.js";

const MOCKABLE_ROLES = [
  USER_ROLES.CUSTOMER,
  USER_ROLES.DRIVER,
  USER_ROLES.STORE,
];

const generateMockUser = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const generatedEmail = faker.internet
    .email({ firstName, lastName })
    .toLowerCase();

  const [emailName, emailDomain] = generatedEmail.split("@");

  return {
    firstName,
    lastName,
    email: `${emailName}.${faker.string.alphanumeric(8).toLowerCase()}@${emailDomain}`,
    password: MOCKING_PARAMETERS.DEFAULT_PASSWORD,
    role: faker.helpers.arrayElement(MOCKABLE_ROLES),
  };
};

export const generateMockUsers = (quantity = MOCKING_PARAMETERS.DEFAULT) => {
  return Array.from({ length: quantity }, () => generateMockUser());
};

export { generateMockUser };
