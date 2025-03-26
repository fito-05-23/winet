# Flujo General de Gestión Tiendas

**Relaciones**:

Un ClienteWinet tiene muchas Tiendas (hasMany)
Una Tienda pertenece a un ClienteWinet (belongsTo)

**Endpoints Disponibles** Método	Endpoint	Descripción	Roles Permitidos
**POST**	/api/tiendas	Crear nueva tienda	cliente activo
**GET**	/api/tiendas/cliente/:id	Obtener tiendas por cliente	Todos autenticados
**PUT**	/api/tiendas/:id	Actualizar tienda	cliente activo
**DELETE**	/api/tiendas/:id	Eliminar tienda	cliente activo

**Códigos de Respuesta**:
**200**	Operación exitosa
**201**	Tienda creada exitosamente
**400**	Datos de entrada inválidos
**401**	No autenticado
**403**	No tiene permisos
**404**	Cliente/Tienda no encontrada
**500**	Error interno del servidor

**Consideraciones de Seguridad**

**Autenticación:** Todos los endpoints requieren token JWT válido

**Autorización:** Crear/Actualizar: Cliente activo de Mikowish.

**Protección de Datos**: Cada usuario solo puede ver tiendas pero solo los usuarios activos de Mikowish podran crear y gestionar sus tiendas.

**Eliminar**: solo cliente que creo la tienda

**Verificación de Propiedad**: (verifyStoreOwnership) Solo para PUT/DELETE. Verifica que el cliente sea dueño de la tienda.

**Logging**: Todas las operaciones se registran para auditoría