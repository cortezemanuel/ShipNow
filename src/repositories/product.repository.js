import Product from "../models/product.model.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsRepository {
  async findAll(filters = {}) {
    return Product.find({
      ...filters,
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Product.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findAvailable() {
    return Product.find({
      stock: { $gt: 0 },
      status: PRODUCT_STATUS.AVAILABLE,
      isDeleted: false,
    });
  }

  async create(productData) {
    return Product.create(productData);
  }

  async update(id, productData) {
    return Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      productData,
      { new: true, runValidators: true },
    );
  }

  async delete(id) {
    return Product.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true },
    );
  }
}

export default new ProductsRepository();
