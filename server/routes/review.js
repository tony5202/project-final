const express = require('express');
const router = express.Router();
const { createReview, getReview } = require('../contorllers/review'); // ແກ້ໄຂສະກົດຈາກ contorllers ເປັນ controllers

router.post('/review', createReview);
router.get('/review', getReview);

module.exports = router;