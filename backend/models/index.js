// models/index.js
import sequelize from '../config/db.js';
import { setupAssociations } from './associations.js';

import User from './users/Users.js';
import Role from './security/Roles.js';
import ClienteWinet from './clients/ClienteWinetModel.js';
import PasswordResetToken from './auth/PasswordResetToken.js';
import UserSession from './users/UserSession.js';
import UserActivity from './users/UserActivity.js';
import Permission from './security/Permission.js';

const models = {
  User,
  Role,
  ClienteWinet,
  PasswordResetToken,
  UserSession,
  UserActivity,
  Permission
};

// Establecer relaciones
setupAssociations();

export { sequelize, models };