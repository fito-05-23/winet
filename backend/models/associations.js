import User from './User.js';
import Role from './Role.js';

export function setupAssociations() {
  // Relación User → Role
  User.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'role',
    onDelete: 'SET NULL'
  });

  // Relación Role → User
  Role.hasMany(User, {
    foreignKey: 'role_id',
    as: 'users'
  });

  logger.info('✅ Asociaciones establecidas');
}