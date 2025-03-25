// models/Permission.js (para permisos más granulares)
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Permission = sequelize.define(
  "Permission",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
    description: { type: DataTypes.TEXT },
    resource: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "permissions" }
);

export default Permission;
