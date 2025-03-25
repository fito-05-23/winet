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
  // Relaciones existentes (User ↔ Role)
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "userAssignedRole",
    onDelete: "SET NULL",
  });
  Role.hasMany(User, { foreignKey: "role_id", as: "roleUsers" });

  // Nueva relación User ↔ ClienteWinet
  User.hasOne(ClienteWinet, { foreignKey: "id_user", as: "cliente" });
  ClienteWinet.belongsTo(User, { foreignKey: "id_user", as: "usuario" });

  // Relaciones de permisos
  Role.belongsToMany(Permission, {
    through: "RolePermissions",
    foreignKey: "role_id",
    as: "rolePermissions",
  });

  Permission.belongsToMany(Role, {
    through: "RolePermissions",
    foreignKey: "permission_id",
  });

  UserSession.belongsTo(User, { foreignKey: "user_id", as: "sessionUser" });
  User.hasMany(UserSession, { foreignKey: "user_id", as: "sessions" });
  
  UserActivity.belongsTo(User, { foreignKey: "user_id", as: "activityUser" });
  User.hasMany(UserActivity, { foreignKey: "user_id", as: "activities" });

  // Relación User ↔ PasswordResetToken (mejor centralizada aquí)
  PasswordResetToken.belongsTo(User, { foreignKey: "user_id", as: "resetUser" });
  User.hasMany(PasswordResetToken, { foreignKey: "user_id", as: "passwordResetTokens" }); 

  logger.info("✅ Asociaciones establecidas");
}
