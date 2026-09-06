const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const employeeRoutes = require('./routes/employee.routes');
const departmentRoutes = require('./routes/department.routes');
const employeeDepartmentHistoryRoutes = require('./routes/employeeDepartmentHistory.routes');
const shiftRoutes = require('./routes/shift.routes');
const jobCandidateRoutes = require('./routes/jobCandidate.routes');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employee-department-history', employeeDepartmentHistoryRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/job-candidates', jobCandidateRoutes);

module.exports = app;