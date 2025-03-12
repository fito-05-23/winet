// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ha ocurrido un error en el servidor' });
  };
  
  export default errorHandler;