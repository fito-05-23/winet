// models/UserSession.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserSession = sequelize.define(
  "UserSession",
  {
    id: {
      /* ... */
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    ip_address: { type: DataTypes.STRING },
    user_agent: { type: DataTypes.TEXT },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  { tableName: "user_sessions" }
);

export default UserSession;