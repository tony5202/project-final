const db = require('../config/connect_DB');

// ลงทะเบียนผู้ใช้
exports.registerUser = (req, res) => {
  const { username, password, name, email, phone } = req.body;

  if (!username || !password || !name || !email || !phone) {
    return res.status(400).json({ msg: 'Please provide all required fields' });
  }

  // เช็กว่ามี username ซ้ำไหม
  const checkUsernameQuery = 'SELECT * FROM user WHERE username = ?';
  db.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    // บันทึกข้อมูลลง Database
    const insertQuery = 'INSERT INTO user (username, password, name, email, phone) VALUES (?, ?, ?, ?, ?)';
    db.query(insertQuery, [username, password, name, email, phone], (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ msg: 'Database error' });
      }

      res.status(201).json({ msg: 'User registered successfully', userId: results.insertId });
    });
  });
};

// เข้าสู่ระบบผู้ใช้
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Please provide username and password' });
  }

  const loginQuery = 'SELECT * FROM user WHERE username = ? AND password = ?';
  db.query(loginQuery, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    res.status(200).json({ msg: 'Login successful', user: results[0] });
  });
};

exports.getUserId = (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT id, username, name, email, phone FROM user WHERE id = ?';

  db.query(query, [userId], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error.message);
      return res.status(500).json({ msg: 'Error fetching user' });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.status(200).json(results[0]);
  });
};
exports.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM user';

  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error.message);
      return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມສນຜູ້ໃຊ້' });
    }

    return res.status(200).json(results);
  });
};