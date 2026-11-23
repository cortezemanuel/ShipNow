import { Router } from "express";
import { testLogger } from "../controllers/logger.controller.js";

const router = Router();

/**
 * @swagger
 * /api/logger/test:
 *   get:
 *     summary: Probar los niveles del logger
 *     description: Genera registros de prueba en los niveles debug, http, info, warning, error y fatal mediante Winston.
 *     tags: [Logger]
 *     responses:
 *       200:
 *         description: Registros de prueba generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Se generaron registros de prueba en todos los niveles
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/test", testLogger);

export default router;
