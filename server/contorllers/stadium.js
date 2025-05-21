const db = require('../config/connect_DB');
const path = require('path');

exports.createStadium = async (req, res) => {
  try {
    const { price, price2, dtail } = req.body;
    const image = req.file.filename;

    db.query(
      'INSERT INTO stadium (price, price2, dtail, image) VALUES (?, ?, ?, ?)',
      [price, price2, dtail, image],
      (error, results) => {
        if (error) {
          console.error('Error inserting stadium:', error.message);
          return res.status(500).json({ msg: 'Error inserting stadium' });
        }
        return res.status(200).json({ msg: 'Insert stadium success' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllStadium = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/stadium/`;

  db.query('SELECT * FROM stadium', (error, results) => {
    if (error) {
      console.error('Error fetching stadium:', error.message);
      return res.status(500).json({ msg: 'Error fetching stadium' });
    }

    const updatedResults = results.map((stadium) => ({
      ...stadium,
      image: baseUrl + stadium.image,
    }));

    return res.status(200).json(updatedResults);
  });
};

exports.editStadium = (req, res) => {
  const { st_id } = req.params;
  const { price, price2, dtail } = req.body;
  let sql = 'UPDATE stadium SET price = ?, price2 = ?, dtail = ?';
  const params = [price, price2, dtail];

  if (req.file) {
    sql += ', image = ?';
    params.push(req.file.filename);
  }
  sql += ' WHERE st_id = ?';
  params.push(st_id);

  db.query(sql, params, (error, results) => {
    if (error) {
      console.error('Error updating stadium:', error.message);
      return res.status(500).json({ msg: 'Error updating stadium' });
    }
    return res.status(200).json({ msg: 'Update stadium success' });
  });
};

exports.deleteStadium = (req, res) => {
  const { st_id } = req.params;

  db.query('DELETE FROM stadium WHERE st_id = ?', [st_id], (error, results) => {
    if (error) {
      console.error('Error deleting stadium:', error.message);
      return res.status(500).json({ msg: 'Error deleting stadium' });
    }
    return res.status(200).json({ msg: 'Delete stadium success' });
  });
};
