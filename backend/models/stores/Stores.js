import { DataTypes } from "sequelize";
import sequelize from '../../config/db.js';

const Tienda = sequelize.define('Tienda', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.TEXT
  },
  telefono: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'tiendas',
  timestamps: true
});

export default Tienda;