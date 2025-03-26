winet/
├── backend/
│   ├──config/
│   │   └── db.js
│   ├──controllers/   # funciones que manejan las solicitudes HTTP 
│   │   ├──auth/ 
│   │   │   ├── authController.js
│   │   ├──clients/ 
│   │   │   ├── clientController.js
│   │   ├──users/ 
│   │   │   ├── usersController.js
│   ├──doc/           # Documentación del proyecto
│   ├──logs/           
│   │   ├── combined.js
│   │   ├── error.js
│   ├──middlewares/   # Funciones que tienen acceso al objeto de solicitud (request)
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── rateLimit.js
│   │   ├── securityHeaders.js
├── ├──models/         # Estructura de datos y la lógica de negocio de la aplicación 
│   │   ├──auth/ 
│   │   │   ├── ActivationCode.js
│   │   │   ├── PasswordResetToken.js
│   │   │   ├── RefresToken.js
│   │   ├──clients/ 
│   │   │   ├── ClienteWinetModel.js
│   │   security/ 
│   │   │   ├── Permission.js
│   │   │   ├── Roles.js
│   │   ├──users/ 
│   │   │   ├── UserActivity.js
│   │   │   ├── Users.js
│   │   │   ├── UserSession.js
│   │   ├── associations.js
│   │   ├── index.js
│   ├──routes/        # Controlador de solicitud entrante basada en el método HTTP 
│   │   ├──auth/ 
│   │   │   ├── auth.js
│   │   ├──clients/ 
│   │   │   ├── clientesRoutes.js
│   │   ├──users/ 
│   │   │   ├── userRoutes.js
│   ├──sql/           # Sentencias SQL  
│   ├──utils/
│   │   └── logger.js
├── .env
├── .gitignore
├── app.js             # Configuración de la aplicación
└── server.js          # Arranque del servidor