const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserId ,getAllUsers} = require('../contorllers/authen_user');

// เส้นทาง API
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:id', getUserId);
router.get('/users', getAllUsers);

module.exports = router;