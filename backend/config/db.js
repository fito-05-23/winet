// config/db.js
import pkg from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const { Sequelize } = pkg;

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres', // Cambia esto si estás usando otro dialecto (e.g., 'mysql', 'sqlite', 'mssql')
  port: process.env.DB_PORT, // Asegúrate de que este puerto sea el correcto para tu base de datos
  logging: false, // Desactiva el registro de consultas SQL en la consola
});

export default sequelize;