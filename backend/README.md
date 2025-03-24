# Winet backend

# Configuración de Módulos ES6

Este proyecto utiliza módulos **ES6** para gestionar las importaciones y exportaciones de código JavaScript. Esto se configura mediante la propiedad "type": "module" en el archivo package.json. A continuación, se detalla cómo funciona y por qué se ha elegido esta configuración.

# IMPORTANTE
Se usa las convenciones de nomenclatura de Sequelize, que incluyen el uso de nombres en plural para las tablas y nombres en singular para los modelos.

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

![Important]
# Arquitectura de Modelos en Sequelize

**Modelos Individuales:** User.js, Role.js, ClientesWinet.js etc.
**Propósito**: Definir la estructura de cada tabla en la base de datos.

**Relaciones entre Modelos:** associations.js 
**Propósito**: Establecer cómo se relacionan los modelos entre sí.

**Punto de Entrada Central:** index.js
**Propósito**: Agrupar todos los modelos y configuraciones para fácil acceso.

**Uso de los Modelos:** server.js
**Inicialización:**
server.js importa los modelos y configuraciones
Establece la conexión a la base de datos
Configura las relaciones entre modelos

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


**Solicitud de Activación de Cuenta**

**1**. El usuario envía una solicitud a la ruta /activate-account con los siguientes datos:
**email**: Correo electrónico del usuario.
**idcliente**: Identificador del cliente en el sistema MikroSystem.

**2**. Validación de la Solicitud
El servidor valida que los campos email e idcliente estén presentes y sean válidos.
Si la validación falla, se devuelve un error con los detalles de la validación.

**3**. Búsqueda del Usuario
El servidor busca al usuario en la tabla users usando el correo electrónico (email).
Si el usuario no existe, se devuelve un error 404 indicando que el usuario no fue encontrado.

**4**. Verificación de Activación Previa
El servidor verifica si el usuario ya tiene activate_account = TRUE.
Si la cuenta ya está activada, se devuelve un error 400 indicando que la cuenta ya está activa.

**5**. Consulta a la API de MikroSystem
El servidor realiza una solicitud POST a la API de MikroSystem para obtener los detalles del cliente usando el idcliente.
La URL de la API se construye utilizando las variables de entorno MIKROSYSTEM_API y DETAILS_CLIENTS.
El cuerpo de la solicitud incluye:
token: Token de autenticación para la API de MikroSystem (obtenido de las variables de entorno).
idcliente: Identificador del cliente proporcionado por el usuario.

**6**. Verificación de la Respuesta de MikroSystem
El servidor verifica si la respuesta de la API de MikroSystem tiene estado: "exito".
Si la respuesta no es exitosa, se devuelve un error 400 indicando que no se pudo activar la cuenta.

**7**. Mapeo de Datos del Cliente
El servidor toma los datos del cliente de la respuesta de MikroSystem y los mapea a la estructura de la tabla clientes_winet.
Los campos se mapean de la siguiente manera:
**nombre**: Nombre del cliente.
**estado**: Se convierte a 'activo' o 'inactivo' según el valor de estado en la respuesta de MikroSystem.
**correo**: Correo electrónico del cliente (si no hay correo, se usa una cadena vacía).
**telefono**: Teléfono del cliente.
**movil**: Móvil del cliente.
**cedula**: Cédula del cliente.
**pasarela**: Pasarela del cliente (si no hay pasarela, se usa una cadena vacía).
**codigo**: Código del cliente.
**direccion_principal**: Dirección principal del cliente.

**8**. Creación del Cliente en clientes_winet
El servidor utiliza el modelo createClienteWinet para insertar los datos del cliente en la tabla clientes_winet.
Si la inserción es exitosa, se devuelve el cliente creado.

**9**. Activación de activate_account
El servidor actualiza la tabla users para establecer activate_account = TRUE para el usuario.
Esto indica que la cuenta del usuario ha sido activada correctamente.

**10**. Respuesta al Usuario
El servidor devuelve una respuesta JSON con:
Un mensaje de éxito: "Cuenta activada con éxito. Cliente creado.".
Los datos del cliente creado en la tabla clientes_winet.

# REESTABLECER CONTRASEÑA

**Flujo General de Restablecimiento de Contraseña**

**1**. **Solicitud de Restablecimiento:** El usuario solicita el restablecimiento de su contraseña proporcionando su correo electrónico.

**2**. Generación y Almacenamiento de Token: Se genera un token de restablecimiento único y se almacena en la base de datos asociado al usuario.

**3**. **Envío de Correo de Restablecimiento:** Se envía un correo electrónico al usuario con un enlace que contiene el token.

**4**. **Confirmación de Restablecimiento:** El usuario accede al enlace, proporciona una nueva contraseña y confirma el cambio.

**5**. **Actualización de Contraseña:** La contraseña del usuario se actualiza en la base de datos.