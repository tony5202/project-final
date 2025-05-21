const express = require('express');
const router = express.Router();
const stadiumUpload = require('../middlewares/stadium'); 
const { createStadium, getAllStadium, editStadium, deleteStadium,getAllStadiums } = require('../contorllers/stadium');

// Create stadium
router.post('/stadium', stadiumUpload.single('image'), createStadium);

// Get all stadium
router.get('/stadium', getAllStadium);

// Edit stadium
router.put('/stadium/:st_id', stadiumUpload.single('image'), editStadium);

// Delete stadium
router.delete('/stadium/:st_id', deleteStadium);


module.exports = router;
