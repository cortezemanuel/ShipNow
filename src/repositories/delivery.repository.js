import Delivery from "../models/delivery.model.js";

class DeliveryRepository {
  async findAll() {
    return Delivery.find().populate("order").populate("driver", "-password");
  }

  async findById(deliveryId) {
    return Delivery.findById(deliveryId)
      .populate("order")
      .populate("driver", "-password");
  }

  async create(deliveryData) {
    return Delivery.create(deliveryData);
  }

  async insertMany(deliveries, session = null) {
    return Delivery.insertMany(deliveries, session ? { session } : {});
  }

  async deleteAll() {
    return Delivery.deleteMany({});
  }
}

export default new DeliveryRepository();
