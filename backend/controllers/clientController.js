// controllers/clientController.js
import axios from 'axios';

const getClientStatus = async (req, res) => {
  const { token, idcliente, cedula } = req.body;

  if (!token || !idcliente || !cedula) {
    return res.status(400).json({ error: 'Faltan datos (token, idcliente o cedula)' });
  }

  try {
    const response = await axios.post(process.env.MIKROSYSTEM_API_URL, {
      token,
      idcliente
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error al consultar la API de MikroSystem:', error.message);
    res.status(500).json({ error: 'Error al consultar la API de MikroSystem' });
  }
};

export default { getClientStatus };