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
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
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
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Definir la relación con Roles
User.associate = (models) => {
  User.belongsTo(models.Role, {
    foreignKey: 'role_id',
    as: 'role',
    onDelete: 'SET NULL' // Esto coincide con tu FOREIGN KEY en PostgreSQL
  });
};

// Hooks para manejar las fechas
User.beforeCreate((user) => {
  user.created_at = new Date();
  user.updated_at = new Date();
});

User.beforeUpdate((user) => {
  user.updated_at = new Date();
});

export default User;