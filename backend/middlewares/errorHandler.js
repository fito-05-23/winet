// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Si el error tiene un código de estado, lo usamos; de lo contrario, 500.
  const statusCode = err.status || 500;
  
  res.status(statusCode).json({
    error: err.message || 'Ha ocurrido un error en el servidor',
    detalles: err.stack || 'Sin detalles disponibles',
  });
};

export default errorHandler;

