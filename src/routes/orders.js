import { Router } from "express";
import orderController from "../controllers/order.controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderCreateRequest:
 *       type: object
 *       required:
 *         - customer
 *         - items
 *         - deliveryAddress
 *       properties:
 *         customer:
 *           type: string
 *           description: ID de un usuario con rol customer
 *           example: 6aff52a493d2b704aee218d0
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         deliveryAddress:
 *           type: string
 *           example: Av. Colón 123, Córdoba
 *         total:
 *           type: number
 *           minimum: 0
 *           example: 24000
 *         shippingCost:
 *           type: number
 *           minimum: 0
 *           example: 1500
 *         declaredValue:
 *           type: number
 *           minimum: 0
 *           example: 24000
 *         priority:
 *           type: string
 *           enum: [low, normal, high]
 *           example: normal
 */

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Devuelve los pedidos con sus referencias de cliente y entrega.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de pedidos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", orderController.findAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador del pedido
 *     responses:
 *       200:
 *         description: Pedido obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido no encontrado
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
router.get("/:id", orderController.findById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear un pedido
 *     description: Crea un pedido asociado a un usuario existente con rol customer.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       201:
 *         description: Pedido creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cliente obligatorio o datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: El usuario no tiene rol de cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cliente no encontrado
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
router.post("/", orderController.create);

export default router;
