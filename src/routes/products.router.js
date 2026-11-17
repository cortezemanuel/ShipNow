import { Router } from "express";
import productsController from "../controllers/products.controller.js";

const router = Router();

router.get("/", productsController.findAll);
router.get("/:id", productsController.findById);
router.post("/", productsController.create);
router.put("/:id", productsController.update);
router.delete("/:id", productsController.delete);

export default router;
