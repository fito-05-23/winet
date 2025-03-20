winet/
├── backend/
│   ├──config/
│   │   └── db.js
│   ├──controllers/   # funciones que manejan las solicitudes HTTP 
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── clienteWinetController.js
│   │   ├── tiendaController.js
│   │   ├── pagoController.js
│   │   ├── puntoController.js
│   │   └── transaccionPuntoController.js
│   ├──doc/           # Documentación del proyecto
│   ├──middlewares/   # Funciones que tienen acceso al objeto de solicitud (request)
│   │   ├── auth.js
│   │   ├── errorHandler.js
├── ├──models/         # Estructura de datos y la lógica de negocio de la aplicación 
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── clienteWinet.js
│   │   ├── tienda.js
│   │   ├── pago.js
│   │   ├── punto.js
│   │   └── transaccionPunto.js
│   ├──routes/        # Controlador de solicitud entrante basada en el método HTTP 
│   │   ├── userRoutes.js
│   │   ├── clienteWinetRoutes.js
│   │   ├── tiendaRoutes.js
│   │   ├── pagoRoutes.js
│   │   ├── puntoRoutes.js
│   │   └── transaccionPuntoRoutes.js
│   ├──sql/           # Sentencias SQL  
│   ├──utils/
├── .env
├── .gitignore
├── API-RESTFull Winet.json
├── app.js             # Configuración de la aplicación
└── server.js          # Arranque del servidor