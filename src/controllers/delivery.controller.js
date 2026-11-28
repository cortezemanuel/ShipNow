import deliveryService from "../services/delivery.service.js";

class DeliveryController {
  async findAll(req, res, next) {
    try {
      const result = await deliveryService.findAll(req.query);

      res.json({
        status: "success",
        payload: result.deliveries,
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

  async updateStatus(req, res, next) {
    try {
      const delivery = await deliveryService.updateStatus(
        req.params.id,
        req.body.status,
      );

      res.json({
        status: "success",
        message: "Estado de entrega actualizado correctamente",
        payload: delivery,
      });
    } catch (error) {
      next(error);
    }
  }
  async addReceipt(req, res, next) {
    try {
      const delivery = await deliveryService.addReceipt(
        req.params.id,
        req.file,
      );

      res.status(201).json({
        status: "success",
        message: "Comprobante cargado correctamente",
        payload: delivery,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeliveryController();
