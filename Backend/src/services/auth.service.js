const bcrypt = require('bcrypt');
const authRepository = require('../repositories/auth.repository');

async function login(email, passwordIngresada) {
    const personaEncontrada = await authRepository.buscarBusinessEntityIdPorEmail(email);

    if (!personaEncontrada) {
        return { ok: false, status: 404, mensaje: 'Usuario no encontrado' };
    }

    const { BusinessEntityID: businessEntityId } = personaEncontrada;

    const registroPassword = await authRepository.buscarHashPorBusinessEntityId(businessEntityId);

    if (!registroPassword) {
        return { ok: false, status: 404, mensaje: 'Usuario sin credenciales' };
    }

    const coincide = await bcrypt.compare(passwordIngresada, registroPassword.PasswordHash);

    if (!coincide) {
        return { ok: false, status: 401, mensaje: 'Contraseña incorrecta' };
    }

    return { ok: true, status: 200, businessEntityId, mensaje: 'Login exitoso' };
}

module.exports = {
    login,
};