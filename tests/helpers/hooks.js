import { connectTestDB, disconnectTestDB } from "./database.js";

export const mochaHooks = {
  beforeAll: async function () {
    this.timeout(15000);
    await connectTestDB();
  },

  afterAll: async function () {
    await disconnectTestDB();
  },
};
