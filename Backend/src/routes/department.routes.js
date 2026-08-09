const express = require('express');

const departmentController = require('../controllers/department.controller');

const router = express.Router();

router.get('/', departmentController.getDepartments);
router.get('/:id', departmentController.getDepartmentById);
router.patch('/:id', departmentController.updateDepartment);

module.exports = router;