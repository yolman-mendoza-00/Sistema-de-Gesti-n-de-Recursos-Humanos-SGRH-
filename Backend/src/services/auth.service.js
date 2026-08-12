const bcrypt = require('bcrypt');
const authRepository = require('../repositories/auth.repository');

async function login(email, passwordIngresada) {

    const personaEncontrada =
        await authRepository.buscarUsuarioPorEmail(email);

    if (!personaEncontrada) {
        return {
            ok: false,
            status: 404,
            mensaje: 'Usuario no encontrado'
        };
    }

    // PRIMERO: verificar que sea el responsable de RRHH
    if (personaEncontrada.JobTitle !== 'Human Resources Manager') {
        return {
            ok: false,
            status: 403,
            mensaje: 'No tiene permisos para acceder al sistema'
        };
    }

    // SEGUNDO: verificar contraseña
    const coincide = await bcrypt.compare(
        passwordIngresada,
        personaEncontrada.PasswordHash
    );

    if (!coincide) {
        return {
            ok: false,
            status: 401,
            mensaje: 'Contraseña incorrecta'
        };
    }

    return {
        ok: true,
        status: 200,
        businessEntityId: personaEncontrada.BusinessEntityID,
        nombre: `${personaEncontrada.FirstName} ${personaEncontrada.LastName}`,
        email: personaEncontrada.EmailAddress,
        cargo: personaEncontrada.JobTitle,
        mensaje: 'Login exitoso'
    };
}

module.exports = {
    login
};