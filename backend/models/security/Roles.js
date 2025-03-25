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
  },
  createdAt: 'created_at',
  updatedAt: 'updated_at',
}, {
  tableName: 'roles',
  timestamps: true,
});

export default Role;