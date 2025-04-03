// models/stores/Pagos.js
import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_tienda: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tiendas',
      key: 'id'
    }
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clientes_winet',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { 
      min: 0.01,
      isDecimal: true
    }
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagos',
  timestamps: true,
  underscored: true
});

export default Pago;