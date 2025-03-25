# Flujo General de los Modelos

1️⃣ **Creación de un Usuario** (Registro)
Cuando un usuario se registra:

Se inserta un nuevo registro en la tabla users con su email, password_hash (cifrado) y otros datos.

Si el usuario tiene un rol asociado (role_id), se asigna en la tabla users.

Si el usuario también es un cliente (en ClienteWinet), se crea un registro en clientes_winet vinculado a su user_id.

🔗 **Relaciones involucradas**:

User ↔ Role (cada usuario pertenece a un rol)

User ↔ ClienteWinet (algunos usuarios pueden ser clientes)

2️⃣ **Inicio de Sesión** (Autenticación)
Cuando un usuario inicia sesión:

Se busca el usuario por su email en la tabla users.

Se compara el password_hash con la contraseña ingresada (usando bcrypt).

Si es exitoso, se genera un token y se guarda en user_sessions junto con la ip_address, user_agent y expires_at.

Se marca la sesión como is_active: true.

🔗 **Relaciones involucradas**:

User ↔ UserSession (un usuario puede tener múltiples sesiones activas)

3️⃣ **Acceso a Recursos Protegidos** (Autorización)
Cuando el usuario intenta acceder a un recurso restringido:

Se obtiene su role_id desde la tabla users.

Se buscan los permissions asociados a ese role_id en role_permissions.

Si el usuario tiene el permiso, se le permite continuar.

Si no tiene el permiso, se le devuelve un error 403 - Forbidden.

🔗 Relaciones involucradas:

Role ↔ Permission (muchos a muchos, usando role_permissions)

4️⃣ **Registro de Actividad**
Cada vez que el usuario realiza una acción importante (ejemplo: cambia su contraseña, actualiza datos):

Se guarda un nuevo registro en user_activities con:

user_id

action (Ejemplo: "Cambio de contraseña")

details (Ejemplo: "El usuario actualizó su contraseña con éxito")

ip_address

🔗 Relaciones involucradas:

User ↔ UserActivity (un usuario tiene múltiples actividades)

5️⃣ **Cierre de Sesión**
Cuando un usuario cierra sesión:

Se busca su token en user_sessions.

Se marca is_active: false y se borra el token.

Opcionalmente, se registra en user_activities la acción de logout.

🔗 Relaciones involucradas:

UserSession (gestiona la sesión del usuario)

6️⃣ **Recuperación de Contraseña**
Si un usuario olvida su contraseña:

Se genera un token y se guarda en password_reset_tokens con user_id y expires_at.

Se envía un correo al usuario con un enlace que contiene el token.

Cuando el usuario ingresa el nuevo password:

Se valida el token (debe existir y no haber expirado).

Se actualiza el password_hash en users.

Se borra el token de password_reset_tokens.

🔗 Relaciones involucradas:

User ↔ PasswordResetToken (un usuario puede tener varios tokens activos)

7️⃣ **Administración de Clientes**
Si un usuario registrado también es un cliente (ClienteWinet):

Se crea un registro en clientes_winet con id_user, nombre, correo, estado, etc.

Se pueden actualizar sus datos (teléfono, dirección, estado).

Si el usuario se desactiva, también puede desactivarse su registro en clientes_winet.

🔗 **Relaciones involucradas:**

User ↔ ClienteWinet (relación uno a uno)

Resumen de Relaciones Clave
User ↔ Role (uno a muchos, un usuario pertenece a un rol).

User ↔ UserSession (uno a muchos, un usuario puede tener varias sesiones).

User ↔ UserActivity (uno a muchos, cada usuario tiene muchas actividades registradas).

Role ↔ Permission (muchos a muchos, los roles pueden tener permisos asignados).

User ↔ PasswordResetToken (uno a muchos, un usuario puede tener varios tokens de recuperación).

User ↔ ClienteWinet (uno a uno, un usuario puede ser cliente).