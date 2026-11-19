import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

router.get("/users", mocksController.getUsers);
router.post("/seed", mocksController.seed);

export default router;
