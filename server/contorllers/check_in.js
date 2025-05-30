const db = require('../config/connect_DB');

// Create a check-in request
exports.createCheckIn = async (req, res) => {
  try {
    const { booking_id, user_id, st_id } = req.body;

    // Validate required fields
    if (!booking_id || !user_id || !st_id) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ booking_id, user_id, ແລະ st_id' });
    }

    // Validate user and stadium
    const [user] = await db.promise().query('SELECT id FROM User WHERE id = ?', [user_id]);
    const [stadium] = await db.promise().query('SELECT st_id FROM Stadium WHERE st_id = ?', [st_id]);
    if (!user.length || !stadium.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບຜູ້ໃຊ້ ຫຼື ສະໜາມ' });
    }

    // Validate booking exists and is confirmed
    const [booking] = await db.promise().query(
      'SELECT booking_id, user_id, st_id, booking_date, start_time, status, price, pre_pay, booking_type FROM Booking WHERE booking_id = ? AND user_id = ? AND st_id = ? AND status = ?',
      [booking_id, user_id, st_id, 'confirmed']
    );
    console.log('ການກວດສອບການຈອງ:', booking);
    if (!booking.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງທີ່ໄດ້ຮັບການຢືນຢັນ ຫຼື ຂໍ້ມູນບໍ່ຖືກຕ້ອງ' });
    }

    // Validate check-in date (must be on booking_date)
    const now = new Date();
    const bookingDate = new Date(booking[0].booking_date);
    const isSameDay =
      now.getFullYear() === bookingDate.getFullYear() &&
      now.getMonth() === bookingDate.getMonth() &&
      now.getDate() === bookingDate.getDate();
      // ຟັງຊັນເຊັກ ໝົດມື້
    // if (!isSameDay) {
    //   return res.status(400).json({ msg: 'ບໍ່ສາມາດແຈ້ງເຂົ້າໄດ້ ເນື່ອງຈາກບໍ່ຢູ່ໃນວັນທີ່ຈອງ' });
    // }

    // For Football bookings, validate check-in time must be before start_time
    if (booking[0].booking_type === 'Football') {
      const startTime = new Date(booking[0].start_time);
      if (now >= startTime) {
        return res.status(400).json({ msg: 'ບໍ່ສາມາດແຈ້ງເຂົ້າໄດ້ ເນື່ອງຈາກເລີຍເວລາເລີ່ມຕົ້ນການຈອງ' });
      }
    }
    // For Event bookings, no time validation is needed as long as it's on the booking date

    // Check for duplicate check-in
    const [existingCheckIn] = await db.promise().query('SELECT * FROM CheckIn WHERE book_id = ?', [booking_id]);
    console.log('ການແຈ້ງເຂົ້າທີ່ມີຢູ່:', existingCheckIn);
    if (existingCheckIn.length) {
      return res.status(400).json({ msg: 'ການຈອງນີ້ໄດ້ແຈ້ງເຂົ້າແລ້ວ' });
    }

    // Insert check-in record
    const query = 'INSERT INTO CheckIn (book_id, st_id, checkin_date) VALUES (?, ?, ?)';
    const values = [booking_id, st_id, now];
    const [result] = await db.promise().query(query, values);

    return res.status(201).json({
      msg: 'ແຈ້ງເຂົ້າສະໜາມສຳເລັດ',
      checkin_id: result.insertId,
      checkin: { book_id: booking_id, st_id, checkin_date: now }
    });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການແຈ້ງເຂົ້າ:', error.message, error.stack);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ', error: error.message });
  }
};

// Confirm check-in and update booking status to completed
exports.confirmCheckIn = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate check-in ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ checkin_id ທີ່ຖືກຕ້ອງ' });
    }

    // Check if check-in exists
    const [checkIn] = await db.promise().query('SELECT * FROM CheckIn WHERE id = ?', [id]);
    console.log('ບັນທຶກການແຈ້ງເຂົ້າ:', checkIn);
    if (!checkIn.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບຂໍ້ມູນການແຈ້ງເຂົ້າ' });
    }

    const booking_id = checkIn[0].book_id;

    // Check if booking exists and is confirmed
    const [booking] = await db.promise().query('SELECT * FROM Booking WHERE booking_id = ? AND status = ?', [booking_id, 'confirmed']);
    console.log('ການຈອງສຳລັບການຢືນຢັນ:', booking);
    if (!booking.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງທີ່ໄດ້ຮັບການຢືນຢັນ' });
    }

    // Update booking status to completed
    const updateQuery = 'UPDATE Booking SET status = ? WHERE booking_id = ?';
    await db.promise().query(updateQuery, ['completed', booking_id]);

    // Fetch updated booking
    const [updatedBooking] = await db.promise().query(
      `SELECT 
         b.booking_id AS id, 
         b.user_id, 
         b.st_id, 
         b.start_time, 
         b.end_time,
         CONCAT(TIME_FORMAT(b.start_time, '%H:%i'), '-', TIME_FORMAT(b.end_time, '%H:%i')) AS time_slot,
         b.price, 
         b.status, 
         b.pre_pay, 
         b.post_pay, 
         b.slip_payment, 
         b.booking_type, 
         b.booking_date,
         s.dtail AS stadium_dtail, 
         u.name AS user_name
       FROM Booking b
       JOIN Stadium s ON b.st_id = s.st_id
       JOIN User u ON b.user_id = u.id
       WHERE b.booking_id = ?`,
      [booking_id]
    );

    return res.status(200).json({
      msg: 'ຢືນຢັນການແຈ້ງເຂົ້າສະໜາມສຳເລັດ',
      booking: {
        id: updatedBooking[0].id,
        user_id: updatedBooking[0].user_id,
        user_name: updatedBooking[0].user_name,
        st_id: updatedBooking[0].st_id,
        stadium_dtail: updatedBooking[0].stadium_dtail,
        start_time: updatedBooking[0].start_time,
        end_time: updatedBooking[0].end_time,
        time_slot: updatedBooking[0].time_slot,
        price: Number(updatedBooking[0].price),
        status: updatedBooking[0].status,
        pre_pay: Number(updatedBooking[0].pre_pay),
        post_pay: Number(updatedBooking[0].post_pay || 0),
        slip_payment: updatedBooking[0].slip_payment
          ? `${req.protocol}://${req.get('host')}/slip_payment/${updatedBooking[0].slip_payment}`
          : null,
        booking_type: updatedBooking[0].booking_type,
        booking_date: updatedBooking[0].booking_date
      }
    });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການແຈ້ງເຂົ້າ:', error.message, error.stack);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ', error: error.message });
  }
};

// Get all confirmed bookings
exports.getAllConfirmedBookings = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.booking_id AS id, 
        b.user_id, 
        b.st_id, 
        b.start_time, 
        b.end_time,
        CONCAT(TIME_FORMAT(b.start_time, '%H:%i'), '-', TIME_FORMAT(b.end_time, '%H:%i')) AS time_slot,
        b.price, 
        b.status, 
        b.pre_pay, 
        b.post_pay, 
        b.slip_payment, 
        b.booking_type, 
        DATE_FORMAT(b.booking_date, '%d/%m/%Y') AS booking_date,
        s.dtail AS stadium_dtail, 
        u.name AS user_name,
        c.id AS checkin_id
      FROM Booking b
      JOIN Stadium s ON b.st_id = s.st_id
      JOIN User u ON b.user_id = u.id
      LEFT JOIN CheckIn c ON b.booking_id = c.book_id
      WHERE b.status = 'confirmed'
      ORDER BY b.start_time ASC
    `;
    const [bookings] = await db.promise().query(query);
    console.log('ການຈອງທີ່ຢືນຢັນ:', bookings);

    if (!bookings.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງທີ່ໄດ້ຮັບການຢືນຢັນ' });
    }

    return res.status(200).json({
      msg: 'ດຶງຂໍ້ມູນການຈອງທີ່ຢືນຢັນສຳເລັດ',
      bookings: bookings.map(booking => ({
        id: booking.id,
        user_id: booking.user_id,
        user_name: booking.user_name,
        st_id: booking.st_id,
        stadium_dtail: booking.stadium_dtail,
        start_time: booking.start_time,
        end_time: booking.end_time,
        time_slot: booking.time_slot,
        price: Number(booking.price),
        status: booking.status,
        pre_pay: Number(booking.pre_pay),
        post_pay: Number(booking.post_pay || 0),
        slip_payment: booking.slip_payment
          ? `${req.protocol}://${req.get('host')}/slip_payment/${booking.slip_payment}`
          : null,
        booking_type: booking.booking_type,
        booking_date: booking.booking_date,
        checkin_id: booking.checkin_id || null
      }))
    });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງການຈອງທີ່ຢືນຢັນ:', error.message, error.stack);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ', error: error.message });
  }
};

// Handle payment (save post_pay to Booking)
exports.savePayment = async (req, res) => {
  try {
    const { booking_id, post_pay } = req.body;

    // Validate required fields
    if (!booking_id || !post_pay || isNaN(post_pay) || post_pay < 0) {
      console.log('ການກວດສອບບໍ່ຜ່ານ:', { booking_id, post_pay });
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ booking_id ແລະ post_pay ທີ່ຖືກຕ້ອງ' });
    }

    // Validate booking exists and is confirmed
    const [booking] = await db.promise().query(
      'SELECT booking_id, status, price, pre_pay FROM Booking WHERE booking_id = ? AND status = ?',
      [booking_id, 'confirmed']
    );
    console.log('ການຈອງສຳລັບການຊຳລະ:', booking);
    if (!booking.length) {
      console.log('ບໍ່ພົບການຈອງ ຫຼື ບໍ່ໄດ້ຢືນຢັນ:', booking_id);
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງທີ່ໄດ້ຮັບການຢືນຢັນ' });
    }

    // Validate post_pay does not exceed remaining amount
    const remainingPay = booking[0].price - booking[0].pre_pay;
    if (post_pay > remainingPay) {
      console.log('ຍອດຊຳລະເກີນຍອດທີ່ຕ້ອງຊຳລະ:', { post_pay, remainingPay });
      return res.status(400).json({ msg: `ຍອດຊຳລະເກີນຈຳນວນທີ່ຕ້ອງຊຳລະ (${remainingPay} LAK)` });
    }

    // Update post_pay in Booking
    const updateQuery = 'UPDATE Booking SET post_pay = ? WHERE booking_id = ?';
    await db.promise().query(updateQuery, [post_pay, booking_id]);
    console.log('ອັບເດດການຊຳລະ:', { booking_id, post_pay });

    return res.status(200).json({
      msg: 'ບັນທຶກການຊຳລະເງິນສຳເລັດ',
      booking_id,
      post_pay: Number(post_pay)
    });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຊຳລະເງິນ:', error.message, error.stack);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ', error: error.message });
  }
};


// Get all check-in records
exports.getAllCheckIns = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS checkin_id,
        c.book_id,
        c.st_id,
        c.checkin_date,
        b.booking_date,
        b.status,
        s.dtail AS stadium_dtail,
        s.price AS stadium_price,
        s.price2 AS stadium_price2,
        s.image AS stadium_image,
        u.name AS user_name
      FROM CheckIn c
      JOIN Booking b ON c.book_id = b.booking_id
      JOIN Stadium s ON c.st_id = s.st_id
      JOIN User u ON b.user_id = u.id
      ORDER BY c.checkin_date DESC
    `;
    const [checkins] = await db.promise().query(query);
    console.log('Check-in records:', checkins);

    if (!checkins.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບຂໍ້ມູນການແຈ້ງເຂົ້າ' });
    }

    return res.status(200).json({
      msg: 'ດຶງຂໍ້ມູນການແຈ້ງເຂົ້າສຳເລັດ',
      checkins: checkins.map(checkin => ({
        checkin_id: checkin.checkin_id,
        book_id: checkin.book_id,
        st_id: checkin.st_id,
        stadium_dtail: checkin.stadium_dtail,
        stadium_price: checkin.stadium_price ? Number(checkin.stadium_price) : null,
        stadium_price2: checkin.stadium_price2 ? Number(checkin.stadium_price2) : null,
        stadium_image: checkin.stadium_image
          ? `${req.protocol}://${req.get('host')}/images/${checkin.stadium_image}`
          : null,
        user_name: checkin.user_name,
        checkin_date: checkin.checkin_date,
        booking_date: checkin.booking_date,
        status: checkin.status
      }))
    });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການແຈ້ງເຂົ້າ:', error.message, error.stack);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ', error: error.message });
  }
};