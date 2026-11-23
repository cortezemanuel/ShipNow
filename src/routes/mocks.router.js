import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Generar usuarios ficticios
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de usuarios a generar. Valor predeterminado 10, mínimo 1 y máximo 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Usuarios ficticios generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/users", mocksController.getUsers);

/**
 * @swagger
 * /api/mocks/orders:
 *   get:
 *     summary: Generar pedidos ficticios
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de pedidos a generar. Valor predeterminado 10, mínimo 1 y máximo 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Pedidos ficticios generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/orders", mocksController.getOrders);

/**
 * @swagger
 * /api/mocks/deliveries:
 *   get:
 *     summary: Generar entregas ficticias
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de entregas a generar. Valor predeterminado 10, mínimo 1 y máximo 50.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *     responses:
 *       200:
 *         description: Entregas ficticias generadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total:
 *                   type: integer
 *                   example: 10
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/deliveries", mocksController.getDeliveries);

/**
 * @swagger
 * /api/mocks/seed:
 *   post:
 *     summary: Generar y guardar datos de prueba
 *     description: Genera usuarios, pedidos y entregas y los persiste en MongoDB mediante una transacción.
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: false
 *         description: Cantidad de usuarios a generar. Se necesitan al menos dos. Máximo 50.
 *         schema:
 *           type: integer
 *           minimum: 2
 *           maximum: 50
 *           default: 10
 *     responses:
 *       201:
 *         description: Datos de prueba generados correctamente
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
 *                   example: Datos de prueba generados correctamente
 *                 payload:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: integer
 *                       example: 10
 *                     orders:
 *                       type: integer
 *                       example: 5
 *                     deliveries:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Cantidad inválida o insuficiente para generar el seed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno durante la generación de datos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/seed", mocksController.seed);

export default router;
