const historyService =
    require('../services/employeeDepartmentHistory.service');


const getHistory = async (req, res) => {

    try {

        const history =
            await historyService.getHistory();

        res.status(200).json(history);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Error al obtener el historial'
        });
    }
};

const getEmployeeHistory = async (req, res) => {

    try {

        const { employeeId } = req.params;

        const history =
            await historyService.getEmployeeHistory(employeeId);

        res.status(200).json(history);

    } catch (error) {

        console.error(error);

        if (
            error.message ===
            'No se encontró historial para el empleado'
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al obtener el historial'
        });
    }
};


const assignEmployee = async (req, res) => {

    try {

        const data = req.body;

        const assignment =
            await historyService.assignEmployee(data);

        res.status(201).json({
            message: 'Empleado asignado correctamente',
            assignment
        });

    } catch (error) {

        console.error(error);

        if (
            error.message === 'Empleado no encontrado' ||
            error.message === 'Departamento no encontrado'
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message === 'Todos los campos son requeridos'
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al asignar empleado'
        });
    }
};


const changeDepartment = async (req, res) => {

    try {

        const { employeeId } = req.params;

        const data = req.body;

        const assignment =
            await historyService.changeDepartment(
                employeeId,
                data
            );

        res.status(200).json({
            message: 'Departamento cambiado correctamente',
            assignment
        });

    } catch (error) {

        console.error(error);

        if (
            error.message === 'Empleado no encontrado' ||
            error.message === 'Departamento no encontrado'
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message.includes('requeridos')
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al cambiar departamento'
        });
    }
};



const finishAssignment = async (req, res) => {

    try {

        const { employeeId } = req.params;

        const { endDate } = req.body;

        const result =
            await historyService.finishAssignment(
                employeeId,
                endDate
            );

        res.status(200).json({
            message: 'Asignación finalizada correctamente',
            assignment: result
        });

    } catch (error) {

        console.error(error);

        if (
            error.message === 'Empleado no encontrado'
        ) {
            return res.status(404).json({
                message: error.message
            });
        }

        if (
            error.message === 'endDate es requerido'
        ) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: 'Error al finalizar asignación'
        });
    }
};


module.exports = {
    getHistory,
    getEmployeeHistory,
    assignEmployee,
    changeDepartment,
    finishAssignment
};