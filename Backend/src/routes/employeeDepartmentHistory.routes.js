const express = require('express');

const router = express.Router();

const {
    getHistory,
    getEmployeeHistory,
    assignEmployee,
    changeDepartment,
    finishAssignment
} = require('../controllers/employeeDepartmentHistory.controller');


router.get('/', getHistory);
router.get('/:employeeId', getEmployeeHistory);
router.post('/', assignEmployee);
router.patch('/:employeeId', changeDepartment);
router.patch('/:employeeId/finish', finishAssignment);


module.exports = router;