const express = require('express');
const router = express.Router();

const {
    getShifts,
    updateShift,
    getEmployeesByShift,
    createShift
} = require('../controllers/shift.controller');

router.get('/', getShifts);
router.post('/', createShift);
router.patch('/:id', updateShift);
router.get('/:id/employees', getEmployeesByShift);

module.exports = router;