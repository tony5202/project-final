const express = require('express');
const router = express.Router();
const { loginAdmin } = require('../contorllers/authen_admin');

// เส้นทาง API

router.post('/loginAdmin', loginAdmin);

module.exports = router;