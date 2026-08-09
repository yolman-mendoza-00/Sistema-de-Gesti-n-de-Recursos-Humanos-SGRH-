const departmentRepository = require('../repositories/department.repository');

const getDepartments = async () => {
    return await departmentRepository.getAll();
};

const getDepartmentById = async (id) => {
    const department = await departmentRepository.getById(id);

    if (!department) {
        throw new Error('Departamento no encontrado');
    }

    return department;
};

const updateDepartment = async (id, data) => {
    const department = await departmentRepository.getById(id);

    if (!department) {
        throw new Error('Departamento no encontrado');
    }

    return await departmentRepository.update(id, data);
};

module.exports = {
    getDepartments,
    getDepartmentById,
    updateDepartment
};