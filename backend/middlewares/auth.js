// middlewares/auth.js
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
  
    // Aquí deberías verificar el token (por ejemplo, con JWT)
  
    next();
  };
  
  export default authMiddleware;