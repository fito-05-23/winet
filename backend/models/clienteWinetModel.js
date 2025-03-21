import pool from '../config/db.js';

// Crear un nuevo cliente en la tabla clientes_winet
export const createClienteWinet = async (clienteData) => {
  const {
    id_user,
    nombre,
    estado,
    correo,
    telefono,
    movil,
    cedula,
    pasarela,
    codigo,
    direccion_principal,
  } = clienteData;

  try {
    const newCliente = await pool.query(
      `INSERT INTO clientes_winet (
        id_user, nombre, estado, correo, telefono, movil, cedula, pasarela, codigo, direccion_principal
      ) VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10) RETURNING *`,
      [id_user, nombre, estado, correo, telefono, movil, cedula, pasarela, codigo, direccion_principal]
    );

    return newCliente.rows[0];
  } catch (error) {
    throw error;
  }
};