// models/UserActivity.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserActivity = sequelize.define(
  "UserActivity",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT },
    ip_address: { type: DataTypes.STRING },
  },
  { tableName: "user_activities" }
);

export default UserActivity;
