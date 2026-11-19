# ShipNow API

API REST desarrollada con Node.js, Express y MongoDB para la gestión de productos, usuarios, pedidos y entregas de ShipNow.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript (ES Modules)
- Dotenv
- CORS
- Bcrypt
- Faker.js
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
- **Mocks:** contiene los generadores de datos simulados mediante Faker.

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

### Mocks

El módulo de mocking permite generar datos ficticios mediante Faker.js, respetando la estructura de los modelos reales y las constantes definidas en el proyecto.

Cuenta con dos endpoints:

| Método | Endpoint                 | Descripción                                                        |
| ------ | ------------------------ | ------------------------------------------------------------------ |
| GET    | `/api/mocks/users?qty=5` | Genera usuarios simulados sin guardarlos en MongoDB                |
| POST   | `/api/mocks/seed?qty=10` | Genera e inserta usuarios, pedidos y entregas de prueba en MongoDB |

#### Generación de usuarios

Para obtener usuarios simulados sin persistirlos en la base de datos:

```http
GET http://localhost:3000/api/mocks/users?qty=5
```

El parámetro `qty` indica la cantidad de usuarios a generar. Si no se especifica, se utiliza el valor predeterminado.

Los usuarios generados incluyen nombre, apellido, email, contraseña de prueba y rol.

#### Carga de datos de prueba

Para insertar datos simulados en MongoDB:

```http
POST http://localhost:3000/api/mocks/seed?qty=10
```

El proceso genera:

- Usuarios con roles de cliente y repartidor.
- Pedidos asociados a los clientes generados.
- Entregas vinculadas a los pedidos.
- Repartidores asignados a las entregas.

Las contraseñas de los usuarios insertados se almacenan utilizando hashing con Bcrypt.

La operación utiliza una transacción de MongoDB para mantener la consistencia de los datos. Si ocurre un error durante el proceso, los cambios de la transacción se revierten.

El parámetro `qty` permite indicar la cantidad de usuarios a generar. Se admiten cantidades entre 2 y 50.

La respuesta informa la cantidad de usuarios, pedidos y entregas insertados.

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Datos de prueba generados correctamente",
  "payload": {
    "users": 10,
    "orders": 5,
    "deliveries": 5
  }
}
```

**Importante:** el endpoint de seed inserta registros nuevos en MongoDB. No elimina los datos existentes.

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
