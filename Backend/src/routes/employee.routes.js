const express = require('express');

const employeeController = require('../controllers/employee.controller');

const router = express.Router();

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.patch('/:id', employeeController.updateEmployee);
router.patch('/:id/status', employeeController.updateEmployeeStatus);

module.exports = router;