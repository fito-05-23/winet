// models/index.js
import sequelize from './config/db.js';
import { setupAssociations } from './associations.js';

import User from './User.js';
import Role from './Role.js';
import ClienteWinet from './ClienteWinet.js';
import PasswordResetToken from './PasswordResetToken.js';
import UserSession from './UserSession.js';
import UserActivity from './UserActivity.js';
import Permission from './Permission.js';

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