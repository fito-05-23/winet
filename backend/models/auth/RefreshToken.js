// models/auth/RefreshToken.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const RefreshToken = sequelize.define(
  "RefreshToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: { type: DataTypes.STRING, unique: true },
    expires_at: { type: DataTypes.DATE },
    user_id: { type: DataTypes.INTEGER },
  },
  { tableName: "refresh_tokens" }
);

export default RefreshToken;
