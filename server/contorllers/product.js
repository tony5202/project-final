// controllers/product.js
const path = require('path');
const db = require('../config/connect_DB');

// ฟังก์ชันเพิ่มสินค้า
// ฟังก์ชันเพิ่มสินค้า
exports.product = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body; // เพิ่ม quantity
    const image = req.file.filename;

    db.query(
      'INSERT INTO product (name, category, image, price, quantity) VALUES (?, ?, ?, ?, ?)',
      [name, category, image, price, quantity],
      (error, results) => {
        if (error) {
          console.error('Error inserting product:', error.message);
          return res.status(500).json({ msg: 'Error inserting product' });
        }
        console.log('Product inserted successfully:', results);
        return res.status(200).json({ msg: 'Insert product success' });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};


// ✅ ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
exports.getAllProduct = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/product_image/`;

  db.query('SELECT * FROM product ORDER BY id DESC', (error, results) => {
    if (error) {
      console.error('Error fetching products:', error.message);
      return res.status(500).json({ msg: 'Error fetching products' });
    }

    const updatedResults = results.map((product) => ({
      ...product,
      image: baseUrl + product.image // แปลงชื่อไฟล์เป็น URL ที่ client เข้าถึงได้
    }));

    return res.status(200).json(updatedResults);
  });
};
// controllers/product.js

// ฟังก์ชันแก้ไขสินค้า
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL params
    const { name, category, price, quantity } = req.body; // Get updated data from request body
    let image = null;

    // If there's a new image, process it
    if (req.file) {
      image = req.file.filename;
    }

    // Update the product in the database
    let query = 'UPDATE product SET name = ?, category = ?, price = ?, quantity = ?';
    let queryParams = [name, category, price, quantity];

    if (image) {
      query += ', image = ?'; // If a new image was uploaded, add it to the update query
      queryParams.push(image);
    }

    query += ' WHERE id = ?'; // Update the product where the id matches
    queryParams.push(id);

    db.query(query, queryParams, (error, results) => {
      if (error) {
        console.error('Error updating product:', error.message);
        return res.status(500).json({ msg: 'Error updating product' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ msg: 'Product not found' });
      }

      console.log('Product updated successfully:', results);
      return res.status(200).json({ msg: 'Product updated successfully' });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};
// ลบสินค้า
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM product WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error deleting product:', error.message);
      return res.status(500).json({ msg: 'Error deleting product' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    console.log('Product deleted successfully');
    return res.status(200).json({ msg: 'Product deleted successfully' });
  });
};



// controllers/product.js

// Fetch all products for report (excluding image)
exports.getReportProduct = async (req, res) => {
  try {
    const query = `
      SELECT id, name, category, price, quantity
      FROM product
      ORDER BY id DESC
    `;
    db.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching products:', error.message);
        return res.status(500).json({ msg: 'Error fetching products' });
      }
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// ... (ฟังก์ชันอื่น ๆ เช่น product, getAllProduct, editProduct, deleteProduct)

exports.createSale = async (req, res) => {
  try {
    const { totalAmount, receivedmoney, emp_id, details } = req.body; // details เป็น array ของ { product_id, quantity, price }
    const date_time = new Date();

    // เริ่ม transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Transaction error:', err.message);
        return res.status(500).json({ msg: 'Transaction error' });
      }

      // ตรวจสอบสต็อกสินค้าก่อน
      const stockChecks = details.map((detail) =>
        new Promise((resolve, reject) => {
          db.query(
            'SELECT quantity FROM product WHERE id = ?',
            [detail.product_id],
            (error, results) => {
              if (error) return reject(error);
              if (results.length === 0) {
                return reject(new Error(`Product ID ${detail.product_id} not found`));
              }
              const availableStock = results[0].quantity;
              if (availableStock < detail.quantity) {
                return reject(new Error(`Insufficient stock for product ID ${detail.product_id}`));
              }
              resolve();
            }
          );
        })
      );

      Promise.all(stockChecks)
        .then(() => {
          // บันทึกข้อมูลการขายลงในตาราง sale
          db.query(
            'INSERT INTO sale (totalAmount, receivedmoney, date_time, emp_id) VALUES (?, ?, ?, ?)',
            [totalAmount, receivedmoney, date_time, emp_id],
            (error, result) => {
              if (error) {
                return db.rollback(() => {
                  console.error('Error inserting sale:', error.message);
                  return res.status(500).json({ msg: 'Error inserting sale' });
                });
              }

              const sale_id = result.insertId;

              // บันทึก sale_detail
              const detailQueries = details.map((detail) =>
                new Promise((resolve, reject) => {
                  db.query(
                    'INSERT INTO sale_detail (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [sale_id, detail.product_id, detail.quantity, detail.price],
                    (error) => {
                      if (error) return reject(error);
                      resolve();
                    }
                  );
                })
              );

              Promise.all(detailQueries)
                .then(() => {
                  // อัปเดตสต็อกสินค้า
                  const updateStockQueries = details.map((detail) =>
                    new Promise((resolve, reject) => {
                      db.query(
                        'UPDATE product SET quantity = quantity - ? WHERE id = ?',
                        [detail.quantity, detail.product_id],
                        (error) => {
                          if (error) return reject(error);
                          resolve();
                        }
                      );
                    })
                  );

                  Promise.all(updateStockQueries)
                    .then(() => {
                      db.commit((err) => {
                        if (err) {
                          return db.rollback(() => {
                            console.error('Commit error:', err.message);
                            return res.status(500).json({ msg: 'Commit error' });
                          });
                        }
                        return res.status(200).json({ msg: 'Sale created successfully', sale_id });
                      });
                    })
                    .catch((error) => {
                      db.rollback(() => {
                        console.error('Error updating stock:', error.message);
                        return res.status(500).json({ msg: 'Error updating stock' });
                      });
                    });
                })
                .catch((error) => {
                  db.rollback(() => {
                    console.error('Error inserting sale details:', error.message);
                    return res.status(500).json({ msg: 'Error inserting sale details' });
                  });
                });
            }
          );
        })
        .catch((error) => {
          db.rollback(() => {
            console.error('Stock check error:', error.message);
            return res.status(400).json({ msg: error.message });
          });
        });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};




exports.getIncomeReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT s.id AS sale_id, s.totalAmount, s.receivedmoney, 
             DATE_FORMAT(s.date_time, '%Y-%m-%d %H:%i:%s') AS date_time, 
             s.emp_id, e.username, sd.product_id, sd.quantity, sd.price, p.name AS product_name
      FROM sale s
      LEFT JOIN sale_detail sd ON s.id = sd.sale_id
      LEFT JOIN product p ON sd.product_id = p.id
      LEFT JOIN employee e ON s.emp_id = e.emp_id
    `;
    const queryParams = [];

    if (startDate && endDate) {
      const start = `${startDate} 00:00:00`;
      const end = `${endDate} 23:59:59`;
      query += ' WHERE s.date_time BETWEEN ? AND ?';
      queryParams.push(start, end);
    }

    query += ' ORDER BY COALESCE(s.date_time, "1970-01-01 00:00:00") DESC';

    db.query(query, queryParams, (error, results) => {
      if (error) {
        console.error('Error fetching income report:', error.message);
        return res.status(500).json({ msg: 'Error fetching income report' });
      }

      console.log('Query results:', results); // ดีบักผลลัพธ์

      const totalIncome = results.reduce((sum, sale) => sum + parseFloat(sale.totalAmount || 0), 0);

      return res.status(200).json({
        sales: results,
        totalIncome,
      });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};