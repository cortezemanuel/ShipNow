import Delivery from "../models/delivery.model.js";

class DeliveryRepository {
  async findAll({
    page = 1,
    limit = 10,
    status = "",
    priority = "",
    driver = "",
  } = {}) {
    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (priority) {
      filters.priority = priority;
    }

    if (driver) {
      filters.driver = driver;
    }

    const [deliveries, total] = await Promise.all([
      Delivery.find(filters)
        .populate("order")
        .populate("driver", "-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Delivery.countDocuments(filters),
    ]);

    return { deliveries, total };
  }

  async findById(deliveryId) {
    return Delivery.findById(deliveryId)
      .populate("order")
      .populate("driver", "-password");
  }

  async create(deliveryData) {
    return Delivery.create(deliveryData);
  }

  async addReceipt(deliveryId, receiptData) {
    return Delivery.findByIdAndUpdate(
      deliveryId,
      { $push: { receipts: receiptData } },
      { new: true, runValidators: true },
    )
      .populate("order")
      .populate("driver", "-password");
  }

  async updateStatus(deliveryId, status, trackingEntry, dates = {}) {
    return Delivery.findByIdAndUpdate(
      deliveryId,
      {
        $set: {
          status,
          ...dates,
        },
        $push: {
          tracking: trackingEntry,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("order")
      .populate("driver", "-password");
  }

  async insertMany(deliveries, session = null) {
    return Delivery.insertMany(deliveries, session ? { session } : {});
  }

  async deleteAll() {
    return Delivery.deleteMany({});
  }
}

export default new DeliveryRepository();
