const authService = require('../services/auth.service');

async function loginController(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            mensaje: 'Email y contraseña son requeridos'
        });
    }

    try {
        const resultado = await authService.login(email, password);

        if (!resultado.ok) {
            return res.status(resultado.status).json({
                mensaje: resultado.mensaje
            });
        }

        return res.status(200).json({
            mensaje: resultado.mensaje,
            businessEntityId: resultado.businessEntityId,
            nombre: resultado.nombre,
            email: resultado.email,
            cargo: resultado.cargo
        });

    } catch (error) {
        console.error('Error en login:', error);

        return res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
}

module.exports = {
    loginController
};