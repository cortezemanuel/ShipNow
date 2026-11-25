import swaggerJSDoc from "swagger-jsdoc";
import config from "./env.config.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API REST para la gestión de usuarios, productos, pedidos y entregas de ShipNow.",
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Servidor local de desarrollo",
      },
    ],
    tags: [
      { name: "Users", description: "Gestión de usuarios" },
      { name: "Products", description: "Gestión de productos" },
      { name: "Orders", description: "Gestión de pedidos" },
      { name: "Deliveries", description: "Gestión de entregas" },
      { name: "Mocks", description: "Generación de datos de prueba" },
      { name: "Logger", description: "Pruebas del sistema de logs" },
    ],

    paths: {
      "/api/users/{id}/documents": {
        post: {
          tags: ["Users"],
          summary: "Cargar documentación de un usuario",
          description:
            "Permite cargar un documento o licencia asociado a un usuario.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID del usuario",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["document", "documentType"],
                  properties: {
                    document: {
                      type: "string",
                      format: "binary",
                      description: "Archivo PDF, JPG o PNG. Máximo 5 MB.",
                    },
                    documentType: {
                      type: "string",
                      enum: ["user_document", "driver_license"],
                      example: "user_document",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Documento cargado correctamente",
            },
            400: {
              description:
                "Archivo obligatorio, formato o tipo de documento inválido",
            },
            404: {
              description: "Usuario no encontrado",
            },
            413: {
              description: "El archivo supera el tamaño máximo permitido",
            },
            500: {
              description: "Error al almacenar el archivo",
            },
          },
        },
      },
      "/api/deliveries/{id}/receipts": {
        post: {
          tags: ["Deliveries"],
          summary: "Cargar comprobante de entrega",
          description:
            "Permite asociar un comprobante PDF, JPG o PNG a una entrega.",
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID de la entrega",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["receipt"],
                  properties: {
                    receipt: {
                      type: "string",
                      format: "binary",
                      description: "Comprobante PDF, JPG o PNG. Máximo 5 MB.",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Comprobante cargado correctamente",
            },
            400: {
              description: "Archivo obligatorio o formato inválido",
            },
            404: {
              description: "Entrega no encontrada",
            },
            413: {
              description: "El archivo supera el tamaño máximo permitido",
            },
            500: {
              description: "Error al almacenar el archivo",
            },
          },
        },
      },
    },

    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6aff52a493d2b704aee218d0",
            },
            firstName: {
              type: "string",
              example: "Juan",
            },
            lastName: {
              type: "string",
              example: "Pérez",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@email.com",
            },
            role: {
              type: "string",
              enum: ["admin", "user", "customer", "driver", "store"],
              example: "customer",
            },

            documents: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    example: "user_document",
                  },
                  reference: {
                    type: "string",
                    example: "uploads/user-documents/documento.pdf",
                  },
                  originalName: {
                    type: "string",
                    example: "documento.pdf",
                  },
                  fileName: {
                    type: "string",
                    example: "1795566029380-519249307.pdf",
                  },
                  path: {
                    type: "string",
                    example: "uploads/user-documents/documento.pdf",
                  },
                  mimeType: {
                    type: "string",
                    example: "application/pdf",
                  },
                  size: {
                    type: "number",
                    example: 175852,
                  },
                  documentType: {
                    type: "string",
                    enum: ["user_document", "driver_license"],
                    example: "user_document",
                  },
                  uploadedAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },

            receipts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  originalName: {
                    type: "string",
                    example: "comprobante.pdf",
                  },
                  fileName: {
                    type: "string",
                    example: "1795566029380-519249307.pdf",
                  },
                  path: {
                    type: "string",
                    example: "uploads/delivery-receipts/comprobante.pdf",
                  },
                  mimeType: {
                    type: "string",
                    example: "application/pdf",
                  },
                  size: {
                    type: "number",
                    example: 175852,
                  },
                  documentType: {
                    type: "string",
                    enum: ["delivery_proof"],
                    example: "delivery_proof",
                  },
                  uploadedAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
            },

            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        UserCreateRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              example: "Juan",
            },
            lastName: {
              type: "string",
              example: "Pérez",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@email.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "Password123",
            },
            role: {
              type: "string",
              enum: ["user", "customer", "driver", "store"],
              example: "customer",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6afba6c9e33e90b5fa2509c4",
            },
            name: {
              type: "string",
              example: "Café Colombia",
            },
            description: {
              type: "string",
              example: "Café de especialidad",
            },
            price: {
              type: "number",
              minimum: 0,
              example: 12000,
            },
            stock: {
              type: "integer",
              minimum: 0,
              example: 15,
            },
            status: {
              type: "string",
              enum: ["available", "out_of_stock"],
              example: "available",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        OrderItem: {
          type: "object",
          required: ["name", "quantity", "price"],
          properties: {
            name: {
              type: "string",
              example: "Café Colombia",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              example: 2,
            },
            price: {
              type: "number",
              minimum: 0,
              example: 12000,
            },
          },
        },
        Order: {
          type: "object",
          required: ["customer", "items", "deliveryAddress"],
          properties: {
            _id: {
              type: "string",
              example: "6aff52a493d2b704aee218d0",
            },
            customer: {
              oneOf: [
                {
                  type: "string",
                  example: "6aff52a493d2b704aee218d0",
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },
            items: {
              type: "array",
              minItems: 1,
              items: {
                $ref: "#/components/schemas/OrderItem",
              },
            },
            deliveryAddress: {
              type: "string",
              example: "Av. Colón 123, Córdoba",
            },
            total: {
              type: "number",
              minimum: 0,
              example: 24000,
            },
            shippingCost: {
              type: "number",
              minimum: 0,
              example: 1500,
            },
            declaredValue: {
              type: "number",
              minimum: 0,
              example: 24000,
            },
            status: {
              type: "string",
              enum: [
                "created",
                "assigned",
                "picked_up",
                "in_transit",
                "delivered",
                "cancelled",
              ],
              example: "created",
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high"],
              example: "normal",
            },
            delivery: {
              oneOf: [
                {
                  type: "string",
                  nullable: true,
                },
                {
                  $ref: "#/components/schemas/Delivery",
                },
              ],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Delivery: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "6aff52a493d2b704aee218d2",
            },
            order: {
              oneOf: [
                {
                  type: "string",
                },
                {
                  $ref: "#/components/schemas/Order",
                },
              ],
            },
            driver: {
              oneOf: [
                {
                  type: "string",
                  nullable: true,
                },
                {
                  $ref: "#/components/schemas/User",
                },
              ],
            },
            status: {
              type: "string",
              enum: ["pending", "assigned", "in_transit", "delivered"],
              example: "pending",
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high"],
              example: "normal",
            },
            assignedAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            deliveredAt: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          required: ["status", "message", "code"],
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Usuario no encontrado",
            },
            code: {
              type: "string",
              example: "USER_NOT_FOUND",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "Operación realizada correctamente",
            },
            total: {
              type: "integer",
              example: 10,
            },
            payload: {
              oneOf: [
                {
                  type: "object",
                },
                {
                  type: "array",
                  items: {
                    type: "object",
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
