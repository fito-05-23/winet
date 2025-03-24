import { User, Role } from './index.js'; // Asegúrate de importar los modelos

// Definir las asociaciones
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });
