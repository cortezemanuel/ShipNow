# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para la gestión de usuarios, productos, pedidos y entregas de una plataforma de logística y envíos.

El proyecto está desarrollado utilizando una arquitectura por capas, separando responsabilidades para facilitar el mantenimiento, la escalabilidad y la organización del código.

## Tecnologías utilizadas

- **Mocha:** framework para ejecutar pruebas automatizadas.
- **Chai:** biblioteca para realizar aserciones.
- **Supertest:** herramienta para probar endpoints HTTP.
- **Express:** framework para la creación de la API REST.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado y gestión de documentos.
- **Bcrypt:** encriptación de contraseñas.
- **Dotenv:** gestión de variables de entorno.
- **Faker:** generación de datos ficticios para pruebas.
- **Nodemon:** reinicio automático del servidor durante el desarrollo.
- **Winston:** gestión centralizada de logs.
- **Winston Daily Rotate File:** rotación automática de archivos de logs.

## Arquitectura del proyecto

El proyecto utiliza una arquitectura por capas, separando las responsabilidades de cada componente:

- **Config:** configuración de la aplicación y conexión a la base de datos.
- **Constants:** constantes utilizadas en los distintos módulos.
- **Controllers:** reciben las solicitudes HTTP y gestionan las respuestas exitosas.
- **Middlewares:** procesan solicitudes y centralizan el manejo de errores.
- **Models:** definen los esquemas y estructuras de los documentos.
- **Repositories:** centralizan las operaciones de acceso a la base de datos.
- **Services:** contienen la lógica de negocio y detectan errores.
- **Routes:** definen los endpoints de la API.
- **Mocks:** contienen los generadores de datos ficticios.
- **Utils:** funciones, clases y utilidades compartidas.
- **Tests:** contienen las pruebas automatizadas.

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
│   │   └── errorHandler.js
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
│   ├── helpers/
│   │   ├── database.js
│   │   └── hooks.js
│   │
│   ├── deliveries.test.js
│   ├── deliveriesEndpoint.test.js
│   ├── health.test.js
│   ├── mocks.test.js
│   ├── orders.test.js
│   ├── ordersEndpoint.test.js
│   ├── seed.test.js
│   ├── swagger.test.js
│   ├── users.test.js
│   └── usersEndpoint.test.js
│
├── .env.example
├── .env.test.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

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

Crear el archivo .env en la raíz del proyecto tomando como referencia .env.example.

cp .env.example .env

Configurar las siguientes variables:

PORT=3000
MONGODB_URI=tu_uri_de_mongodb
NODE_ENV=development

PORT: puerto en el que se ejecutará el servidor.

MONGODB_URI: cadena de conexión a MongoDB.

NODE_ENV: entorno de ejecución.

Las variables de entorno son validadas al iniciar la aplicación. Si falta alguna variable obligatoria o el puerto no es válido, la aplicación informa el error correspondiente.

### 5. Configurar el entorno de pruebas

Crear el archivo .env.test tomando como referencia .env.test.example.

cp .env.test.example .env.test

Configurar MONGODB_URI con una conexión a la base de datos shipnow_test.

Importante: las pruebas del endpoint Seed utilizan transacciones de MongoDB. Por este motivo, se requiere MongoDB Atlas o una instancia local configurada como Replica Set. Una instancia standalone no admite estas transacciones.

## Ejecución del proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo producción:

```bash
npm start
```

Por defecto, la API estará disponible en:

```text
http://localhost:3000
```

## Endpoints disponibles

### Encabezados y formato de solicitudes

La API no requiere encabezados de autenticación ni encabezados personalizados. Para las solicitudes que envían un cuerpo JSON (POST y PUT), utilizar el encabezado `Content-Type: application/json`.

### Health Check

Permite verificar que la API se encuentra funcionando correctamente.

| Método | Endpoint      | Descripción                  |
| ------ | ------------- | ---------------------------- |
| GET    | `/api/health` | Verifica el estado de la API |

### Productos

Base URL: `/api/products`

| Método | Endpoint            | Descripción                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/products`     | Obtiene todos los productos |
| GET    | `/api/products/:id` | Obtiene un producto por ID  |
| POST   | `/api/products`     | Crea un producto            |
| PUT    | `/api/products/:id` | Actualiza un producto       |
| DELETE | `/api/products/:id` | Elimina un producto         |

### Usuarios

Base URL: `/api/users`

| Método | Endpoint         | Descripción                |
| ------ | ---------------- | -------------------------- |
| GET    | `/api/users`     | Obtiene todos los usuarios |
| GET    | `/api/users/:id` | Obtiene un usuario por ID  |
| POST   | `/api/users`     | Crea un usuario            |
| PUT    | `/api/users/:id` | Actualiza un usuario       |
| DELETE | `/api/users/:id` | Elimina un usuario         |

### Pedidos

Base URL: `/api/orders`

| Método | Endpoint          | Descripción               |
| ------ | ----------------- | ------------------------- |
| GET    | `/api/orders`     | Obtiene todos los pedidos |
| GET    | `/api/orders/:id` | Obtiene un pedido por ID  |
| POST   | `/api/orders`     | Crea un pedido            |

### Entregas

Base URL: `/api/deliveries`

| Método | Endpoint              | Descripción                |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/deliveries`     | Obtiene todas las entregas |
| GET    | `/api/deliveries/:id` | Obtiene una entrega por ID |
| POST   | `/api/deliveries`     | Crea una entrega           |

### Mocks

Base URL: `/api/mocks`

Este módulo permite generar datos ficticios para probar el funcionamiento de la aplicación.

| Método | Endpoint                | Descripción                                             |
| ------ | ----------------------- | ------------------------------------------------------- |
| GET    | `/api/mocks/users`      | Genera usuarios ficticios                               |
| GET    | `/api/mocks/orders`     | Genera pedidos ficticios                                |
| GET    | `/api/mocks/deliveries` | Genera entregas ficticias                               |
| POST   | `/api/mocks/seed`       | Genera e inserta datos relacionados en la base de datos |

Todos los endpoints GET de mocks reciben el parámetro opcional `qty`, que determina la cantidad de registros a generar.

Ejemplo:

```http
GET /api/mocks/users?qty=5
```

Si no se especifica `qty`, se utiliza el valor predeterminado de 10 registros.

La cantidad debe ser un número entero positivo y no puede superar el máximo de 50 registros.

Los valores inválidos, como texto, números negativos, cero, decimales o cantidades superiores al máximo permitido, generan una respuesta HTTP 400.

### Logging

Base URL: `/api/logger`

| Método | Endpoint           | Descripción                                                 |
| ------ | ------------------ | ----------------------------------------------------------- |
| GET    | `/api/logger/test` | Genera registros de prueba para los seis niveles de logging |

## Generación de datos de prueba (Mocking)

El módulo de mocking utiliza Faker para generar información ficticia de usuarios, pedidos y entregas.

La lógica está separada en tres generadores:

- `user.mocks.js`: genera usuarios con datos ficticios y roles disponibles para pruebas.
- `order.mocks.js`: genera pedidos asociados a clientes, con productos, cantidades, precios y valores de envío.
- `delivery.mocks.js`: genera entregas asociadas a pedidos y conductores.

### Generación de usuarios

Ejemplo:

```http
GET /api/mocks/users?qty=5
```

Devuelve una respuesta con estado, cantidad de registros y los usuarios generados.

### Generación de pedidos

Ejemplo:

```http
GET /api/mocks/orders?qty=5
```

Genera pedidos ficticios asociados a clientes con identificadores propios.

### Generación de entregas

Ejemplo:

```http
GET /api/mocks/deliveries?qty=5
```

Genera entregas vinculadas a pedidos y conductores ficticios. Las entregas pueden tener un conductor asignado o quedar pendientes, según los datos generados.

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

El seed establece las siguientes relaciones:

- Un pedido pertenece a un usuario con rol `customer`.
- Una entrega pertenece a un pedido.
- Una entrega puede tener asociado un usuario con rol `driver`.
- El pedido almacena la referencia de la entrega correspondiente.

Cuando una entrega tiene un conductor asignado, su estado pasa a `assigned` y el estado del pedido también se actualiza a `assigned`.

### Estados y prioridades

El proyecto utiliza constantes centralizadas para mantener consistencia en los valores.

**Estados de pedidos:**

- `created`
- `assigned`
- `picked_up`
- `in_transit`
- `delivered`
- `cancelled`

**Estados de entregas:**

- `pending`
- `assigned`
- `in_transit`
- `delivered`

**Prioridades:**

- `low`
- `normal`
- `high`

### Validaciones del seed

El parámetro `qty` permite generar entre 2 y 50 usuarios para el seed.

Si no se especifica, se utiliza el valor predeterminado de 10.

El seed necesita al menos dos usuarios para poder generar clientes y conductores.

### Transacciones de MongoDB

El proceso de seed utiliza transacciones de MongoDB para garantizar la consistencia de las operaciones.

Las inserciones y actualizaciones se ejecutan dentro de una misma transacción. Si alguna operación falla, se realiza un rollback mediante `abortTransaction()`, evitando que queden datos parcialmente insertados.

**Requisito importante:** las transacciones requieren una instancia de MongoDB configurada como replica set o un clúster compatible con transacciones.

MongoDB Atlas cumple este requisito. Una instancia local de MongoDB ejecutada como standalone (sin replica set) no admite transacciones y no podrá ejecutar este endpoint hasta configurarse adecuadamente.

## Manejo profesional y centralizado de errores

El proyecto implementa un sistema centralizado de manejo de errores para mantener respuestas HTTP uniformes y separar la lógica de negocio de la presentación de los errores.

El sistema está compuesto por tres elementos principales:

### 1. Errores personalizados (AppError)

La clase `AppError`, ubicada en `src/utils/errors.js`, permite generar errores personalizados mediante códigos identificadores.

Los servicios detectan las situaciones excepcionales y lanzan el error correspondiente utilizando su código.

Ejemplo:

```javascript
throw new AppError("USER_NOT_FOUND");
```

De esta manera, los servicios identifican el error sin construir directamente una respuesta HTTP.

### 2. Diccionario de errores

El archivo `src/utils/errorDictionary.js` contiene las definiciones centralizadas de los errores.

Cada código tiene asociado:

- Un código HTTP.
- Un mensaje descriptivo.

Ejemplo:

```javascript
USER_NOT_FOUND: {
  statusCode: 404,
  message: "Usuario no encontrado",
},
```

El diccionario permite mantener consistencia en los mensajes y códigos utilizados por toda la aplicación.

Entre los errores contemplados se encuentran:

| Código                     | HTTP | Descripción                           |
| -------------------------- | ---: | ------------------------------------- |
| `USER_NOT_FOUND`           |  404 | Usuario no encontrado                 |
| `EMAIL_ALREADY_REGISTERED` |  409 | Email ya registrado                   |
| `PRODUCT_NOT_FOUND`        |  404 | Producto no encontrado                |
| `PRODUCT_INVALID_PRICE`    |  400 | Precio inválido                       |
| `PRODUCT_INVALID_STOCK`    |  400 | Stock inválido                        |
| `ORDER_NOT_FOUND`          |  404 | Pedido no encontrado                  |
| `DELIVERY_NOT_FOUND`       |  404 | Entrega no encontrada                 |
| `INVALID_MOCK_QUANTITY`    |  400 | Cantidad de mocks inválida            |
| `MOCK_SEED_MINIMUM`        |  400 | Cantidad mínima de usuarios para seed |
| `VALIDATION_ERROR`         |  400 | Error de validación de datos          |
| `DUPLICATE_KEY`            |  409 | Recurso duplicado                     |
| `ROUTE_NOT_FOUND`          |  404 | Ruta inexistente                      |
| `INTERNAL_SERVER_ERROR`    |  500 | Error interno del servidor            |

### 3. Middleware global de errores

El middleware `src/middlewares/errorHandler.js` centraliza el procesamiento y la respuesta de los errores de la aplicación.

Su responsabilidad es:

1. Recibir los errores propagados desde los servicios y controladores.
2. Identificar el código correspondiente.
3. Consultar el diccionario de errores.
4. Determinar el código HTTP.
5. Devolver una respuesta JSON uniforme.

También contempla errores de Mongoose, como errores de validación, identificadores inválidos y claves duplicadas.

Los errores inesperados se responden de forma controlada, evitando exponer detalles internos de la base de datos o información sensible.

Los controladores propagan los errores mediante `next(error)`, mientras que el middleware global se encarga de construir la respuesta HTTP.

### Formato de respuesta de error

Todas las respuestas de error utilizan la siguiente estructura:

```json
{
  "status": "error",
  "message": "Mensaje descriptivo del error",
  "code": "ERROR_CODE"
}
```

Ejemplo de una cantidad inválida en mocks:

```json
{
  "status": "error",
  "message": "La cantidad debe ser un número entero entre 1 y 50",
  "code": "INVALID_MOCK_QUANTITY"
}
```

Ejemplo de una ruta inexistente:

```json
{
  "status": "error",
  "message": "Ruta no encontrada",
  "code": "ROUTE_NOT_FOUND"
}
```

Este formato permite identificar fácilmente el tipo de error, su descripción y el código correspondiente.

## Pruebas del manejo de errores

El sistema permite comprobar el funcionamiento del manejo centralizado mediante solicitudes HTTP.

### Pruebas de cantidades inválidas en Mocks

Con el servidor iniciado mediante `npm run dev`, se pueden probar los siguientes casos:

**Cantidad no numérica:**

```http
GET /api/mocks/users?qty=abc
```

Respuesta esperada: HTTP 400.

**Cantidad superior al máximo:**

```http
GET /api/mocks/users?qty=51
```

Respuesta esperada: HTTP 400.

**Cantidad negativa:**

```http
GET /api/mocks/users?qty=-1
```

Respuesta esperada: HTTP 400.

**Cantidad decimal:**

```http
GET /api/mocks/users?qty=1.5
```

Respuesta esperada: HTTP 400.

**Cantidad cero:**

```http
GET /api/mocks/users?qty=0
```

Respuesta esperada: HTTP 400.

### Prueba de ruta inexistente

```http
GET /api/ruta-inventada
```

Respuesta esperada: HTTP 404 con el código `ROUTE_NOT_FOUND`.

### Prueba de cantidad mínima del seed

```http
POST /api/mocks/seed?qty=1
```

Respuesta esperada: HTTP 400 con el código `MOCK_SEED_MINIMUM`.

### Prueba de errores durante el seed

El endpoint:

```http
POST /api/mocks/seed?qty=10
```

utiliza una transacción de MongoDB. Si ocurre un error durante la generación o inserción de los datos, se intenta cancelar la transacción y el error se propaga al middleware global para generar una respuesta controlada.

## Pruebas automatizadas

El proyecto utiliza Mocha, Chai y Supertest para verificar el funcionamiento de la API mediante pruebas unitarias y funcionales.

### Configuración del entorno de testing

Las pruebas utilizan una base de datos independiente de la base de desarrollo.

Se configura mediante el archivo `.env.test`, ubicado en la raíz del proyecto y excluido del repositorio.

El archivo debe contener:

```env
PORT=3001
MONGODB_URI=tu_uri_de_mongodb_con_la_base_shipnow_test
NODE_ENV=test
```

La base de datos utilizada para las pruebas es `shipnow_test`.

### Ejecutar las pruebas

Para ejecutar la suite completa:

```bash
npm test
```

Para ejecutar únicamente las pruebas del endpoint Seed:

```bash
npm run test:seed
```

### Cobertura de las pruebas

La suite incluye pruebas de:

- Health Check.
- Usuarios.
- Pedidos.
- Entregas.
- Mocks.
- Generación de datos relacionados mediante Seed.
- Logging.
- Documentación Swagger.

Se verifican respuestas exitosas, códigos HTTP, validaciones, errores controlados y estructura de las respuestas.

### Limpieza y repetibilidad

Las pruebas que generan registros en MongoDB contemplan la limpieza de los datos creados durante su ejecución.

La conexión a la base de datos de testing se gestiona mediante hooks de Mocha, que conectan antes de ejecutar la suite y desconectan al finalizar.

En la última ejecución, la suite obtuvo 59 pruebas aprobadas.

## Logging y monitoreo básico

El proyecto implementa un sistema centralizado de logging utilizando Winston y Winston Daily Rotate File.

El logger se encuentra en `src/utils/logger.js` y permite registrar eventos de la aplicación, errores y operaciones importantes.

### Niveles de logging

Se utilizan seis niveles personalizados:

| Nivel     | Descripción                                     |
| --------- | ----------------------------------------------- |
| `debug`   | Información detallada para depuración.          |
| `http`    | Eventos relacionados con solicitudes HTTP.      |
| `info`    | Información general del funcionamiento.         |
| `warning` | Advertencias y errores controlados.             |
| `error`   | Errores internos de la aplicación.              |
| `fatal`   | Errores críticos que afectan el funcionamiento. |

### Formato de los registros

Los mensajes utilizan el siguiente formato:

```text
YYYY-MM-DD HH:mm:ss [level] message
```

Ejemplo:

```text
2026-11-23 16:44:16 [info] MongoDB conectado correctamente
```

### Configuración por entorno

El comportamiento del logger se integra con la variable `NODE_ENV`.

- **Development:** registra todos los niveles, desde `debug` hasta `fatal`.
- **Production:** registra los niveles `info`, `warning`, `error` y `fatal`.

### Archivos de registro

Los registros se almacenan en la carpeta `logs/`.

- `combined-YYYY-MM-DD.log`: contiene todos los niveles de logging y utiliza rotación diaria, conservando los registros durante 14 días.
- `error.log`: almacena exclusivamente los niveles `error` y `fatal`, con rotación por tamaño de archivo.

El archivo de errores tiene un límite de 10 MB y conserva hasta cinco archivos rotados.

Los archivos generados se excluyen del repositorio mediante `.gitignore`. Se conserva la carpeta `logs/` utilizando `.gitkeep`.

### Integración del logger

Winston se utiliza en distintas partes de la aplicación:

- Inicio del servidor.
- Conexión y errores de MongoDB.
- Middleware global de manejo de errores.
- Ejecución del seed de datos de prueba.
- Creación de pedidos.

Los errores controlados se registran como `warning`, mientras que los errores internos se registran como `error`. Los errores críticos de inicio y conexión se registran como `fatal`.

### Endpoint de prueba

Se incorpora un endpoint para comprobar los seis niveles de logging:

| Método | Endpoint           | Descripción                                  |
| ------ | ------------------ | -------------------------------------------- |
| GET    | `/api/logger/test` | Genera un registro de prueba por cada nivel. |

Para probarlo, iniciar el servidor:

```bash
npm run dev
```

Luego ejecutar:

```http
GET /api/logger/test
```

También puede probarse desde PowerShell:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/logger/test" -Method Get
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Se generaron registros de prueba en todos los niveles"
}
```

La ejecución genera mensajes en consola y en los archivos correspondientes dentro de `logs/`.

## Documentación de la API con Swagger

El proyecto incorpora Swagger para documentar los endpoints de la API REST mediante la especificación OpenAPI 3.0.

La configuración se encuentra centralizada en `src/config/swagger.js`.

Se utilizan las siguientes dependencias:

- **Swagger JSDoc:** genera la especificación OpenAPI a partir de las anotaciones en las rutas.
- **Swagger UI Express:** permite visualizar y probar los endpoints mediante una interfaz web.

### Acceso a la documentación

Con el servidor iniciado mediante:

```bash
npm run dev
```

La especificación OpenAPI en formato JSON está disponible en:

`http://localhost:3000/api/docs-json`

### Recursos documentados

La documentación incluye Users, Products, Orders, Deliveries, Mocks y Logger.

Se documentan los métodos HTTP, rutas, parámetros, datos de entrada, respuestas exitosas y posibles errores.

### Esquemas reutilizables

- `User`
- `UserCreateRequest`
- `Product`
- `ProductCreateRequest`
- `ProductUpdateRequest`
- `Order`
- `OrderItem`
- `OrderCreateRequest`
- `Delivery`
- `DeliveryCreateRequest`
- `ErrorResponse`
- `SuccessResponse`

Swagger UI permite ejecutar solicitudes HTTP directamente desde el navegador mediante la opción **Try it out**.

## Seguridad y manejo de errores

El proyecto incorpora distintas medidas para mejorar la seguridad y el manejo de errores:

- Encriptación de contraseñas mediante Bcrypt.
- Variables de entorno para proteger la configuración sensible.
- Validación de variables de entorno al iniciar la aplicación.
- Validaciones de datos en los modelos de Mongoose.
- Uso de constantes para roles, estados y prioridades.
- Manejo centralizado de errores mediante middleware.
- Uso de una clase `AppError` para gestionar errores personalizados.
- Diccionario centralizado para mensajes y códigos HTTP.
- Respuestas de error uniformes.
- Protección de información interna ante errores inesperados.
- Separación de responsabilidades mediante servicios y repositorios.
- Logging centralizado mediante Winston.
- Separación de registros generales y errores críticos.
- Rotación automática de archivos de registro.
- Exclusión de archivos de logs y credenciales del repositorio.

## Autor

**Emanuel Cortez**

Proyecto desarrollado como parte de la formación Backend III.

GitHub: https://github.com/cortezemanuel/ShipNow
