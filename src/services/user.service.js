import bcrypt from "bcrypt";
import { unlink } from "fs/promises";
import userRepository from "../repositories/user.repository.js";
import AppError from "../utils/errors.js";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";
import logger from "../utils/logger.js";

class UserService {
  async findAll() {
    return userRepository.findAll();
  }

  async findById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError("USER_NOT_FOUND");
    }

    return user;
  }

  async create(userData) {
    const { firstName, lastName, email, password, role } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError("USER_REQUIRED_FIELDS");
    }

    if (role === USER_ROLES.ADMIN) {
      throw new AppError("USER_CREATION_FORBIDDEN");
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("EMAIL_ALREADY_REGISTERED");
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

  async addDocument(userId, file, documentType) {
    if (!file) {
      throw new AppError("FILE_REQUIRED");
    }

    try {
      const allowedTypes = [
        DOCUMENT_TYPES.USER_DOCUMENT,
        DOCUMENT_TYPES.DRIVER_LICENSE,
      ];

      if (!allowedTypes.includes(documentType)) {
        logger.warning("Intento de carga con tipo de documento no permitido", {
          userId,
          documentType,
        });

        throw new AppError("INVALID_DOCUMENT_TYPE");
      }

      await this.findById(userId);

      const documentPath = `uploads/user-documents/${file.filename}`;

      const documentData = {
        name: documentType,
        reference: documentPath,
        originalName: file.originalname,
        fileName: file.filename,
        path: documentPath,
        mimeType: file.mimetype,
        size: file.size,
        documentType,
        uploadedAt: new Date(),
      };

      const updatedUser = await userRepository.addDocument(
        userId,
        documentData,
      );
      if (!updatedUser) {
        throw new AppError("USER_NOT_FOUND");
      }

      logger.info("Documento de usuario cargado correctamente", {
        userId,
        documentType,
        fileName: file.filename,
      });

      return updatedUser;
    } catch (error) {
      logger.error("Error al cargar documento de usuario", {
        userId,
        documentType,
        fileName: file.filename,
        error: error.message,
      });

      await unlink(file.path).catch(() => {});
      throw error;
    }
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
        throw new AppError("EMAIL_ALREADY_REGISTERED");
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
