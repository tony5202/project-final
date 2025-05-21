const express = require('express');
const router = express.Router();

const { createExpense, getExpense } = require('../contorllers/expense');

router.post('/expense', createExpense);
router.get('/expenses', getExpense);

module.exports = router;