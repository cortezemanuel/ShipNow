import orderService from "../services/order.service.js";

class OrderController {
  async findAll(req, res, next) {
    try {
      const result = await orderService.findAll(req.query);

      res.json({
        status: "success",
        payload: result.orders,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
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
