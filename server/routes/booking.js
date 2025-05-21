const express = require('express');
const router = express.Router();
const upload = require('../middlewares/slip_payment');
const { createBooking, getAllBookings, checkAvailability, getUserBookings, updateBookingStatus ,getReportBooking} = require('../contorllers/booking');

router.post('/booking', upload.single('image'), createBooking);
router.get('/bookings', getAllBookings);
router.get('/bookings/user/:user_id', getUserBookings);
router.get('/stadium/:st_id/availability', checkAvailability);
router.patch('/booking/:booking_id/status', updateBookingStatus);
router.get('/report-booking', getReportBooking);

module.exports = router;