import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

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
  idcliente: {
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
}, {
  tableName: 'clientes_winet',
  timestamps: true, 
  underscored: true,  // 🔹 Sequelize manejará created_at y updated_at automáticamente
});

export default ClienteWinet;
