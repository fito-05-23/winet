// models/association.js
import User from "./users/Users.js";
import Role from "./security/Roles.js";
import PasswordResetToken from "./auth/PasswordResetToken.js";
import ClienteWinet from "./clients/ClienteWinetModel.js";
import Permission from "./security/Permission.js";
import UserSession from "./users/UserSession.js";
import UserActivity from "./users/UserActivity.js";
import logger from "../utils/logger.js";

// En models/association.js
export function setupAssociations() {
  // Relación User ↔ Role (única dirección)
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",  // 🔥 Alias correcto
    onDelete: "SET NULL",
  }); 

  Role.hasMany(User, { 
    foreignKey: "role_id", 
    as: "users"  // También cambia el alias
  }); 

  // Relación User ↔ ClienteWinet
  User.hasOne(ClienteWinet, {
    foreignKey: "id_user",
    as: "userClient", // Alias único
  });

  ClienteWinet.belongsTo(User, {
    foreignKey: "id_user",
    as: "clientUser", // Alias único
  });

  // Relaciones de permisos
  Role.belongsToMany(Permission, {
    through: "RolePermissions",
    foreignKey: "role_id",
    as: "permissions", // Alias único
  });

  Permission.belongsToMany(Role, {
    through: "RolePermissions",
    foreignKey: "permission_id",
    as: "rolesWithPermission", // Alias único
  });

  // Relaciones de sesión y actividad
  User.hasMany(UserSession, {
    foreignKey: "user_id",
    as: "userSessions",
    onDelete: "CASCADE",
  });
  UserSession.belongsTo(User, {
    foreignKey: "user_id",
    as: "userSessionOwner",
    onDelete: "CASCADE",
  });

  UserActivity.belongsTo(User, {
    foreignKey: "user_id",
    as: "activityOwner", // Alias único
  });

  User.hasMany(UserActivity, {
    foreignKey: "user_id",
    as: "userActivities", // Alias único
  });

  // Relación User ↔ PasswordResetToken
  PasswordResetToken.belongsTo(User, {
    foreignKey: "user_id",
    as: "tokenOwner", // Alias único
  });

  User.hasMany(PasswordResetToken, {
    foreignKey: "user_id",
    as: "resetTokens", // Alias único
  });

  logger.info("✅ Asociaciones establecidas");
}
