# Winet backend

# Configuración de Módulos ES6

Este proyecto utiliza módulos **ES6** para gestionar las importaciones y exportaciones de código JavaScript. Esto se configura mediante la propiedad "type": "module" en el archivo package.json. A continuación, se detalla cómo funciona y por qué se ha elegido esta configuración.

# Configuración del Proyecto

**express**: Framework para crear la API.

**pg**: Librería para conectarse a PostgreSQL.

**sequelize**: ORM para interactuar con la base de datos.

**cors**: Middleware para permitir solicitudes CORS.

**body-parser**: Middleware para parsear el cuerpo de las solicitudes.

**nodemon**: Herramienta para reiniciar automáticamente el servidor durante el desarrollo.

**zod**: Biblioteca de validación de esquemas para TypeScript y JavaScript.

**JWT**: para autenticación (jsonwebtoken).

**bcrypt**: para el hash de contraseñas.

**express-validator**: para validaciones.

**helmet**: Para mejorar la seguridad de la API.


**Se validan los datos de entrada en routes/auth.js con express-validator.**
✅ Si hay errores, se devuelven antes de ejecutar la lógica.
✅ Se mantiene todo seguro con bcrypt y JWT.
✅ Ahora los registros y logins están mejor protegidos.

Con esta mejora, evitamos que usuarios ingresen datos incorrectos, lo que previene errores y posibles vulnerabilidades. 🚀

**Resumen del Flujo**

1.**Registro**: El usuario se registra con is_active = FALSE.

2.**Activación**: El usuario activa su cuenta usando un código de activación.

3.**Inicio de Sesión**: El usuario inicia sesión solo si su cuenta está activa.

4.**Refresco de Token**: El usuario puede refrescar su token de acceso.

5.**Revisión de Perfil**: El usuario puede ver su perfil si está autenticado y tiene un rol válido.


