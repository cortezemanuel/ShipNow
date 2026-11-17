import User from "../models/user.model.js";

class UserRepository {
  async findAll() {
    return User.find().select("-password");
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

  async insertMany(users) {
    return User.insertMany(users);
  }
}

export default new UserRepository();
