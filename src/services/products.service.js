import productsRepo from "../repositories/product.repository.js";
import AppError from "../utils/errors.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsService {
  async findAll({ page = 1, limit = 10 } = {}) {
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new AppError(
        "VALIDATION_ERROR",
        "La página debe ser un entero mayor a cero",
      );
    }

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit < 1 ||
      parsedLimit > 100
    ) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El límite debe ser un entero entre 1 y 100",
      );
    }

    const { products, total } = await productsRepo.findAll({
      page: parsedPage,
      limit: parsedLimit,
    });

    return {
      products,
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    };
  }

  async findById(id) {
    const product = await productsRepo.findById(id);

    if (!product) {
      throw new AppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async create(productData) {
    const stock = Number(productData.stock);
    const price = Number(productData.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new AppError("PRODUCT_INVALID_PRICE");
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw new AppError("PRODUCT_INVALID_STOCK");
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
        throw new AppError("PRODUCT_INVALID_STOCK");
      }

      updatedData.stock = stock;
      updatedData.status =
        stock > 0 ? PRODUCT_STATUS.AVAILABLE : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    if (updatedData.price !== undefined) {
      const price = Number(updatedData.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new AppError("PRODUCT_INVALID_PRICE");
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
