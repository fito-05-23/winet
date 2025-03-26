// controllers/auth/passwordResetController.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../../models/users/Users.js";
import PasswordResetToken from "../../models/auth/PasswordResetToken.js";
import logger from "../../utils/logger.js";

// Solicitar restablecimiento de contraseña
export const handlePasswordResetRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    // En requestPasswordReset, diferenciar errores
    if (!user) {
      // No revelar que el email no existe por seguridad
      return res.status(200).json({
        message:
          "Si el email existe, recibirás un enlace para resetear tu contraseña",
      });
    }

    // Eliminar tokens anteriores del usuario
    await PasswordResetToken.destroy({ where: { user_id: user.id } });

    // Generar un nuevo token de restablecimiento
    const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, {
      expiresIn: "1h",
    });
    await PasswordResetToken.create({
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 3600000),
    });

    res.json({
      message:
        "Solicitud de restablecimiento de contraseña enviada. Revisa tu correo.",
      token,
    });
  } catch (error) {
    logger.error(
      "Error en la solicitud de restablecimiento de contraseña:",
      error
    );
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Confirmar restablecimiento de contraseña
export const processPasswordReset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, newPassword } = req.body;

  try {
    // Verificar el token con un try-catch para manejar errores
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si el token existe en la base de datos
    const resetToken = await PasswordResetToken.findOne({
      where: { token, user_id: user.id },
    });
    if (!resetToken) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Verificar si la nueva contraseña es distinta de la actual
    const passwordMatch = bcrypt.compareSync(newPassword, user.password_hash);
    if (passwordMatch) {
      return res.status(400).json({
        message: "La nueva contraseña no puede ser igual a la anterior",
      });
    }

    // Hashear y actualizar la contraseña
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // En confirmPasswordReset, agregar verificación de expiración
    if (resetToken.expires_at < new Date()) {
      await resetToken.destroy();
      return res.status(400).json({ message: "Token expirado" });
    }

    res.json({ message: "Contraseña restablecida con éxito" });
  } catch (error) {
    logger.error(
      "Error en la confirmación de restablecimiento de contraseña:",
      error
    );
    res.status(500).json({ message: "Error en el servidor" });
  }
};
