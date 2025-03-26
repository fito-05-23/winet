// models/securuty/Roles.js

import { DataTypes } from "sequelize";
import sequelize from '../../config/db.js';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true, // Sequelize manejará created_at y updated_at automáticamente
});

export default Role;
