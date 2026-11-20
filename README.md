# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para la gestión de usuarios, productos, pedidos y entregas de una plataforma de logística y envíos.

El proyecto está desarrollado utilizando una arquitectura por capas, separando responsabilidades para facilitar el mantenimiento, la escalabilidad y la organización del código.

## Tecnologías utilizadas

- **Node.js:** entorno de ejecución.
- **Express:** framework para la creación de la API REST.
- **MongoDB:** base de datos NoSQL.
- **Mongoose:** modelado y gestión de documentos.
- **Bcrypt:** encriptación de contraseñas.
- **Dotenv:** gestión de variables de entorno.
- **Faker:** generación de datos ficticios para pruebas.
- **Nodemon:** reinicio automático del servidor durante el desarrollo.

## Arquitectura del proyecto

El proyecto utiliza una arquitectura por capas, separando las responsabilidades de cada componente:

- **Config:** configuración de la aplicación y conexión a la base de datos.
- **Constants:** constantes utilizadas en los distintos módulos.
- **Controllers:** reciben las solicitudes HTTP y gestionan las respuestas.
- **Models:** definen los esquemas y estructuras de los documentos.
- **Repositories:** centralizan las operaciones de acceso a la base de datos.
- **Services:** contienen la lógica de negocio.
- **Routes:** definen los endpoints de la API.
- **Mocks:** contienen los generadores de datos ficticios.
- **Utils:** funciones y utilidades compartidas.

### Estructura de carpetas

```text
src/
├── app.js
├── server.js
├── config/
│   ├── database.config.js
│   └── env.config.js
├── constants/
│   └── index.js
├── controllers/
│   ├── delivery.controller.js
│   ├── order.controller.js
│   ├── products.controller.js
│   ├── user.controller.js
│   └── mocks.controller.js
├── models/
│   ├── delivery.model.js
│   ├── order.model.js
│   ├── product.model.js
│   └── user.model.js
├── mocks/
│   ├── user.mocks.js
│   ├── order.mocks.js
│   └── delivery.mocks.js
├── repositories/
│   ├── delivery.repository.js
│   ├── order.repository.js
│   ├── product.repository.js
│   └── user.repository.js
├── routes/
│   ├── deliveries.js
│   ├── orders.js
│   ├── products.router.js
│   ├── users.js
│   └── mocks.router.js
├── services/
│   ├── delivery.service.js
│   ├── order.service.js
│   ├── products.service.js
│   ├── user.service.js
│   └── mocks.service.js
└── utils/
    └── errors.js
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

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
NODE_ENV=development
```

- `PORT`: puerto en el que se ejecutará el servidor.
- `MONGODB_URI`: cadena de conexión a MongoDB.
- `NODE_ENV`: entorno de ejecución.

Las variables de entorno son validadas al iniciar la aplicación. Si falta alguna variable obligatoria o el puerto no es válido, la aplicación informa el error correspondiente.

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

Los valores inválidos, como texto, números negativos, cero o decimales, generan una respuesta HTTP 400.

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

## Seguridad y manejo de errores

El proyecto incorpora distintas medidas para mejorar la seguridad y el manejo de errores:

- Encriptación de contraseñas mediante Bcrypt.
- Variables de entorno para proteger la configuración sensible.
- Validación de variables de entorno al iniciar la aplicación.
- Validaciones de datos en los modelos de Mongoose.
- Uso de constantes para roles, estados y prioridades.
- Manejo centralizado de errores mediante middleware.
- Uso de una clase `AppError` para gestionar errores personalizados y sus códigos HTTP.
- Separación de responsabilidades mediante servicios y repositorios.
- Protección de rutas según roles cuando corresponde.

## Autor

**Emanuel Cortez**

Proyecto desarrollado como parte de la formación Backend III.

GitHub: https://github.com/cortezemanuel/ShipNow
