const historyRepository = require('../repositories/employeeDepartmentHistory.repository');
const employeeRepository = require('../repositories/employee.repository');
const departmentRepository = require('../repositories/department.repository');


const getHistory = async () => {
    return await historyRepository.getAll();
};


const getEmployeeHistory = async (employeeId) => {

    const history =
        await historyRepository.getByEmployeeId(employeeId);

    if (history.length === 0) {
        throw new Error('No se encontró historial para el empleado');
    }

    return history;
};


const assignEmployee = async (data) => {

    const {
        employeeId,
        departmentId,
        shiftId,
        startDate
    } = data;


    if (
        !employeeId ||
        !departmentId ||
        !shiftId ||
        !startDate
    ) {
        throw new Error('Todos los campos son requeridos');
    }

    const employee =
        await employeeRepository.getById(employeeId);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }


    const department =
        await departmentRepository.getById(departmentId);

    if (!department) {
        throw new Error('Departamento no encontrado');
    }

    return await historyRepository.create(data);
};



const changeDepartment = async (employeeId, data) => {

    const {
        departmentId,
        shiftId,
        startDate
    } = data;


    if (
        !departmentId ||
        !shiftId ||
        !startDate
    ) {
        throw new Error(
            'departmentId, shiftId y startDate son requeridos'
        );
    }


    const employee = await employeeRepository.getById(employeeId);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }

    const department = await departmentRepository.getById(departmentId);

    if (!department) {
        throw new Error('Departamento no encontrado');
    }


    // Cambiar departamento
    return await historyRepository.changeDepartment(
        employeeId,
        data
    );
};


const finishAssignment = async (employeeId, endDate) => {

    if (!endDate) {
        throw new Error('endDate es requerido');
    }

    const employee =
        await employeeRepository.getById(employeeId);

    if (!employee) {
        throw new Error('Empleado no encontrado');
    }

    return await historyRepository.closeCurrentAssignment(
        employeeId,
        endDate
    );
};


module.exports = {
    getHistory,
    getEmployeeHistory,
    assignEmployee,
    changeDepartment,
    finishAssignment
};