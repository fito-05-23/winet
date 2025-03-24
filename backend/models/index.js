import sequelize from '../config/db.js';
import User from './User.js';
import Role from './Role.js';

// Configuración de relaciones
function setupAssociations() {
  User.belongsTo(Role, { foreignKey: 'role_id', as: 'role', onDelete: 'SET NULL' });
  Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
}

// Exportaciones nombradas
export {
  sequelize,
  User,
  Role,
  setupAssociations
};

// Opcional: Exportación por defecto
export default {
  sequelize,
  User,
  Role,
  setupAssociations
};