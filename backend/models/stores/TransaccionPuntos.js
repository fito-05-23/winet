import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const TransaccionPunto = sequelize.define('TransaccionPunto', {
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
  id_tienda: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tiendas',
      key: 'id'
    }
  },
  tipo: {
    type: DataTypes.ENUM('credito', 'debito'),
    allowNull: false
  },
  puntos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { 
      min: 1,
      isInt: true
    }
  }
}, {
  tableName: 'transacciones_puntos',
  timestamps: true,
  underscored: true
});

export default TransaccionPunto;