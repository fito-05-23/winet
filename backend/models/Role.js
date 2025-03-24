// models/Roles.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Roles',
  timestamps: false,
});

Role.associate = (models) => {
  Role.hasMany(models.User, {
    foreignKey: 'role_id',
    as: 'users'
  });
};

Role.beforeCreate((role) => {
  role.created_at = new Date();
  role.updated_at = new Date();
});

Role.beforeUpdate((role) => {
  role.updated_at = new Date();
});

export default Role;