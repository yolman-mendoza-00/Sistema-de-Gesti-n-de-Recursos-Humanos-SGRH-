const employeeRepository = require('../repositories/employee.repository');

const getEmployees = async () => {
    return await employeeRepository.getAll();
};

const getEmployeeById = async (id) => {
    const employee = await employeeRepository.getById(id);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }

    return employee;
};

const updateEmployee = async (id, data) => {
    const employee = await employeeRepository.getById(id);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }

    return await employeeRepository.update(id, data);
};

const updateEmployeeStatus = async (id, active) => {
    const employee = await employeeRepository.getById(id);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }

    return await employeeRepository.updateStatus(id, active);
};

module.exports = {
    getEmployees,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus
};