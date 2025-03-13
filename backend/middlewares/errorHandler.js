// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Si el error tiene un código de estado (como los errores de Axios), lo usamos; de lo contrario, 500.
  const statusCode = err.response?.status || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Ha ocurrido un error en el servidor',
    detalles: err.response?.data || 'Sin detalles disponibles',
  });
};

export default errorHandler;
