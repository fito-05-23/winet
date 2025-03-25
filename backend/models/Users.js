// models/User

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
    allowNull: true, // Permite null por el ON DELETE SET NULL
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
  },
  paranoid: true,
  deletedAt: 'deleted_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}, {
  tableName: 'users',
  timestamps: true,
});

export default User;