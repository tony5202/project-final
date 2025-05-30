const express = require('express');
const router = express.Router();
const stadiumUpload = require('../middlewares/stadium');
const { createStadium, getAllStadium, editStadium, disableStadium, reactivateStadium } = require('../contorllers/stadium');

// Create stadium
router.post('/stadium', stadiumUpload.single('image'), createStadium);

// Get all active stadiums
router.get('/stadium', getAllStadium);

// Edit stadium
router.put('/stadium/:st_id', stadiumUpload.single('image'), editStadium);

// Disable stadium
router.put('/stadium/disable/:st_id', disableStadium);

// Reactivate stadium (optional)
router.put('/stadium/reactivate/:st_id', reactivateStadium);

module.exports = router;