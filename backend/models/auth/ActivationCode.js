// models/auth/ActivationCode.js
import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const ActivationCode = sequelize.define(
  "ActivationCode",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: { type: DataTypes.STRING(6) },
    expires_at: { type: DataTypes.DATE },
    user_id: { type: DataTypes.INTEGER },
  },
  { tableName: "activation_codes" }
);

export default ActivationCode;
