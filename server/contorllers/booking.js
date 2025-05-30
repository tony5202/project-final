const db = require('../config/connect_DB');

exports.createBooking = async (req, res) => {
  try {
    const {
      user_id,
      st_id,
      start_time,
      end_time,
      price,
      status = 'pending',
      pre_pay = 0,
      post_pay = 0,
      booking_type = 'Football',
      emp_id
    } = req.body;

    // Validate required fields
    if (!user_id || !st_id || !start_time || !end_time || !price || !booking_type) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸຂໍ້ມູນທີ່ຈຳເປັນທັງໝົດ' });
    }

    // Validate numeric fields
    if (isNaN(price) || price < 0) {
      return res.status(400).json({ msg: 'ລາຄາຕ້ອງເປັນຕົວເລກທີ່ຬໍ່ຕິດລົບ' });
    }
    if (isNaN(pre_pay) || pre_pay < 0) {
      return res.status(400).json({ msg: 'ຄ່າມັດຈຳຕ້ອງເປັນຕົວເລກທີ່ຬໍ່ຕິດລົບ' });
    }
    if (isNaN(post_pay) || post_pay < 0) {
      return res.status(400).json({ msg: 'ຄ່າຊຳລະຫຼັງຈອງຕ້ອງເປັນຕົວເລກທີ່ຬໍ່ຕິດລົບ' });
    }

    const startDateTime = new Date(start_time);
    const endDateTime = new Date(end_time);

    // Validate datetime format
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ msg: 'ຮູບແບບວັນທີ ຫຼື ເວລາບໍ່ຖືກຕ້ອງ' });
    }

    // Validate booking_type
    if (!['Football', 'Event'].includes(booking_type)) {
      return res.status(400).json({ msg: 'ປະເພດການຈອງຬໍ່ຖືກຕ້ອງ' });
    }

    // Validate status
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'ສະຖານະການຈອງຬໍ່ຖືກຕ້ອງ' });
    }

    // Validate start_time < end_time
    if (startDateTime >= endDateTime) {
      return res.status(400).json({ msg: 'ເວລາເລີ່ມຕ້ອງກ່ອນເວລາສິ້ນສຸດ' });
    }

    // Validate Event booking covers full day
    if (booking_type === 'Event') {
      const expectedStart = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 0, 0);
      const expectedEnd = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 23, 59);
      if (
        startDateTime.getTime() !== expectedStart.getTime() ||
        endDateTime.getTime() !== expectedEnd.getTime()
      ) {
        return res.status(400).json({ msg: 'ການຈອງປະເພດອີເວັນຕ້ອງຄອບຄຸມທັງມື້ (00:00 - 23:59)' });
      }
    }

    // Check user and stadium
    const [user] = await db.promise().query('SELECT id FROM User WHERE id = ?', [user_id]);
    const [stadium] = await db.promise().query('SELECT st_id FROM Stadium WHERE st_id = ?', [st_id]);
    if (!user.length || !stadium.length) {
      return res.status(400).json({ msg: 'ຜູ້ໃຊ້ ຫຼື ສະໜາມຬໍ່ພົບ' });
    }

    // Check emp_id if provided
    if (emp_id) {
      const [employee] = await db.promise().query('SELECT emp_id FROM Employee WHERE emp_id = ?', [emp_id]);
      if (!employee.length) {
        return res.status(400).json({ msg: 'ພະນັກງານຬໍ່ພົບ' });
      }
    }

    // Check for overlapping bookings
    const dayStart = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 0, 0);
    const dayEnd = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 23, 59);
    let queryParams;
    let query;
    if (booking_type === 'Event') {
      query = `
        SELECT * FROM Booking 
        WHERE st_id = ? 
        AND status != 'cancelled'
        AND (
          (start_time <= ? AND end_time >= ?) OR
          (start_time >= ? AND start_time <= ?)
        )
      `;
      queryParams = [st_id, dayEnd, dayStart, dayStart, dayEnd];
    } else {
      query = `
        SELECT * FROM Booking 
        WHERE st_id = ? 
        AND status != 'cancelled'
        AND (
          (booking_type = 'Football' AND (
            (start_time <= ? AND end_time > ?) OR
            (start_time >= ? AND start_time < ?)
          )) OR
          (booking_type = 'Event' AND (
            start_time <= ? AND end_time >= ?
          ))
        )
      `;
      queryParams = [st_id, endDateTime, startDateTime, startDateTime, endDateTime, dayEnd, dayStart];
    }
    const [existingBookings] = await db.promise().query(query, queryParams);
    if (existingBookings.length > 0) {
      const hasFootball = existingBookings.some(booking => booking.booking_type === 'Football');
      const hasEvent = existingBookings.some(booking => booking.booking_type === 'Event');
      let errorMsg = 'ຊ່ວງເວລານີ້ຬໍ່ວ່າງ';
      if (booking_type === 'Event' && hasFootball) {
        errorMsg = 'ວັນນີ້ຬໍ່ວ່າງເນື່ອງຈາກມີການຈອງຟຸດບານ';
      } else if (booking_type === 'Football' && hasEvent) {
        errorMsg = 'ວັນນີ້ຬໍ່ວ່າງເນື່ອງຈາກມີການຈອງອີເວັນ';
      }
      return res.status(400).json({ msg: errorMsg });
    }

    // Handle slip_payment
    const slip_payment = req.file ? req.file.filename : null;

    // Insert into Booking
    const insertQuery = `
      INSERT INTO Booking (
        user_id, st_id, emp_id, start_time, end_time, price, status,
        pre_pay, post_pay, slip_payment, booking_type, booking_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      user_id,
      st_id,
      emp_id || null,
      startDateTime,
      endDateTime,
      price,
      status,
      pre_pay,
      post_pay,
      slip_payment,
      booking_type,
      startDateTime.toISOString().slice(0, 10)
    ];

    db.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມການຈອງ:', error.message);
        return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມການຈອງ', error: error.message });
      }
      return res.status(201).json({
        msg: 'ເພີ່ມການຈອງສຳເລັດ',
        booking_id: results.insertId,
        booking: {
          user_id,
          st_id,
          emp_id,
          start_time: startDateTime,
          end_time: endDateTime,
          price,
          status,
          pre_pay,
          post_pay,
          slip_payment: slip_payment ? `${req.protocol}://${req.get('host')}/slip_payment/${slip_payment}` : null,
          booking_type,
          booking_date: startDateTime.toISOString().slice(0, 10)
        }
      });
    });
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດຂອງເຊີເວີ:', error.message);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີເວີ', error: error.message });
  }
};
// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.promise().query(`
      SELECT 
        b.booking_id AS id, 
        b.user_id, 
        b.st_id, 
        b.emp_id, 
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
        b.createdAt AS created_at,
        s.dtail AS stadium_dtail, 
        u.name AS user_name,
        u.phone AS user_phone
      FROM Booking b
      JOIN Stadium s ON b.st_id = s.st_id
      JOIN User u ON b.user_id = u.id
      ORDER BY b.booking_id DESC
    `);

    if (bookings.length === 0) {
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງ' });
    }

    return res.status(200).json({
      msg: 'ດຶງຂໍ້ມູນການຈອງທັງໝົດສຳເລັດ',
      bookings: bookings.map(booking => ({
        id: booking.id,
        user_id: booking.user_id,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
        st_id: booking.st_id,
        stadium_dtail: booking.stadium_dtail,
        emp_id: booking.emp_id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        time_slot: booking.time_slot,
        price: Number(booking.price),
        status: booking.status,
        pre_pay: Number(booking.pre_pay),
        post_pay: Number(booking.post_pay || 0),
        slip_payment: booking.slip_payment ? `${req.protocol}://${req.get('host')}/slip_payment/${booking.slip_payment}` : null,
        booking_type: booking.booking_type,
        booking_date: booking.booking_date,
        created_at: booking.created_at
      }))
    });
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການດຶງການຈອງທັງໝົດ:', error.message);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີເວີ', error: error.message });
  }
};


// Get bookings for a specific user
exports.getUserBookings = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || isNaN(user_id)) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ user_id ທີ່ຖືກຕ້ອງ' });
    }

    const [user] = await db.promise().query('SELECT id FROM User WHERE id = ?', [user_id]);
    if (!user.length) {
      return res.status(404).json({ msg: 'ຜູ້ໃຊ້ຬໍ່ພົບ' });
    }

    const [bookings] = await db.promise().query(
      `SELECT b.booking_id AS id, b.user_id, b.st_id, b.emp_id, b.start_time, b.end_time,
              CONCAT(TIME_FORMAT(b.start_time, '%H:%i'), '-', TIME_FORMAT(b.end_time, '%H:%i')) AS time_slot,
              b.price, b.status, b.pre_pay, b.post_pay, b.slip_payment, b.booking_type, b.booking_date,
              b.createdAt AS created_at, s.dtail AS stadium_dtail, u.name AS user_name
       FROM Booking b
       JOIN Stadium s ON b.st_id = s.st_id
       JOIN User u ON b.user_id = u.id
       WHERE b.user_id = ?
       ORDER BY b.booking_id DESC`,
      [user_id]
    );

    console.log('Raw bookings:', bookings); // Debug log

    if (bookings.length === 0) {
      return res.status(404).json({ msg: 'ຬໍ່ພົບປະຫວັດການຈອງ' });
    }

    return res.status(200).json({
      msg: 'ດຶງປະຫວັດການຈອງສຳເລັດ',
      bookings: bookings.map(booking => ({
        id: booking.id,
        user_id: booking.user_id,
        user_name: booking.user_name,
        st_id: booking.st_id,
        stadium_dtail: booking.stadium_dtail,
        emp_id: booking.emp_id,
        start_time: booking.start_time,
        end_time: booking.end_time,
        time_slot: booking.time_slot,
        price: Number(booking.price),
        status: booking.status,
        pre_pay: Number(booking.pre_pay),
        post_pay: Number(booking.post_pay || 0),
        slip_payment: booking.slip_payment ? `${req.protocol}://${req.get('host')}/slip_payment/${booking.slip_payment}` : null,
        booking_type: booking.booking_type,
        booking_date: booking.booking_date,
        created_at: booking.created_at
      }))
    });
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການດຶງປະຫວັດການຈອງ:', error.message);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີເວີ', error: error.message });
  }
};

// Check stadium availability
exports.checkAvailability = async (req, res) => {
  try {
    const { st_id } = req.params;
    const { start_time, end_time, booking_type } = req.query;

    // Validate inputs
    if (!st_id || !start_time || !end_time || !booking_type) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ st_id, start_time, end_time ແລະ booking_type' });
    }

    const startDateTime = new Date(start_time);
    const endDateTime = new Date(end_time);

    // Validate datetime
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return res.status(400).json({ msg: 'ຮູບແບບວັນທີ ຫຼື ເວລາບໍ່ຖືກຕ້ອງ' });
    }

    // Validate start_time < end_time
    if (startDateTime >= endDateTime) {
      return res.status(400).json({ msg: 'ເວລາເລີ່ມຕ້ອງກ່ອນເວລາສິ້ນສຸດ' });
    }

    // Validate booking_type
    if (!['Football', 'Event'].includes(booking_type)) {
      return res.status(400).json({ msg: 'ປະເພດການຈອງຬໍ່ຖືກຕ້ອງ' });
    }

    // Check if stadium exists
    const [stadium] = await db.promise().query('SELECT st_id FROM Stadium WHERE st_id = ?', [st_id]);
    if (!stadium.length) {
      return res.status(404).json({ msg: 'ສະໜາມຬໍ່ພົບ' });
    }

    // Check for overlapping bookings
    const dayStart = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 0, 0);
    const dayEnd = new Date(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate(), 23, 59);
    let queryParams;
    let query;
    if (booking_type === 'Event') {
      // Check for any bookings (Football or Event) on the same day
      query = `
        SELECT * FROM Booking 
        WHERE st_id = ? 
        AND status != 'cancelled'
        AND (
          (start_time <= ? AND end_time >= ?) OR
          (start_time >= ? AND start_time <= ?)
        )
      `;
      queryParams = [st_id, dayEnd, dayStart, dayStart, dayEnd];
    } else {
      // Check for overlapping Football bookings and any Event bookings on the same day
      query = `
        SELECT * FROM Booking 
        WHERE st_id = ? 
        AND status != 'cancelled'
        AND (
          (booking_type = 'Football' AND (
            (start_time <= ? AND end_time > ?) OR
            (start_time >= ? AND start_time < ?)
          )) OR
          (booking_type = 'Event' AND (
            start_time <= ? AND end_time >= ?
          ))
        )
      `;
      queryParams = [st_id, endDateTime, startDateTime, startDateTime, endDateTime, dayEnd, dayStart];
    }
    const [existingBookings] = await db.promise().query(query, queryParams);

    if (existingBookings.length > 0) {
      const hasFootball = existingBookings.some(booking => booking.booking_type === 'Football');
      const hasEvent = existingBookings.some(booking => booking.booking_type === 'Event');
      let errorMsg = 'ຊ່ວງເວລານີ້ບໍ່ວ່າງ';
      if (booking_type === 'Event' && hasFootball) {
        errorMsg = 'ວັນນີ້ຬໍ່ວ່າງເນື່ອງຈາກມີການຈອງຟຸດບານ';
      } else if (booking_type === 'Football' && hasEvent) {
        errorMsg = 'ວັນນີ້ຬໍ່ວ່າງເນື່ອງຈາກມີການຈອງອີເວັນ';
      }
      return res.status(400).json({ msg: errorMsg });
    }

    return res.status(200).json({
      available: existingBookings.length === 0,
      msg: existingBookings.length === 0 ? 'ຊ່ວງເວລານີ້ວ່າງ' : 'ຊ່ວງເວລານີ້ວ່າງ'
    });
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການກວດສອບຄວາມວ່າງ:', error.message);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີເວີ', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { booking_id } = req.params;
    const { status, emp_id } = req.body;

    // Validate inputs
    if (!booking_id || isNaN(booking_id)) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ booking_id ທີ່ຖືກຕ້ອງ' });
    }
    if (!status) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸສະຖານະໃໝ່' });
    }
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'ສະຖານະຕ້ອງເປັນ confirmed ຫຼື cancelled ເທົ່ານັ້ນ' });
    }
    if (!emp_id || isNaN(emp_id)) {
      return res.status(400).json({ msg: 'ກະລຸນາລະບຸ emp_id ທີ່ຖືກຕ້ອງ' });
    }

    // Check if booking exists
    const [booking] = await db.promise().query('SELECT * FROM Booking WHERE booking_id = ?', [booking_id]);
    if (!booking.length) {
      return res.status(404).json({ msg: 'ບໍ່ພົບການຈອງ' });
    }

    // Check if employee exists
    const [employee] = await db.promise().query('SELECT emp_id FROM Employee WHERE emp_id = ?', [emp_id]);
    if (!employee.length) {
      return res.status(400).json({ msg: 'ພະນັກງານບໍ່ພົບ' });
    }

    // Prevent updating if already in a terminal state
    if (['confirmed', 'cancelled', 'completed'].includes(booking[0].status)) {
      return res.status(400).json({ msg: 'ບໍ່ສາມາດປ່ຽນສະຖານະຂອງການຈອງນີ້ໄດ້ ເນື່ອງຈາກມັນຢູ່ໃນສະຖານະສຸດທ້າຍແລ້ວ' });
    }

    // Update booking status and emp_id
    const updateQuery = 'UPDATE Booking SET status = ?, emp_id = ? WHERE booking_id = ?';
    await db.promise().query(updateQuery, [status, emp_id, booking_id]);

    // Fetch updated booking
    const [updatedBooking] = await db.promise().query(`
      SELECT b.booking_id AS id, b.user_id, b.st_id, b.emp_id, b.start_time, b.end_time,
             CONCAT(TIME_FORMAT(b.start_time, '%H:%i'), '-', TIME_FORMAT(b.end_time, '%H:%i')) AS time_slot,
             b.price, b.status, b.pre_pay, b.post_pay, b.slip_payment, b.booking_type, b.booking_date,
             s.dtail AS stadium_dtail, u.name AS user_name
      FROM Booking b
      JOIN Stadium s ON b.st_id = s.st_id
      JOIN User u ON b.user_id = u.id
      WHERE b.booking_id = ?
    `, [booking_id]);

    return res.status(200).json({
      msg: 'ອັບເດດສະຖານະການຈອງສຳເລັດ',
      booking: {
        id: updatedBooking[0].id,
        user_id: updatedBooking[0].user_id,
        user_name: updatedBooking[0].user_name,
        st_id: updatedBooking[0].st_id,
        stadium_dtail: updatedBooking[0].stadium_dtail,
        emp_id: updatedBooking[0].emp_id,
        start_time: updatedBooking[0].start_time,
        end_time: updatedBooking[0].end_time,
        time_slot: updatedBooking[0].time_slot,
        price: Number(updatedBooking[0].price),
        status: updatedBooking[0].status,
        pre_pay: Number(updatedBooking[0].pre_pay),
        post_pay: Number(updatedBooking[0].post_pay || 0),
        slip_payment: updatedBooking[0].slip_payment ? `${req.protocol}://${req.get('host')}/slip_payment/${updatedBooking[0].slip_payment}` : null,
        booking_type: updatedBooking[0].booking_type,
        booking_date: updatedBooking[0].booking_date
      }
    });
  } catch (error) {
    console.error('ຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະການຈອງ:', error.message);
    return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີເວີ', error: error.message });
  }
};
exports.getReportBooking = (req, res) => {
  const { startDate, endDate, status } = req.query;

  // Note: startDate and endDate are expected to be shifted back by 1 day by the frontend
  let query = `
    SELECT 
      b.booking_id AS id, 
      b.user_id, 
      b.st_id, 
      b.emp_id, 
      b.start_time, 
      b.end_time,
      CONCAT(TIME_FORMAT(b.start_time, '%H:%i'), '-', TIME_FORMAT(b.end_time, '%H:%i')) AS time_slot,
      b.price, 
      b.status, 
      b.pre_pay, 
      b.post_pay, 
      b.booking_type, 
      b.booking_date,
      b.createdAt AS created_at,
      s.dtail AS stadium_dtail, 
      u.name AS user_name,
      u.phone AS user_phone,
      e.username AS username
    FROM Booking b
    JOIN Stadium s ON b.st_id = s.st_id
    JOIN User u ON b.user_id = u.id
    JOIN Employee e ON b.emp_id = e.emp_id
    WHERE 1=1
  `;
  const queryParams = [];

  if (startDate) {
    query += ' AND b.booking_date >= ?';
    queryParams.push(startDate); // Already adjusted to be 1 day earlier
  }
  if (endDate) {
    query += ' AND b.booking_date <= ?';
    queryParams.push(endDate); // Already adjusted to be 1 day earlier
  }
  if (status) {
    query += ' AND b.status = ?';
    queryParams.push(status);
  }
  query += ' ORDER BY b.booking_id DESC';

  db.query(query, queryParams, (error, results) => {
    if (error) {
      console.error('Error fetching bookings:', error.message);
      return res.status(500).json({ msg: 'Error fetching bookings' });
    }
    if (results.length === 0) {
      return res.status(200).json({ msg: 'No bookings found', bookings: [] });
    }
    return res.status(200).json(
      results.map((booking) => ({
        id: booking.id,
        user_id: booking.user_id,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
        st_id: booking.st_id,
        stadium_dtail: booking.stadium_dtail,
        emp_id: booking.emp_id,
        username: booking.username,
        start_time: booking.start_time,
        end_time: booking.end_time,
        time_slot: booking.time_slot,
        price: Number(booking.price),
        status: booking.status,
        pre_pay: Number(booking.pre_pay),
        post_pay: Number(booking.post_pay || 0),
        booking_type: booking.booking_type,
        booking_date: booking.booking_date,
        created_at: booking.created_at,
      }))
    );
  });
};