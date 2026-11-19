import mocksService from "../services/mocks.service.js";

class MocksController {
  async getUsers(req, res, next) {
    try {
      const users = mocksService.getUsers(req.query.qty);

      res.json({
        status: "success",
        total: users.length,
        payload: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async seed(req, res, next) {
    try {
      const result = await mocksService.seed(req.query.qty);

      res.status(201).json({
        status: "success",
        message: "Datos de prueba generados correctamente",
        payload: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MocksController();
