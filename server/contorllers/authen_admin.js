const db = require('../config/connect_DB');
exports.loginAdmin = (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ msg: 'Please provide username and password' });
    }
  
    const loginQuery = 'SELECT * FROM employee WHERE username = ? AND password = ?';
    db.query(loginQuery, [username, password], (err, results) => {
      if (err) {
        console.error('Error during login:', err);
        return res.status(500).json({ msg: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(400).json({ msg: 'ຊື່ບັບຊີ ຫຼື ລະຫັດບໍ່ຖືກ' });
      }
  
      res.status(200).json({ msg: 'ເຂົ້າສູ່ລະບົບສຳເລັດ', user: results[0] });
    });
  };