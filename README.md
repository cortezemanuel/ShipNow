# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para la gestión de productos y usuarios de ShipNow.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript (ES Modules)
- Dotenv
- CORS
- Bcrypt
- Nodemon

## Arquitectura

El proyecto utiliza una arquitectura en capas para separar responsabilidades y facilitar el mantenimiento y la escalabilidad del código.

- **Routes:** define los endpoints de la API y conecta cada ruta con su Controller.
- **Controllers:** recibe las solicitudes HTTP y gestiona las respuestas.
- **Services:** contiene la lógica de negocio, las validaciones y las reglas de funcionamiento.
- **Repositories:** centraliza el acceso a MongoDB mediante Mongoose.
- **Models:** define los esquemas y modelos de datos.
- **Config:** contiene la configuración del entorno y la conexión a la base de datos.
- **Constants:** centraliza los valores constantes del dominio.

El flujo de trabajo es:

`Routes → Controllers → Services → Repositories → Models`

### Separación entre Service y Repository

Separamos estas capas para evitar mezclar la lógica de negocio con el acceso a datos.

El **Service** se encarga de las validaciones y reglas de negocio. Por ejemplo, al crear o actualizar un producto determina su estado según el stock disponible.

El **Repository** se encarga exclusivamente de las operaciones con MongoDB, como consultar, crear, actualizar y eliminar registros.

De esta manera, los Controllers no necesitan conocer los detalles de la base de datos y cada capa tiene una responsabilidad específica.

## Instalación

1. Clonar el repositorio.
2. Instalar las dependencias:

```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`.

4. Configurar las variables de entorno:

```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
NODE_ENV=development
```

5. Iniciar el servidor en modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor en modo normal:

```bash
npm start
```

## Endpoints

### Health Check

| Método | Endpoint      | Descripción                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/api/health` | Verifica el funcionamiento de la API |

### Products

| Método | Endpoint            | Descripción                     |
| ------ | ------------------- | ------------------------------- |
| GET    | `/api/products`     | Lista los productos             |
| GET    | `/api/products/:id` | Obtiene un producto por ID      |
| POST   | `/api/products`     | Crea un producto                |
| PUT    | `/api/products/:id` | Actualiza un producto           |
| DELETE | `/api/products/:id` | Elimina lógicamente un producto |

### Users

| Método | Endpoint         | Descripción               |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/users`     | Lista los usuarios        |
| GET    | `/api/users/:id` | Obtiene un usuario por ID |
| POST   | `/api/users`     | Registra un usuario       |
| PUT    | `/api/users/:id` | Actualiza un usuario      |
| DELETE | `/api/users/:id` | Elimina un usuario        |

## Configuración y seguridad

- Las variables de entorno se validan al iniciar la aplicación.
- Si falta una variable obligatoria, la aplicación lanza un error descriptivo.
- Las contraseñas de los usuarios se almacenan utilizando hashing con Bcrypt.
- Las contraseñas no se incluyen en las respuestas de consulta.
- El archivo `.env` está excluido del repositorio mediante `.gitignore`.

## Ejecución

El servidor se ejecuta por defecto en:

`http://localhost:3000`

La API utiliza MongoDB como base de datos y Mongoose para la gestión de modelos y operaciones.

## Autor

Proyecto desarrollado como parte del curso Backend III.
