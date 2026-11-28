# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para la gestión de usuarios, productos, pedidos y entregas de una plataforma de logística y envíos.

El proyecto utiliza una arquitectura por capas que permite separar responsabilidades, facilitar el mantenimiento y mejorar la escalabilidad de la aplicación.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para la creación de la API REST.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado y gestión de documentos.
- **Bcrypt:** encriptación de contraseñas.
- **Dotenv:** gestión de variables de entorno.
- **Mocha:** framework para pruebas automatizadas.
- **Chai:** biblioteca de aserciones.
- **Supertest:** pruebas de endpoints HTTP.
- **Faker:** generación de datos ficticios.
- **Nodemon:** reinicio automático del servidor durante el desarrollo.
- **Winston:** gestión centralizada de logs.
- **Winston Daily Rotate File:** rotación automática de archivos de logs.
- **Multer:** gestión de carga de archivos.
- **Swagger JSDoc:** generación de documentación OpenAPI.
- **Swagger UI Express:** visualización y prueba de endpoints.
- **Docker:** ejecución de la aplicación mediante contenedores.
- **Docker Compose:** configuración y administración de servicios.

## Arquitectura del proyecto

El proyecto utiliza una arquitectura de tres capas principales:

- **Controller:** recibe las solicitudes HTTP y gestiona las respuestas.
- **Service:** contiene la lógica de negocio y las validaciones.
- **Repository:** centraliza las operaciones de acceso a MongoDB.

Además, se utilizan modelos, middlewares, configuración centralizada, constantes y utilidades compartidas.

### Estructura de carpetas

```text
ShipNow/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── database.config.js
│   │   ├── env.config.js
│   │   ├── multer.config.js
│   │   └── swagger.js
│   │
│   ├── constants/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── delivery.controller.js
│   │   ├── logger.controller.js
│   │   ├── mocks.controller.js
│   │   ├── order.controller.js
│   │   ├── products.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── upload.middleware.js
│   │
│   ├── mocks/
│   │   ├── delivery.mocks.js
│   │   ├── order.mocks.js
│   │   └── user.mocks.js
│   │
│   ├── models/
│   │   ├── delivery.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   │
│   ├── repositories/
│   │   ├── delivery.repository.js
│   │   ├── order.repository.js
│   │   ├── product.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/
│   │   ├── deliveries.js
│   │   ├── logger.router.js
│   │   ├── mocks.router.js
│   │   ├── orders.js
│   │   ├── products.router.js
│   │   └── users.js
│   │
│   ├── services/
│   │   ├── delivery.service.js
│   │   ├── mocks.service.js
│   │   ├── order.service.js
│   │   ├── products.service.js
│   │   └── user.service.js
│   │
│   └── utils/
│       ├── errorDictionary.js
│       ├── errors.js
│       └── logger.js
│
├── tests/
├── uploads/
├── logs/
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── package-lock.json
└── README.md
```

Los archivos de configuración con credenciales, los logs, los archivos subidos y las dependencias instaladas se mantienen fuera del repositorio mediante `.gitignore` y `.dockerignore`.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/cortezemanuel/ShipNow.git
```

### 2. Ingresar al directorio

```bash
cd ShipNow
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
NODE_ENV=development
LOG_LEVEL=debug
```

Descripción de las variables:

| Variable      | Descripción                    |
| ------------- | ------------------------------ |
| `PORT`        | Puerto de ejecución de la API. |
| `MONGODB_URI` | Cadena de conexión a MongoDB.  |
| `NODE_ENV`    | Entorno de ejecución.          |
| `LOG_LEVEL`   | Nivel de logging.              |

Las variables de entorno son validadas al iniciar el servidor. Si falta una variable obligatoria o existe un valor inválido, la aplicación informa el error correspondiente e impide iniciar el servidor.

### 5. Ejecutar el proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor:

```bash
npm start
```

Por defecto, la API estará disponible en:

```text
http://localhost:3000
```

## Endpoints disponibles

### Health Check

Permite verificar que la API se encuentra funcionando correctamente.

| Método | Endpoint      | Descripción                   |
| ------ | ------------- | ----------------------------- |
| GET    | `/api/health` | Verifica el estado de la API. |

### Productos

Base URL: `/api/products`

| Método | Endpoint            | Descripción                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/products`     | Obtiene los productos.      |
| GET    | `/api/products/:id` | Obtiene un producto por ID. |
| POST   | `/api/products`     | Crea un producto.           |
| PUT    | `/api/products/:id` | Actualiza un producto.      |
| DELETE | `/api/products/:id` | Elimina un producto.        |

### Usuarios

Base URL: `/api/users`

| Método | Endpoint                   | Descripción                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | `/api/users`               | Obtiene los usuarios.           |
| GET    | `/api/users/:id`           | Obtiene un usuario por ID.      |
| POST   | `/api/users`               | Crea un usuario.                |
| PUT    | `/api/users/:id`           | Actualiza un usuario.           |
| DELETE | `/api/users/:id`           | Elimina un usuario.             |
| POST   | `/api/users/:id/documents` | Carga documentos de un usuario. |

### Pedidos

Base URL: `/api/orders`

| Método | Endpoint          | Descripción               |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/orders`     | Obtiene los pedidos.      |
| GET    | `/api/orders/:id` | Obtiene un pedido por ID. |
| POST   | `/api/orders`     | Crea un pedido.           |

### Entregas

Base URL: `/api/deliveries`

| Método | Endpoint                       | Descripción                                                   |
| ------ | ------------------------------ | ------------------------------------------------------------- |
| GET    | `/api/deliveries`              | Obtiene las entregas.                                         |
| GET    | `/api/deliveries/:id`          | Obtiene una entrega por ID.                                   |
| POST   | `/api/deliveries`              | Crea una entrega.                                             |
| POST   | `/api/deliveries/:id/receipts` | Carga un comprobante de entrega.                              |
| PATCH  | `/api/deliveries/:id/status`   | Actualiza el estado y registra el seguimiento de una entrega. |

### Seguimiento de entregas

El endpoint `PATCH /api/deliveries/:id/status` permite actualizar el estado de una entrega.

Los estados admitidos para el seguimiento son:

- `assigned`
- `in_transit`
- `delivered`

Cada actualización registra el nuevo estado, una descripción y la fecha y hora del evento en el historial de tracking.

Los cambios de estado también actualizan el estado correspondiente del pedido asociado.

## Paginación y filtros

Los endpoints de productos, usuarios, pedidos y entregas incorporan paginación para optimizar las consultas y evitar recuperar todos los registros en una única solicitud.

### Parámetros disponibles

| Parámetro  | Descripción                                                 |
| ---------- | ----------------------------------------------------------- |
| `page`     | Número de página. Valor predeterminado: 1.                  |
| `limit`    | Cantidad de registros por página. Valor predeterminado: 10. |
| `search`   | Búsqueda de usuarios por nombre, apellido o email.          |
| `role`     | Filtra usuarios por rol.                                    |
| `status`   | Filtra pedidos o entregas por estado.                       |
| `priority` | Filtra pedidos o entregas por prioridad.                    |
| `driver`   | Filtra entregas por identificador del conductor.            |

El límite máximo permitido es de 100 registros por página.

### Ejemplos de consultas

Productos:

```http
GET /api/products?page=1&limit=10
GET /api/products?page=2&limit=5
```

Usuarios:

```http
GET /api/users?page=1&limit=10
GET /api/users?page=1&limit=10&search=Emanuel
GET /api/users?page=1&limit=10&role=driver
```

Pedidos:

```http
GET /api/orders?page=1&limit=10
GET /api/orders?page=1&limit=10&status=assigned&priority=high
```

Entregas:

```http
GET /api/deliveries?page=1&limit=10
GET /api/deliveries?page=1&limit=10&status=pending&priority=normal
```

### Respuesta de paginación

Las respuestas incluyen los registros y los siguientes datos:

- `total`: cantidad total de registros.
- `page`: página actual.
- `limit`: cantidad de registros por página.
- `totalPages`: cantidad total de páginas.

Las consultas utilizan filtros en MongoDB, operaciones `skip()` y `limit()`, y conteo mediante `countDocuments()`.

Cuando corresponde, las consultas de obtención de datos y conteo se ejecutan en paralelo mediante `Promise.all()`.

Los valores inválidos de página o límite generan una respuesta HTTP 400.

## Generación de datos de prueba (Mocking)

El módulo de mocking utiliza Faker para generar información ficticia de usuarios, pedidos y entregas.

Se utilizan tres generadores:

- `user.mocks.js`: genera usuarios con datos ficticios.
- `order.mocks.js`: genera pedidos con productos, cantidades, precios y valores de envío.
- `delivery.mocks.js`: genera entregas asociadas a pedidos y conductores.

Base URL: `/api/mocks`

| Método | Endpoint                | Descripción                                     |
| ------ | ----------------------- | ----------------------------------------------- |
| GET    | `/api/mocks/users`      | Genera usuarios ficticios.                      |
| GET    | `/api/mocks/orders`     | Genera pedidos ficticios.                       |
| GET    | `/api/mocks/deliveries` | Genera entregas ficticias.                      |
| POST   | `/api/mocks/seed`       | Genera e inserta datos relacionados en MongoDB. |

Los endpoints GET reciben el parámetro opcional `qty`, que determina la cantidad de registros a generar.

Ejemplo:

```http
GET /api/mocks/users?qty=5
```

La cantidad debe ser un número entero positivo y no puede superar el máximo de 50 registros.

Los valores inválidos generan una respuesta HTTP 400.

## Seed de datos relacionados

El endpoint:

```http
POST /api/mocks/seed?qty=10
```

Permite insertar datos de prueba relacionados directamente en MongoDB.

El proceso realiza las siguientes operaciones:

1. Genera usuarios ficticios.
2. Asigna roles de customer y driver.
3. Encripta las contraseñas utilizando Bcrypt.
4. Inserta los usuarios en la base de datos.
5. Genera pedidos asociados a los clientes creados.
6. Inserta los pedidos.
7. Genera entregas asociadas a los pedidos y conductores.
8. Inserta las entregas.
9. Actualiza cada pedido con la referencia a su entrega y el estado correspondiente.

### Relaciones entre documentos

- Un pedido pertenece a un usuario con rol `customer`.
- Una entrega pertenece a un pedido.
- Una entrega puede tener asociado un usuario con rol `driver`.
- El pedido almacena la referencia de su entrega correspondiente.

### Estados y prioridades

El proyecto utiliza constantes centralizadas para mantener consistencia en los valores.

Estados de pedidos:

- `created`
- `assigned`
- `picked_up`
- `in_transit`
- `delivered`
- `cancelled`

Estados de entregas:

- `pending`
- `assigned`
- `in_transit`
- `delivered`

Prioridades:

- `low`
- `normal`
- `high`

### Transacciones de MongoDB

El proceso de seed utiliza transacciones de MongoDB para garantizar la consistencia de las operaciones.

Las inserciones y actualizaciones se ejecutan dentro de una misma transacción. Si alguna operación falla, se realiza un rollback mediante `abortTransaction()`, evitando que queden datos parcialmente insertados.

Las transacciones requieren MongoDB Atlas o una instancia de MongoDB configurada como Replica Set. Una instancia standalone no admite estas transacciones.

## Manejo centralizado de errores

El proyecto implementa un sistema centralizado de manejo de errores para mantener respuestas HTTP uniformes y separar la lógica de negocio de la presentación de los errores.

El sistema está compuesto por tres elementos principales.

### AppError

La clase `AppError`, ubicada en `src/utils/errors.js`, permite generar errores personalizados mediante códigos identificadores.

Ejemplo:

```javascript
throw new AppError("USER_NOT_FOUND");
```

Los servicios identifican el error sin construir directamente una respuesta HTTP.

### Diccionario de errores

El archivo `src/utils/errorDictionary.js` contiene las definiciones centralizadas de los errores.

Cada código tiene asociado un código HTTP y un mensaje descriptivo.

Entre los errores contemplados se encuentran:

| Código                     | HTTP | Descripción                                           |
| -------------------------- | ---: | ----------------------------------------------------- |
| `USER_NOT_FOUND`           |  404 | Usuario no encontrado.                                |
| `EMAIL_ALREADY_REGISTERED` |  409 | Email ya registrado.                                  |
| `PRODUCT_NOT_FOUND`        |  404 | Producto no encontrado.                               |
| `ORDER_NOT_FOUND`          |  404 | Pedido no encontrado.                                 |
| `DELIVERY_NOT_FOUND`       |  404 | Entrega no encontrada.                                |
| `VALIDATION_ERROR`         |  400 | Error de validación.                                  |
| `DUPLICATE_KEY`            |  409 | Recurso duplicado.                                    |
| `ROUTE_NOT_FOUND`          |  404 | Ruta inexistente.                                     |
| `PAYLOAD_TOO_LARGE`        |  413 | El cuerpo de la solicitud supera el tamaño permitido. |
| `INTERNAL_SERVER_ERROR`    |  500 | Error interno del servidor.                           |
| `FILE_REQUIRED`            |  400 | Archivo requerido.                                    |
| `FILE_INVALID_TYPE`        |  400 | Tipo de archivo inválido.                             |
| `FILE_TOO_LARGE`           |  413 | Archivo demasiado grande.                             |
| `FILE_UNEXPECTED_FIELD`    |  400 | Campo de archivo inesperado.                          |
| `INVALID_DOCUMENT_TYPE`    |  400 | Tipo de documento inválido.                           |
| `FILE_STORAGE_ERROR`       |  500 | Error al almacenar el archivo.                        |

### Middleware global

El middleware `src/middlewares/errorHandler.js` centraliza el procesamiento de los errores de la aplicación.

Sus responsabilidades son:

1. Recibir los errores propagados desde los servicios y controladores.
2. Identificar el código correspondiente.
3. Consultar el diccionario de errores.
4. Determinar el código HTTP.
5. Devolver una respuesta JSON uniforme.

También contempla errores de Mongoose, como errores de validación, identificadores inválidos y claves duplicadas.

### Formato de respuesta

Todas las respuestas de error utilizan la siguiente estructura:

```json
{
  "status": "error",
  "message": "Mensaje descriptivo del error",
  "code": "ERROR_CODE"
}
```

Ejemplo:

```json
{
  "status": "error",
  "message": "Ruta no encontrada",
  "code": "ROUTE_NOT_FOUND"
}
```

## Logging y monitoreo

El proyecto implementa un sistema centralizado de logging utilizando Winston y Winston Daily Rotate File.

El logger se encuentra en `src/utils/logger.js` y permite registrar eventos de la aplicación, errores y operaciones importantes.

### Niveles de logging

| Nivel     | Descripción                                     |
| --------- | ----------------------------------------------- |
| `debug`   | Información detallada para depuración.          |
| `http`    | Eventos relacionados con solicitudes HTTP.      |
| `info`    | Información general del funcionamiento.         |
| `warning` | Advertencias y errores controlados.             |
| `error`   | Errores internos de la aplicación.              |
| `fatal`   | Errores críticos que afectan el funcionamiento. |

### Formato de registros

```text
YYYY-MM-DD HH:mm:ss [level] message
```

Ejemplo:

```text
2026-11-25 02:10:38 [info] MongoDB conectado correctamente
```

### Archivos de registro

Los registros se almacenan en la carpeta `logs/`.

- `combined-YYYY-MM-DD.log`: contiene los niveles de logging y utiliza rotación diaria.
- `error.log`: almacena los niveles `error` y `fatal`.

Los archivos generados se excluyen del repositorio mediante `.gitignore`.

### Endpoint de prueba

| Método | Endpoint           | Descripción                                             |
| ------ | ------------------ | ------------------------------------------------------- |
| GET    | `/api/logger/test` | Genera registros de prueba para los niveles de logging. |

Este endpoint está disponible únicamente fuera del entorno de producción.

## Documentación con Swagger

El proyecto incorpora Swagger para documentar los endpoints mediante la especificación OpenAPI 3.0.

La configuración se encuentra en `src/config/swagger.js`.

Se utilizan:

- Swagger JSDoc.
- Swagger UI Express.

Con el servidor iniciado en desarrollo, la documentación está disponible en:

```text
http://localhost:3000/api/docs
```

La especificación OpenAPI en formato JSON está disponible en:

```text
http://localhost:3000/api/docs-json
```

La documentación incluye los endpoints, métodos HTTP, parámetros, datos de entrada, respuestas y posibles errores.

En el entorno `production`, Swagger UI y la especificación JSON permanecen restringidos.

## Carga y almacenamiento de archivos

El proyecto utiliza Multer para gestionar la carga de archivos.

Se implementaron los siguientes endpoints:

| Método | Endpoint                       | Descripción                     |
| ------ | ------------------------------ | ------------------------------- |
| POST   | `/api/users/:id/documents`     | Carga documentos de usuarios.   |
| POST   | `/api/deliveries/:id/receipts` | Carga comprobantes de entregas. |

### Almacenamiento

Los archivos se almacenan en:

```text
uploads/
├── user-documents/
└── delivery-receipts/
```

La información de cada archivo se registra en MongoDB, incluyendo:

- Nombre original.
- Nombre generado.
- Ruta del archivo.
- Tipo MIME.
- Tamaño.
- Tipo de documento.
- Fecha de carga.

### Validaciones

Se incorporaron validaciones para:

- Archivos obligatorios.
- Tipos de archivo permitidos.
- Tamaño máximo permitido.
- Campos inesperados.
- Tipos de documentos válidos.

Los errores de carga se procesan mediante el middleware centralizado.

### Ejemplo de carga de documentos

Para cargar un documento de usuario se utiliza una solicitud `multipart/form-data`.

Endpoint:

```http
POST /api/users/:id/documents
```

Campos:

| Key            | Tipo | Valor                               |
| -------------- | ---- | ----------------------------------- |
| `document`     | File | Archivo permitido.                  |
| `documentType` | Text | `user_document` o `driver_license`. |

Para cargar un comprobante de entrega:

```http
POST /api/deliveries/:id/receipts
```

Campo:

| Key       | Tipo |
| --------- | ---- |
| `receipt` | File |

El encabezado `Content-Type` debe ser generado automáticamente por el cliente HTTP para incluir el boundary de multipart.

## Configuración de producción

El proyecto utiliza una capa centralizada de configuración ubicada en `src/config/env.config.js`.

Las variables de entorno son validadas al iniciar el servidor.

### Variables de entorno

| Variable      | Descripción                    |
| ------------- | ------------------------------ |
| `PORT`        | Puerto de ejecución de la API. |
| `MONGODB_URI` | Cadena de conexión a MongoDB.  |
| `NODE_ENV`    | Entorno de ejecución.          |
| `LOG_LEVEL`   | Nivel de logging.              |

Los entornos permitidos son:

- `development`
- `test`
- `production`

El puerto debe ser un número entero entre 1 y 65535.

Si falta una variable obligatoria o existe un valor inválido, la aplicación informa el error correspondiente e impide iniciar el servidor.

### Health Check

La API dispone del endpoint:

```http
GET /api/health
```

Devuelve información sobre el estado de la aplicación, entorno de ejecución, tiempo activo y fecha de respuesta.

Ejemplo:

```json
{
  "status": "ok",
  "message": "ShipNow API funcionando correctamente",
  "environment": "production",
  "uptime": 58.89,
  "timestamp": "2026-11-25T02:11:34.661Z"
}
```

Este endpoint no expone credenciales ni información sensible.

### Restricciones en producción

En el entorno `production` se restringe el acceso a:

- Swagger UI.
- Especificación Swagger JSON.
- Endpoints de mocks.
- Endpoint de pruebas de logging.

La API y el endpoint Health Check permanecen disponibles.

## Límites de solicitudes

Se establecieron límites de tamaño para los cuerpos de las solicitudes:

- JSON: máximo 1 MB. Si se supera este límite, la API responde con HTTP 413 (`PAYLOAD_TOO_LARGE`).
- URL encoded: máximo 1 MB.
- Archivos: sujetos a los límites configurados en Multer. Si se supera el tamaño máximo permitido, la API responde con HTTP 413 (`FILE_TOO_LARGE`).

Estas restricciones ayudan a evitar solicitudes con payloads excesivamente grandes y permiten gestionar los errores de tamaño mediante el middleware centralizado.

## Docker y despliegue

El proyecto incorpora Docker y Docker Compose para ejecutar la API y MongoDB en un entorno aislado y reproducible.

La imagen de la API utiliza Node.js 22 Alpine y una construcción multi-stage para separar la instalación de dependencias de la etapa de ejecución.

### Archivos de Docker

- `Dockerfile`: define la construcción multi-stage de la API.
- `.dockerignore`: excluye archivos innecesarios y sensibles del contexto de construcción.
- `docker-compose.yml`: configura la API, MongoDB, las dependencias entre servicios y los volúmenes.
- `.env.docker`: contiene las variables necesarias para ejecutar la API y se mantiene fuera del repositorio.

### Configuración del entorno Docker

Crear `.env.docker` en la raíz del proyecto:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
LOG_LEVEL=info
```

En Docker Compose, la conexión a MongoDB se configura mediante la dirección interna del servicio `mongo`.

La variable `NODE_ENV` se establece en `production`.

El archivo `.env.docker` no debe subirse al repositorio porque puede contener información sensible.

### Construcción de la imagen

Para construir la imagen de la API:

```powershell
docker compose build
```

También se puede construir directamente:

```powershell
docker build -t shipnow-api .
```

### Iniciar los servicios

Para iniciar la API y MongoDB:

```powershell
docker compose up -d
```

### Consultar el estado

```powershell
docker compose ps
```

Los servicios disponen de healthchecks para verificar su estado. La API espera a que MongoDB se encuentre saludable antes de iniciar.

### Consultar los logs

```powershell
docker compose logs -f shipnow
```

Para consultar los últimos registros:

```powershell
docker compose logs --tail=50 shipnow
```

Los archivos de logging se almacenan en `/app/logs`.

### Reiniciar los servicios

```powershell
docker compose restart
```

### Detener los servicios

```powershell
docker compose down
```

Este comando detiene y elimina los contenedores y la red, pero conserva los volúmenes nombrados.

No utilizar `docker compose down -v` si se desea conservar la información almacenada.

### Ejecución independiente con Docker

También es posible construir y ejecutar únicamente la API:

```powershell
docker build -t shipnow-api .
```

```powershell
docker run -d --name shipnow-api -p 3000:3000 --env-file .env.docker -e NODE_ENV=production -v shipnow-uploads:/app/uploads -v shipnow-logs:/app/logs shipnow-api
```

En esta modalidad, la variable `MONGODB_URI` debe apuntar a una instancia de MongoDB accesible desde el contenedor, como MongoDB Atlas.

### Acceso a la API

Una vez iniciados los servicios, la API queda disponible en:

```text
http://localhost:3000
```

El estado de la aplicación puede verificarse mediante:

```text
http://localhost:3000/api/health
```

### Base de datos MongoDB

Docker Compose incluye un servicio MongoDB basado en MongoDB 7.

La instancia utiliza un Replica Set de un solo nodo (`rs0`), necesario para admitir las transacciones utilizadas por el proceso Seed.

La API se conecta mediante la dirección interna:

```text
mongodb://mongo:27017/shipnow?replicaSet=rs0
```

MongoDB dispone de un healthcheck y utiliza un volumen nombrado para conservar los datos.

### Persistencia de datos

Docker Compose configura tres volúmenes nombrados:

| Volumen              | Directorio     | Contenido                           |
| -------------------- | -------------- | ----------------------------------- |
| `shipnow-mongo-data` | `/data/db`     | Datos de MongoDB.                   |
| `shipnow-uploads`    | `/app/uploads` | Documentos y comprobantes cargados. |
| `shipnow-logs`       | `/app/logs`    | Archivos de logging.                |

Los volúmenes permiten conservar los datos aunque se reinicien o recreen los contenedores.

La persistencia de MongoDB, archivos subidos y logs fue comprobada mediante pruebas de reinicio de los servicios.

### Usuario y permisos

La imagen ejecuta la aplicación utilizando el usuario no privilegiado `node`.

Los directorios de uploads y logs cuentan con permisos para permitir la escritura de archivos durante la ejecución.

### Healthchecks

Se implementan controles de salud para ambos servicios:

- MongoDB verifica el estado del Replica Set.
- La API consulta el endpoint `/api/health`.

Docker Compose utiliza la condición `service_healthy` para esperar a que MongoDB esté disponible antes de iniciar la API.

## Pruebas automatizadas

El proyecto utiliza Mocha, Chai y Supertest para verificar el funcionamiento de la API mediante pruebas automatizadas.

### Configuración del entorno de testing

Las pruebas utilizan una base de datos independiente de la utilizada en desarrollo y producción.

El repositorio incluye `.env.test.example` como referencia para configurar el entorno de pruebas.

Para crear el archivo local `.env.test`, ejecutar en PowerShell:

```powershell
Copy-Item .env.test.example .env.test
```

La configuración de ejemplo utiliza una instancia MongoDB configurada como Replica Set, necesaria para ejecutar las pruebas que utilizan transacciones.

El archivo `.env.test` contiene variables locales y no debe subirse al repositorio.

### Ejecutar las pruebas

Para ejecutar la suite completa:

```powershell
npm test
```

Para ejecutar específicamente las pruebas del proceso Seed:

```powershell
npm run test:seed
```

### Cobertura funcional

La suite incluye pruebas de:

- Health Check.
- Usuarios.
- Productos.
- Pedidos.
- Entregas.
- Mocks.
- Generación de datos mediante Seed.
- Logging.
- Documentación Swagger.
- Validaciones y manejo de errores.
- Payloads JSON superiores al límite permitido.

Se verifican respuestas exitosas, códigos HTTP, validaciones y estructura de las respuestas.

En la última ejecución de la suite se obtuvieron **74 pruebas aprobadas**.

## Seguridad

El proyecto incorpora distintas medidas para mejorar la seguridad y el manejo de errores:

- Encriptación de contraseñas mediante Bcrypt.
- Variables de entorno para proteger la configuración sensible.
- Validación de variables de entorno al iniciar la aplicación.
- Validaciones de datos mediante Mongoose.
- Uso de constantes para roles, estados y prioridades.
- Manejo centralizado de errores mediante middleware.
- Respuestas de error uniformes.
- Protección de información interna ante errores inesperados.
- Separación de responsabilidades mediante servicios y repositorios.
- Logging centralizado mediante Winston.
- Exclusión de archivos sensibles del repositorio.
- Restricción de endpoints de desarrollo en producción.
- Límites de tamaño para las solicitudes.
- Validación de archivos mediante Multer.
- Exclusión de archivos sensibles del contexto de construcción de Docker.

## Autor

**Emanuel Cortez**

Proyecto desarrollado como parte de la formación Backend III.

GitHub: https://github.com/cortezemanuel/ShipNow
