const ERROR_DICTIONARY = Object.freeze({
  USER_NOT_FOUND: {
    statusCode: 404,
    message: "Usuario no encontrado",
  },
  ORDER_NOT_FOUND: {
    statusCode: 404,
    message: "Pedido no encontrado",
  },
  PRODUCT_NOT_FOUND: {
    statusCode: 404,
    message: "Producto no encontrado",
  },
  DELIVERY_NOT_FOUND: {
    statusCode: 404,
    message: "Entrega no encontrada",
  },
  INVALID_STATUS: {
    statusCode: 400,
    message: "El estado proporcionado no es válido",
  },
  INVALID_MOCK_QUANTITY: {
    statusCode: 400,
    message: "La cantidad debe ser un número entero entre 1 y 50",
  },
  MOCK_SEED_MINIMUM: {
    statusCode: 400,
    message: "Se necesitan al menos dos usuarios para generar el seed",
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    message: "Los datos proporcionados no son válidos",
  },
  DUPLICATE_KEY: {
    statusCode: 409,
    message: "El recurso ya existe",
  },
  ROUTE_NOT_FOUND: {
    statusCode: 404,
    message: "Ruta no encontrada",
  },
  USER_REQUIRED_FIELDS: {
    statusCode: 400,
    message: "Todos los campos obligatorios deben completarse",
  },
  USER_CREATION_FORBIDDEN: {
    statusCode: 403,
    message: "No se permite crear usuarios administradores",
  },
  EMAIL_ALREADY_REGISTERED: {
    statusCode: 409,
    message: "El email ya está registrado",
  },
  PRODUCT_INVALID_PRICE: {
    statusCode: 400,
    message: "El precio debe ser un número válido",
  },
  PRODUCT_INVALID_STOCK: {
    statusCode: 400,
    message: "El stock debe ser un entero no negativo",
  },
  ORDER_CUSTOMER_REQUIRED: {
    statusCode: 400,
    message: "El cliente es obligatorio",
  },
  ORDER_CUSTOMER_NOT_FOUND: {
    statusCode: 404,
    message: "Cliente no encontrado",
  },
  ORDER_CUSTOMER_FORBIDDEN: {
    statusCode: 403,
    message: "Solo los clientes pueden realizar pedidos",
  },
  DELIVERY_ORDER_REQUIRED: {
    statusCode: 400,
    message: "El pedido es obligatorio",
  },
  DELIVERY_ORDER_ALREADY_ASSIGNED: {
    statusCode: 409,
    message: "El pedido ya tiene una entrega asignada",
  },
  DELIVERY_DRIVER_NOT_FOUND: {
    statusCode: 404,
    message: "Repartidor no encontrado",
  },
  DELIVERY_DRIVER_INVALID_ROLE: {
    statusCode: 400,
    message: "El usuario asignado no tiene el rol de repartidor",
  },
  FILE_REQUIRED: {
    statusCode: 400,
    message: "El archivo es obligatorio",
  },
  FILE_INVALID_TYPE: {
    statusCode: 400,
    message: "El tipo de archivo no está permitido",
  },
  FILE_TOO_LARGE: {
    statusCode: 413,
    message: "El archivo supera el tamaño máximo permitido",
  },
  FILE_UNEXPECTED_FIELD: {
    statusCode: 400,
    message: "El campo de archivo no es válido",
  },
  INVALID_DOCUMENT_TYPE: {
    statusCode: 400,
    message: "El tipo de documento no es válido",
  },
  FILE_STORAGE_ERROR: {
    statusCode: 500,
    message: "No se pudo almacenar el archivo",
  },
  PAYLOAD_TOO_LARGE: {
    statusCode: 413,
    message: "El cuerpo de la solicitud supera el tamaño máximo permitido",
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: "Error interno del servidor",
  },
});

export default ERROR_DICTIONARY;
