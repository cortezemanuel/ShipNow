import swaggerJSDoc from "swagger-jsdoc";

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
        url: "http://localhost:3000",
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
                    example: "DNI",
                  },
                  reference: {
                    type: "string",
                    example: "documento.pdf",
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
