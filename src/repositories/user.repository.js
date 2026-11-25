import User from "../models/user.model.js";

class UserRepository {
  async findAll({ page, limit, search, role }) {
    const filters = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");

      filters.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    if (role) {
      filters.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filters)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filters),
    ]);

    return { users, total };
  }

  async findById(id) {
    return User.findById(id).select("-password");
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, userData) {
    return User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async delete(id) {
    return User.findByIdAndDelete(id).select("-password");
  }

  async addDocument(userId, documentData) {
    return User.findByIdAndUpdate(
      userId,
      { $push: { documents: documentData } },
      { new: true, runValidators: true },
    ).select("-password");
  }

  async insertMany(users, session = null) {
    return User.insertMany(users, session ? { session } : {});
  }
}

export default new UserRepository();
