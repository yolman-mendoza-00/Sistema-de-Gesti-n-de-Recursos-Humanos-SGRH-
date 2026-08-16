const employeeService = require('../services/employee.service');

const getEmployees = async (req, res) => {
    try {
        const employees = await employeeService.getEmployees();

        res.status(200).json(employees);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Error al obtener los empleados'
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await employeeService.getEmployeeById(id);

        res.status(200).json(employee);
    } catch (error) {
        console.error(error);

        if (error.message === 'Empleado no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener el empleado'
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const employee = await employeeService.updateEmployee(id, data);

        res.status(200).json(employee);
    } catch (error) {
        console.error(error);

        if (error.message === 'Empleado no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el empleado'
        });
    }
};

const updateEmployeeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;

        if (typeof active !== 'boolean') {
            return res.status(400).json({
                message: 'El campo active debe ser true o false'
            });
        }

        const employee =
            await employeeService.updateEmployeeStatus(id, active);

        res.status(200).json({
            message: active
                ? 'Empleado activado correctamente'
                : 'Empleado inactivado correctamente',
            employee
        });

    } catch (error) {
        console.error(error);

        if (error.message === 'Empleado no encontrado') {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al actualizar el estado del empleado'
        });
    }
};

module.exports = {
    getEmployees,
    getEmployeeById,
    updateEmployee,
    updateEmployeeStatus
};