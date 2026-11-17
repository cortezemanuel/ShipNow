import bcrypt from "bcrypt";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";

class UserService {
  async findAll() {
    return userRepository.findAll();
  }

  async findById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return user;
  }

  async create(userData) {
    const { firstName, lastName, email, password, role } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError(
        "Todos los campos obligatorios deben completarse",
        400,
      );
    }

    if (role === USER_ROLES.ADMIN) {
      throw new AppError("No se permite crear usuarios administradores", 403);
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("El email ya está registrado", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || USER_ROLES.USER,
    });

    const { password: _, ...safeUser } = newUser.toObject();

    return safeUser;
  }

  async update(id, userData) {
    await this.findById(id);

    const updatedData = { ...userData };

    delete updatedData.role;
    delete updatedData.documents;

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    if (updatedData.email) {
      const existingUser = await userRepository.findByEmail(updatedData.email);

      if (existingUser && existingUser._id.toString() !== id) {
        throw new AppError("El email ya está registrado", 409);
      }
    }

    const updatedUser = await userRepository.update(id, updatedData);

    return updatedUser;
  }

  async delete(id) {
    await this.findById(id);
    return userRepository.delete(id);
  }
}

export default new UserService();
