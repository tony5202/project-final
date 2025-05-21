const express = require('express');
const router = express.Router();
const { createEmployy, getEmployees, editEmployee, deleteEmployee } = require('../contorllers/employee');

// Create a new employee
router.post('/employee', createEmployy);

// Get all employees
router.get('/employee', getEmployees);

// Update an employee
router.put('/employee/:emp_id', editEmployee);

// Delete an employee
router.delete('/employee/:emp_id', deleteEmployee);

module.exports = router;