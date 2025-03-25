// models/ClienteWinet.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ClienteWinet = sequelize.define('ClienteWinet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['activo', 'inactivo', 'suspendido']],
    },
  },
  correo: {
    type: DataTypes.STRING,
  },
  telefono: {
    type: DataTypes.STRING,
  },
  movil: {
    type: DataTypes.STRING,
  },
  cedula: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  pasarela: {
    type: DataTypes.STRING,
  },
  codigo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  direccion_principal: {
    type: DataTypes.TEXT,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'clientes_winet',
  timestamps: false, // Desactiva los campos createdAt y updatedAt automáticos de Sequelize
  // Si deseas usar los campos created_at y updated_at personalizados, puedes usar hooks para manejarlos
  // o configurar Sequelize para usar tus propios nombres de columna
});

// Sincronizar los campos created_at y updated_at personalizados
ClienteWinet.beforeCreate((cliente, options) => {
  cliente.created_at = new Date();
  cliente.updated_at = new Date();
});

ClienteWinet.beforeUpdate((cliente, options) => {
  cliente.updated_at = new Date();
});

export default ClienteWinet;