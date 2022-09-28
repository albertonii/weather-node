# Between - Express RESTful API Node Server

Servidor API REST creado con express para la entrevista _BETWEEN_

## Instalación

Clonar el repo:

```bash
git clone  https://github.com/albertonii/weather-node.git
cd weather-node
npx rimraf ./.git
```

Instalación de dependencias:

```bash
yarn install
```

Variables de entorno:

```bash
cp .env.example .env

# abre .env y modifica las variables de entorno (en caso necesario)
```

## Tabla de contenidos

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [Contributing](#contributing)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Error handling**: centralized error handling mechanism
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Commands

Ejecutar en local:

```bash
yarn dev
```

Ejecutar en producción:

```bash
yarn start
```

Testing:

```bash
# Ejecutar todos los tests
yarn test
```

Linting:

```bash
# ejecutar ESLint
yarn lint

# arreglar ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# arreglar errores prettier
yarn prettier:fix
```

## Variables de entorno

Las variables de entorno pueden ser modificadas en el archivo `.env`. Vienen con los siguientes valores por defecto:

# Port number

PORT=4000

# URL of the Mongo DB

MONGODB_URL=Mongo Atlas URL

```

## Project Structure

```

src\
 |--config\ # Environment variables and configuration related things
|--controllers\ # Route controllers (controller layer)
|--middlewares\ # Custom express middlewares
|--models\ # Mongoose models (data layer)
|--routes\ # Routes
|--services\ # Business logic (service layer)
|--utils\ # Utility classes and functions
|--validations\ # Request data validation schemas
|--app.js # Express app
|--index.js # App entry point

### API Endpoints

List of available routes:
**Weather routes**:\
`POST /v1/v1/weather` - create new weather\
`DELETE /v1/weather` - delete all weather\
`GET /v1/weather` - get all weather\
`GET /v1/weather/query?city=${city}&country=${country}&date={date}` - get all weather filtered by date and location\
user

## Error Handling

La aplicación tiene un mecanismo de manejo de errores centralizado.

Los controladores deberían intentar atrapar los errores y reenviarlos al middleware de gestión de errores (llamando a `next(error)`). Para mayor comodidad, también puedes envolver el controlador dentro de la envoltura de la utilidad catchAsync, que reenvía el error.

```javascript
const catchAsync = require("../utils/catchAsync");

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error("Something wrong happened");
});
```

El middleware de gestión de errores envía una respuesta de error, que tiene el siguiente formato:

```json
{
  "code": 404,
  "message": "Not found"
}
```

Cuando se ejecuta en modo de desarrollo, la respuesta de error también contiene la pila de errores.

La aplicación tiene una clase de utilidad ApiError a la que puedes adjuntar un código de respuesta y un mensaje, y luego lanzarlo desde cualquier lugar (catchAsync lo atrapará).

Por ejemplo, si estás intentando obtener un usuario de la BD que no se encuentra, y quieres enviar un error 404, el código debería ser algo así

```javascript
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
};
```

## Validation

Los datos solicitados se validan utilizando [Joi](https://joi.dev/). Consulta la [documentación](https://joi.dev/api/) para más detalles sobre cómo escribir esquemas de validación Joi.

Los esquemas de validación se definen en el directorio `src/validations` y se utilizan en las rutas proporcionándolas como parámetros al middleware `validate`.

```javascript
const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.post(
  "/users",
  validate(userValidation.createUser),
  userController.createUser
);
```

## Logging

Importa el logger desde `src/config/logger.js`. Utiliza la biblioteca de registro [Winston](https://github.com/winstonjs/winston).

El registro debe hacerse de acuerdo con los siguientes niveles de gravedad (orden ascendente de más a menos importante):

```javascript
const logger = require("<path to src>/config/logger");

logger.error("message"); // level 0
logger.warn("message"); // level 1
logger.info("message"); // level 2
logger.http("message"); // level 3
logger.verbose("message"); // level 4
logger.debug("message"); // level 5
```

En el modo de desarrollo, los mensajes de registro de todos los niveles de gravedad se imprimirán en la consola.

En modo de producción, sólo se imprimirán en la consola los registros de `info`, `warn` y `error`.
Es el servidor (o el gestor de procesos) el que debe leerlos de la consola y almacenarlos en archivos de registro.
Esta aplicación utiliza pm2 en modo de producción, que ya está configurado para almacenar los registros en archivos de registro.

Nota: La información de la solicitud de la API (url de la solicitud, código de respuesta, marca de tiempo, etc.) también se registra automáticamente (usando [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

La aplicación también contiene 2 plugins personalizados de mongoose que puedes adjuntar a cualquier esquema de modelo de mongoose. Puedes encontrar los plugins en `src/models/plugins`.

```javascript
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);
```

### toJSON

El plugin toJSON aplica los siguientes cambios en la llamada a la transformación toJSON:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

El plugin paginate añade el método estático `paginate` al esquema de mongoose.

Añadir este plugin al esquema del modelo `User` te permitirá hacer lo siguiente:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

El parámetro `filter` es un filtro regular de mongo.

El parámetro `options` puede tener los siguientes campos (opcionales):

```javascript
const options = {
  sortBy: "name:desc", // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

El plugin también permite ordenar por múltiples criterios (separados por una coma): `sortBy: name:desc,role:asc`

El método `paginate` devuelve una Promise, que se completa con un objeto que tiene las siguientes propiedades:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

El linting se realiza con [ESLint](https://eslint.org/) y [Prettier](https://prettier.io).

En esta aplicación, ESLint está configurado para seguir la [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) con algunas modificaciones. También se extiende [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) para desactivar todas las reglas innecesarias o que puedan entrar en conflicto con Prettier.

Para modificar la configuración de ESLint, actualice el archivo `.eslintrc.json`. Para modificar la configuración de Prettier, actualice el archivo `.prettierrc.json`.

Para evitar que un determinado archivo o directorio sea lintado, añádalo a `.eslintignore` y `.prettierignore`.

Para mantener un estilo de codificación consistente en diferentes IDEs, el proyecto contiene `.editorconfig`.
