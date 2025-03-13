// controllers/clientController.js
import axios from 'axios';

const getClientStatus = async (req, res, next) => {
  console.log('Solicitud recibida:', req.method, req.url);  // 👈 Log de la solicitud
  console.log('Body recibido:', req.body);  // 👈 Log del body de la solicitud
  console.log('URL de la API externa:', process.env.MIKROSYSTEM_API);

  const { token, idcliente } = req.body;

  if (!token || !idcliente) {
    console.log('❌ Faltan datos en la solicitud');
    return res.status(400).json({ error: 'Faltan datos (token, idcliente)' });
  }

  try {
    const response = await axios.post(process.env.MIKROSYSTEM_API_GET_CLIENTS_DETAILS, {
      token: process.env.TOKEN_MIKROSYSTEM,  
      idcliente
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('✅ Respuesta de MikroSystem:', response.data);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ Error en la API de MikroSystem:', error.message);
    next(error);
  }
};

export default { getClientStatus };
