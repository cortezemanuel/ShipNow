import orderService from "../services/order.service.js";

class OrderController {
  async findAll(req, res, next) {
    try {
      const orders = await orderService.findAll();
      res.json({ status: "success", payload: orders });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const order = await orderService.findById(req.params.id);
      res.json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const newOrder = await orderService.create(req.body);
      res.status(201).json({ status: "success", payload: newOrder });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
