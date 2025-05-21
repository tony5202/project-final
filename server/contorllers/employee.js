const db = require('../config/connect_DB');

exports.createEmployy = async (req, res) => {
  try {
    const { name, phone, address, username, password, bd, role } = req.body;

    // Make sure all required fields are provided
    if (!name || !phone || !address || !username || !password || !bd || !role) {
      return res.status(400).json({ msg: 'ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຕ້ອງການທັງໝົດ' });
    }

    // Validate role
    if (!['admin', 'manager'].includes(role)) {
      return res.status(400).json({ msg: 'ບົດບາດຕ້ອງເປັນ admin ຫຼື manager' });
    }

    // Check for duplicate username
    const [existingUser] = await db.promise().query('SELECT username FROM employee WHERE username = ?', [username]);
    if (existingUser.length) {
      return res.status(400).json({ msg: 'ຊື່ບັນຊີນີ້ມີຢູ່ແລ້ວ' });
    }

    // Query to insert the employee
    const query = `INSERT INTO employee (name, phone, address, username, password, bd, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, phone, address, username, password, bd, role];

    const [result] = await db.promise().query(query, values);

    return res.status(201).json({ msg: 'ເພີ່ມພະນັກງານສຳເລັດ', employeeId: result.insertId });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມພະນັກງານ:', error.message);
    return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມພະນັກງານ' });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const query = 'SELECT emp_id, name, phone, address, username, bd, role FROM employee';
    const [results] = await db.promise().query(query);

    return res.status(200).json(results);
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນພະນັກງານ:', error.message);
    return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນພະນັກງານ' });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { emp_id } = req.params;

    if (!emp_id) {
      return res.status(400).json({ msg: 'ຕ້ອງການ ID ຂອງພະນັກງານ' });
    }

    // Prepare the query to delete the employee
    const query = 'DELETE FROM employee WHERE emp_id = ?';
    const [result] = await db.promise().query(query, [emp_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'ບໍ່ພົບພະນັກງານ' });
    }

    return res.status(200).json({ msg: 'ລົບພະນັກງານສຳເລັດ' });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການລົບພະນັກງານ:', error.message);
    return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການລົບພະນັກງານ' });
  }
};

exports.editEmployee = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const { name, phone, address, username, password, bd, role } = req.body;

    // Make sure all required fields are provided
    if (!name || !phone || !address || !username || !password || !bd || !role) {
      return res.status(400).json({ msg: 'ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຕ້ອງກาນທັງໝົດ' });
    }

    // Validate role
    if (!['admin', 'manager'].includes(role)) {
      return res.status(400).json({ msg: 'ບົດບາດຕ້ອງເປັນ admin ຫຼື manager' });
    }

    // Check for duplicate username (excluding current employee)
    const [existingUser] = await db.promise().query('SELECT username FROM employee WHERE username = ? AND emp_id != ?', [username, emp_id]);
    if (existingUser.length) {
      return res.status(400).json({ msg: 'ຊື່ບັນຊີນີ້ມີຢູ່ແລ້ວ' });
    }

    // Prepare the query to update the employee
    const query = `UPDATE employee SET name = ?, phone = ?, address = ?, username = ?, password = ?, bd = ?, role = ? WHERE emp_id = ?`;
    const values = [name, phone, address, username, password, bd, role, emp_id];

    const [result] = await db.promise().query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'ບໍ່ພົບພະນັກງານ' });
    }

    return res.status(200).json({ msg: 'ແກ້ໄຂພະນັກງານສຳເລັດ' });
  } catch (error) {
    console.error('ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂພະນັກງານ:', error.message);
    return res.status(500).json({ msg: 'ເກີດຂໍ້ຜິດພາດໃນການແກ້ໄຂພະນັກງານ' });
  }
};