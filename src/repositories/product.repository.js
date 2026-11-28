import Product from "../models/product.model.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductsRepository {
  async findAll({ page = 1, limit = 10 } = {}) {
    const filters = {
      isDeleted: false,
    };

    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filters),
    ]);

    return { products, total };
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
