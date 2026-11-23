import { Router } from "express";
import deliveryController from "../controllers/delivery.controller.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryCreateRequest:
 *       type: object
 *       required:
 *         - order
 *       properties:
 *         order:
 *           type: string
 *           description: ID del pedido asociado
 *           example: 6aff52a493d2b704aee218d0
 *         driver:
 *           type: string
 *           nullable: true
 *           description: ID de un usuario con rol driver
 *           example: 6aff52a493d2b704aee218d1
 *         status:
 *           type: string
 *           enum: [pending, assigned, in_transit, delivered]
 *           example: pending
 *         priority:
 *           type: string
 *           enum: [low, normal, high]
 *           example: normal
 */

const router = Router();

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtener todas las entregas
 *     description: Devuelve las entregas con sus referencias de pedido y repartidor.
 *     tags: [Deliveries]
 *     responses:
 *       200:
 *         description: Lista de entregas obtenida correctamente
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
 *                     $ref: '#/components/schemas/Delivery'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", deliveryController.findAll);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Obtener una entrega por ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador de la entrega
 *     responses:
 *       200:
 *         description: Entrega obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega no encontrada
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
router.get("/:id", deliveryController.findById);

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Crear una entrega
 *     description: Crea una entrega para un pedido existente que todavía no tenga otra entrega asignada. El repartidor es opcional.
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryCreateRequest'
 *     responses:
 *       201:
 *         description: Entrega creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Delivery'
 *       400:
 *         description: Pedido obligatorio o rol de repartidor inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido o repartidor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: El pedido ya tiene una entrega asignada
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
router.post("/", deliveryController.create);

export default router;
