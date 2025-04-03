// models/association.js
import User from "./users/Users.js";
import Role from "./security/Roles.js";
import PasswordResetToken from "./auth/PasswordResetToken.js";
import ClienteWinet from "./clients/ClienteWinetModel.js";
import Permission from "./security/Permission.js";
import UserSession from "./users/UserSession.js";
import UserActivity from "./users/UserActivity.js";
import Tienda from "./stores/Stores.js";
import Punto from "./stores/Puntos.js";
import Pago from "./stores/Pagos.js";
import TransaccionPunto from "./stores/TransaccionPuntos.js";
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
    through: "role_permissions",
    foreignKey: "role_id",
    as: "permissions", // Alias único
  });

  Permission.belongsToMany(Role, {
    through: "role_permissions",
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

    // Relación ClienteWinet ↔ Tienda
    ClienteWinet.hasMany(Tienda, {
      foreignKey: 'id_cliente',
      as: 'tiendas',
      onDelete: 'CASCADE'
    });
    
    Tienda.belongsTo(ClienteWinet, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });

   // Relación Tienda ↔ Pago
   Tienda.hasMany(Pago, {
    foreignKey: 'id_tienda',
    as: 'pagos',
    onDelete: 'CASCADE'
  });
  
  Pago.belongsTo(Tienda, {
    foreignKey: 'id_tienda',
    as: 'tienda'
  });

  // Relación ClienteWinet ↔ Pago (como pagador)
  ClienteWinet.hasMany(Pago, {
    foreignKey: 'id_cliente',
    as: 'pagos_realizados',
    onDelete: 'CASCADE'
  });
  
  Pago.belongsTo(ClienteWinet, {
    foreignKey: 'id_cliente',
    as: 'cliente_pagador'
  });

  // Relación ClienteWinet ↔ Punto (Uno a Uno)
  ClienteWinet.hasOne(Punto, {
    foreignKey: 'id_cliente',
    as: 'puntos',
    onDelete: 'CASCADE'
  });
  
  Punto.belongsTo(ClienteWinet, {
    foreignKey: 'id_cliente',
    as: 'cliente'
  });

  // Relación ClienteWinet ↔ TransaccionPunto
  ClienteWinet.hasMany(TransaccionPunto, {
    foreignKey: 'id_cliente',
    as: 'transacciones_puntos',
    onDelete: 'CASCADE'
  });
  
  TransaccionPunto.belongsTo(ClienteWinet, {
    foreignKey: 'id_cliente',
    as: 'cliente'
  });

  // Relación Tienda ↔ TransaccionPunto
  Tienda.hasMany(TransaccionPunto, {
    foreignKey: 'id_tienda',
    as: 'transacciones_puntos',
    onDelete: 'CASCADE'
  });
  
  TransaccionPunto.belongsTo(Tienda, {
    foreignKey: 'id_tienda',
    as: 'tienda'
  });

  logger.info("✅ Asociaciones establecidas");
}
