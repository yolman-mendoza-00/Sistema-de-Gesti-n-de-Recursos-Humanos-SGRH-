const departmentService = require('../services/department.service');

const getDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getDepartments();

        res.status(200).json(departments);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al obtener los departamentos'
        });
    }
};

const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await departmentService.getDepartmentById(id);

        res.status(200).json(department);
    } catch (error) {
        console.error(error);

        if (error.message === 'Departamento no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener el departamento'
        });
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const department =
            await departmentService.updateDepartment(id, data);

        res.status(200).json(department);
    } catch (error) {
        console.error(error);

        if (error.message === 'Departamento no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el departamento'
        });
    }
};

module.exports = {
    getDepartments,
    getDepartmentById,
    updateDepartment
};