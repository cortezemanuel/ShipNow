import User from "../src/models/user.model.js";
import { expect } from "chai";
import userRepository from "../src/repositories/user.repository.js";

const userData = {
  firstName: "Jose",
  lastName: "Perez",
  email: "jose_perez_test@shipnow.com",
  password: "123456",
};

let userId;

describe("Testing Repository de Users", () => {
  before(async () => {
    await User.deleteOne({ email: userData.email });
  });

  after(async () => {
    if (userId) {
      await userRepository.delete(userId);
    }
  });

  it("Crear un usuario completo", async () => {
    const userCreated = await userRepository.create(userData);

    userId = userCreated._id;

    expect(userCreated).to.have.property("_id");
    expect(userCreated).to.have.property("firstName", "Jose");
    expect(userCreated).to.have.property("lastName", "Perez");
    expect(userCreated).to.have.property("email", userData.email);
  });

  it("Buscar usuario por ID", async () => {
    const userFound = await userRepository.findById(userId);

    expect(String(userFound._id)).to.equal(String(userId));
    expect(userFound).to.have.property("firstName", "Jose");
    expect(userFound).to.have.property("lastName", "Perez");
  });

  it("Buscar usuario por email", async () => {
    const userFound = await userRepository.findByEmail(userData.email);

    expect(String(userFound._id)).to.equal(String(userId));
    expect(userFound).to.have.property("email", userData.email);
  });

  it("Buscar todos los usuarios", async () => {
    const result = await userRepository.findAll({
      page: 1,
      limit: 100,
      search: "",
      role: "",
    });

    expect(result.users).to.be.an("array");
    expect(result.total).to.be.a("number");
    expect(
      result.users.some((user) => String(user._id) === String(userId)),
    ).to.equal(true);
  });

  it("Actualizar un usuario", async () => {
    const userUpdated = await userRepository.update(userId, {
      firstName: "Jose Luis",
    });

    expect(String(userUpdated._id)).to.equal(String(userId));
    expect(userUpdated).to.have.property("firstName", "Jose Luis");
    expect(userUpdated).to.have.property("lastName", "Perez");
  });

  it("Eliminar un usuario", async () => {
    const userDeleted = await userRepository.delete(userId);

    expect(String(userDeleted._id)).to.equal(String(userId));

    const userFound = await userRepository.findById(userId);

    expect(userFound).to.be.null;
    userId = null;
  });
});
