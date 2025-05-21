const express = require('express');
const router = express.Router();
const { createCheckIn, confirmCheckIn, getAllConfirmedBookings, savePayment ,getAllCheckIns} = require('../contorllers/check_in');

router.post('/checkin', createCheckIn);
router.patch('/checkin/:id/confirm', confirmCheckIn);
router.get('/bookings/confirmed', getAllConfirmedBookings);
router.post('/payment', savePayment);
router.get('/checkin', getAllCheckIns);

module.exports = router;