import deliveryService from "../services/delivery.service.js";

class DeliveryController {
  async findAll(req, res, next) {
    try {
      const deliveries = await deliveryService.findAll();
      res.json({ status: "success", payload: deliveries });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const delivery = await deliveryService.findById(req.params.id);
      res.json({ status: "success", payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const newDelivery = await deliveryService.create(req.body);
      res.status(201).json({ status: "success", payload: newDelivery });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveryController();
