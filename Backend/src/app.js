const express = require('express');
const cors = require('cors');

const employeeRoutes = require('./routes/employee.routes');
const departmentRoutes = require('./routes/department.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

module.exports = app;