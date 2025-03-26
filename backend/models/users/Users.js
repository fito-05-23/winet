// models/users/Users.js  

import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    index: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [60, 255], // Un hash bcrypt es de 60 caracteres
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'email',
  },
  provider_id: {
    type: DataTypes.STRING,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  activate_account: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Para el soft delete
  deletedAt: 'deleted_at',
  underscored: true, // 🔹 Sequelize manejará created_at y updated_at automáticamente
});

export default User;
