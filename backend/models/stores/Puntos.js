// models/points/Puntos.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Punto = sequelize.define('Punto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes_winet',
      key: 'id'
    }
  },
  puntos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { 
      min: 0,
      isInt: true
    }
  }
}, {
  tableName: 'puntos',
  timestamps: true,
  underscored: true
});

export default Punto;