import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/user.model.js";

const user = {
  firstName: "Jose",
  lastName: "Perez",
  email: "jose_perez_endpoint_test@shipnow.com",
  password: "123456",
};

const user2 = {
  firstName: "Maria",
  lastName: "Gomez",
  email: "maria_gomez_endpoint_test@shipnow.com",
  password: "123456",
};
const newUser = {
  firstName: "Juan",
  lastName: "Lopez",
  email: "juan_lopez_endpoint_test@shipnow.com",
  password: "123456",
};

const newUser2 = {
  firstName: "Laura",
  lastName: "Fernandez",
  email: "laura_fernandez_endpoint_test@shipnow.com",
  password: "123456",
};

const adminEmail = "admin_endpoint_test@shipnow.com";

const invalidId = "123abc";
const nonexistentId = new mongoose.Types.ObjectId().toString();

let userId;
let user2Id;

describe("Testing endpoints de Users", () => {
  beforeEach(async () => {
    await User.deleteMany({
      email: {
        $in: [
          user.email,
          user2.email,
          newUser.email,
          newUser2.email,
          adminEmail,
        ],
      },
    });

    const firstUser = await User.create(user);
    const secondUser = await User.create(user2);

    userId = String(firstUser._id);
    user2Id = String(secondUser._id);
  });

  after(async () => {
    await User.deleteMany({
      email: {
        $in: [
          user.email,
          user2.email,
          newUser.email,
          newUser2.email,
          adminEmail,
        ],
      },
    });
  });

  it("Crear un usuario", async () => {
    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
    expect(response.body.payload).to.have.property("firstName", "Juan");
    expect(response.body.payload).to.have.property("lastName", "Lopez");
    expect(response.body.payload).to.not.have.property("password");
  });

  it("Crear un segundo usuario", async () => {
    const response = await request(app).post("/api/users").send(newUser2);

    expect(response.status).to.equal(201);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id");
  });

  it("Rechazar la creación con campos obligatorios faltantes", async () => {
    const response = await request(app)
      .post("/api/users")
      .send({ firstName: "Pedro", lastName: "Diaz" });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_REQUIRED_FIELDS");
    expect(response.body.message).to.equal(
      "Todos los campos obligatorios deben completarse",
    );
  });

  it("Impedir la creación de administradores", async () => {
    const admin = {
      ...user,
      email: adminEmail,
      role: "admin",
    };

    const response = await request(app).post("/api/users").send(admin);

    expect(response.status).to.equal(403);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_CREATION_FORBIDDEN");
    expect(response.body.message).to.equal(
      "No se permite crear usuarios administradores",
    );

    const adminInDatabase = await User.findOne({ email: admin.email });

    expect(adminInDatabase).to.be.null;
  });

  it("Rechazar emails duplicados", async () => {
    const response = await request(app).post("/api/users").send(user);

    expect(response.status).to.equal(409);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("EMAIL_ALREADY_REGISTERED");
    expect(response.body.message).to.equal("El email ya está registrado");
  });

  it("Listar todos los usuarios", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.be.an("array");

    const ids = response.body.payload.map((item) => String(item._id));

    expect(ids).to.include.members([userId, user2Id]);
  });

  it("Buscar un usuario por ID", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("_id", userId);
    expect(response.body.payload).to.have.property("firstName", "Jose");
    expect(response.body.payload).to.have.property("email", user.email);
    expect(response.body.payload).to.not.have.property("password");
  });

  it("Rechazar un ID inválido", async () => {
    const response = await request(app).get(`/api/users/${invalidId}`);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("VALIDATION_ERROR");
    expect(response.body.message).to.equal(
      "Los datos proporcionados no son válidos",
    );
  });

  it("Rechazar un usuario inexistente", async () => {
    const response = await request(app).get(`/api/users/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });

  it("Actualizar un usuario", async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ lastName: "Gonzalez" });

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.payload).to.have.property("firstName", "Jose");
    expect(response.body.payload).to.have.property("lastName", "Gonzalez");
  });

  it("Rechazar la actualización con un ID inválido", async () => {
    const response = await request(app)
      .put(`/api/users/${invalidId}`)
      .send({ firstName: "Pedro" });

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("VALIDATION_ERROR");
    expect(response.body.message).to.equal(
      "Los datos proporcionados no son válidos",
    );
  });

  it("Rechazar la actualización de un usuario inexistente", async () => {
    const response = await request(app)
      .put(`/api/users/${nonexistentId}`)
      .send({ firstName: "Pedro" });

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });

  it("Eliminar un usuario", async () => {
    const response = await request(app).delete(`/api/users/${user2Id}`);

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal("success");
    expect(response.body.message).to.equal("Usuario eliminado");

    const deletedUser = await User.findById(user2Id);

    expect(deletedUser).to.be.null;
  });

  it("Rechazar la eliminación con un ID inválido", async () => {
    const response = await request(app).delete(`/api/users/${invalidId}`);

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("VALIDATION_ERROR");
    expect(response.body.message).to.equal(
      "Los datos proporcionados no son válidos",
    );
  });

  it("Rechazar la eliminación de un usuario inexistente", async () => {
    const response = await request(app).delete(`/api/users/${nonexistentId}`);

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.code).to.equal("USER_NOT_FOUND");
    expect(response.body.message).to.equal("Usuario no encontrado");
  });
});
