import productsRepo from "../repositories/product.repository.js";
import AppError from "../utils/errors.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsService {
  async findAll() {
    return productsRepo.findAll();
  }

  async findById(id) {
    const product = await productsRepo.findById(id);

    if (!product) {
      throw new AppError("Producto no encontrado", 404);
    }

    return product;
  }

  async create(productData) {
    const stock = Number(productData.stock);
    const price = Number(productData.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new AppError("El precio debe ser un número válido", 400);
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new AppError("El stock debe ser un entero no negativo", 400);
    }

    return productsRepo.create({
      ...productData,
      price,
      stock,
      status:
        stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK,
    });
  }

  async update(id, productData) {
    await this.findById(id);

    const updatedData = { ...productData };

    if (updatedData.stock !== undefined) {
      const stock = Number(updatedData.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        throw new AppError("El stock debe ser un entero no negativo", 400);
      }

      updatedData.stock = stock;
      updatedData.status =
        stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    if (updatedData.price !== undefined) {
      const price = Number(updatedData.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new AppError("El precio debe ser un número válido", 400);
      }

      updatedData.price = price;
    }

    return productsRepo.update(id, updatedData);
  }

  async delete(id) {
    await this.findById(id);
    return productsRepo.delete(id);
  }
}

export default new ProductsService();
