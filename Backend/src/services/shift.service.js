const shiftRepository = require('../repositories/shift.repository');

const getShifts = async () => {
    return await shiftRepository.getAll();
};

const updateShift = async (id, data) => {

    const shifts = await shiftRepository.getAll();

    const shiftExists = shifts.some(
        shift => Number(shift.shiftId) === Number(id)
    );

    if (!shiftExists) {
        throw new Error('Turno no encontrado');
    }

    return await shiftRepository.update(id, data);
};

const getEmployeesByShift = async (shiftId) => {

    const shifts = await shiftRepository.getAll();

    const shiftExists = shifts.some(
        shift => Number(shift.shiftId) === Number(shiftId)
    );

    if (!shiftExists) {
        throw new Error('Turno no encontrado');
    }

    return await shiftRepository.getEmployeesByShift(shiftId);
};

const createShift = async (data) => {

    if (!data.name || !data.startTime || !data.endTime) {
        throw new Error(
            'Nombre, hora de inicio y hora de fin son obligatorios'
        );
    }

    if (data.startTime >= data.endTime) {
        throw new Error(
            'La hora de inicio debe ser menor que la hora de fin'
        );
    }

    return await shiftRepository.create(data);
};

module.exports = {
    getShifts,
    updateShift,
    getEmployeesByShift,
    createShift
};