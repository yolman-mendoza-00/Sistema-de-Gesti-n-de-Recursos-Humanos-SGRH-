const shiftService = require('../services/shift.service');

const getShifts = async (req, res) => {
    try {
        const shifts = await shiftService.getShifts();

        res.status(200).json(shifts);
    } catch (error) {
        console.error('Error al obtener los turnos:', error);

        res.status(500).json({
            message: 'Error al obtener los turnos'
        });
    }
};

const updateShift = async (req, res) => {
    try {
        const { id } = req.params;
        const { startTime, endTime } = req.body;

        if (!startTime || !endTime) {
            return res.status(400).json({
                message: 'startTime y endTime son obligatorios'
            });
        }

        const shift = await shiftService.updateShift(id, {
            startTime,
            endTime
        });

        res.status(200).json({
            message: 'Turno actualizado correctamente',
            shift
        });

    } catch (error) {
        console.error('Error al actualizar el turno:', error);

        if (error.message === 'Turno no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el turno'
        });
    }
};
const getEmployeesByShift = async (req, res) => {
    try {
        const { id } = req.params;

        const employees = await shiftService.getEmployeesByShift(id);

        res.status(200).json(employees);

    } catch (error) {
        console.error('Error al obtener los empleados del turno:', error);

        if (error.message === 'Turno no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener los empleados del turno'
        });
    }
};

const createShift = async (req, res) => {
    try {
        const { name, startTime, endTime } = req.body;

        const shift = await shiftService.createShift({
            name,
            startTime,
            endTime
        });

        res.status(201).json({
            message: 'Turno creado correctamente',
            shift
        });

    } catch (error) {
        console.error('Error al crear el turno:', error);

        if (
            error.message === 'Nombre, hora de inicio y hora de fin son obligatorios' ||
            error.message === 'La hora de inicio debe ser menor que la hora de fin'
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al crear el turno'
        });
    }
};

module.exports = {
    getShifts,
    updateShift,
    getEmployeesByShift,
    createShift
};