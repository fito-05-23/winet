// models/PasswordResetToken.js
import { DataTypes } from "sequelize";
import sequelize from '../../config/db.js';

const PasswordResetToken = sequelize.define(
  "PasswordResetToken",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      index: true,
    },
  },
  {
    tableName: 'password_reset_tokens',
    timestamps: true,
  }
);

export default PasswordResetToken;
