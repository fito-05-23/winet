// models/association.js
import User from "./Users.js";
import Role from "./Roles.js";
import PasswordResetToken from "./PasswordResetToken.js";
import ClienteWinet from "./clienteWinetModel.js";

// En models/association.js
export function setupAssociations() {
  // Relaciones existentes (User ↔ Role)
  User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
    onDelete: "SET NULL",
  });
  Role.hasMany(User, { foreignKey: "role_id", as: "users" });

  // Nueva relación User ↔ ClienteWinet
  User.hasOne(ClienteWinet, { foreignKey: "id_user", as: "cliente" });
  ClienteWinet.belongsTo(User, { foreignKey: "id_user", as: "usuario" });

  // Relación User ↔ PasswordResetToken (mejor centralizada aquí)
  User.hasMany(PasswordResetToken, {
    foreignKey: "user_id",
    as: "passwordResetTokens",
  });
  PasswordResetToken.belongsTo(User, { foreignKey: "user_id", as: "user" });

  Role.belongsToMany(Permission, {
    through: "RolePermissions",
    foreignKey: "role_id",
    as: "permissions",
  });

  Permission.belongsToMany(Role, {
    through: "RolePermissions",
    foreignKey: "permission_id",
    as: "roles",
  });

  logger.info("✅ Asociaciones establecidas");
}
