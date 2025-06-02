
const path = require('path');
const db = require('../config/connect_DB');

// ฟังก์ชันเพิ่มสินค้า
exports.product = async (req, res) => {
  try {
    const { name, category, price, quantity } = req.body;
    const image = req.file?.filename;

    // Validate inputs
    if (!name || !category || !price || !quantity || !image) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ msg: 'Invalid price: must be a positive number' });
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      return res.status(400).json({ msg: 'Invalid quantity: must be a positive integer' });
    }

    db.beginTransaction(async (err) => {
      try {
        // Insert product
        const [productResult] = await db.promise().query(
          'INSERT INTO product (name, category, image, price, quantity) VALUES (?, ?, ?, ?, ?)',
         [name, category, image, parseFloat(price), Number(quantity)]
        );
        const productId = productResult.insertId;

        // Insert expense
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const amount = parseFloat(price).toFixed(2);
        const total = (parseFloat(amount) * Number(quantity)).toFixed(2);
        const detailStr = `เพิ่มสต็อกสินค้า: ${name}`;

        await db.promise().query(
          'INSERT INTO expense (amount, detail, total, date, id_pro, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [amount, detailStr, total, date, productId, Number(quantity)]
        );

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Commit error:', err.message);
              res.status(500).json({ msg: 'Server error' });
            });
          }
          console.log('Product and expense inserted successfully');
          res.status(201).json({ msg: 'Insert product and expense successfully' });
        });
      } catch (error) {
        db.rollback(() => {
          console.error('Transaction error:', error.message);
          res.status(500).json({ msg: 'Error inserting product or expense' });
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ฟังก์ชันแก้ไขสินค้า
exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity } = req.body;
    let image = req.file ? req.file.filename : null;

    // Validate inputs
    if (!name || !category || !price || !quantity) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return res.status(400).json({ msg: 'Invalid price: must be a positive number' });
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      return res.status(400).json({ msg: 'Invalid quantity: must be a non-negative integer' });
    }

    db.beginTransaction(async (err) => {
      if (err) {
        console.error('Transaction error:', err.message);
        return res.status(500).json({ msg: 'Transaction error' });
      }

      try {
        // Get current product data
        const [productRows] = await db.promise().query('SELECT quantity, price FROM product WHERE id = ?', [id]);
        if (!productRows.length) {
          throw new Error('Product not found');
        }
        const currentQuantity = Number(productRows[0].quantity);
        const currentPrice = parseFloat(productRows[0].price);

        // Update product
        let query = 'UPDATE product SET name = ?, category = ?, price = ?, quantity = ?';
        let queryParams = [name, category, parseFloat(price), Number(quantity)];

        if (image) {
          query += ', image = ?';
          queryParams.push(image);
        }

        query += ' WHERE id = ?';
        queryParams.push(id);

        const [updateResult] = await db.promise().query(query, queryParams);

        if (updateResult.affectedRows === 0) {
          throw new Error('Product not found');
        }

        // Insert expense if quantity increased
        const newQuantity = Number(quantity);
        if (newQuantity > currentQuantity) {
          const quantityAdded = newQuantity - currentQuantity;
          const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
          const amount = parseFloat(price).toFixed(2); // Use new price
          const total = (parseFloat(amount) * quantityAdded).toFixed(2);
          const detailStr = `เพิ่มสต็อกสินค้า: ${name} (${quantityAdded} หน่วย)`;

          await db.promise().query(
            'INSERT INTO expense (amount, detail, total, date, id_pro, quantity) VALUES (?, ?, ?, ?, ?, ?)',
            [amount, detailStr, total, date, id, quantityAdded]
          );
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Commit error:', err.message);
              res.status(500).json({ msg: 'Server error' });
            });
          }
          console.log('Product updated and expense recorded successfully');
          res.status(200).json({ msg: 'Product updated successfully' });
        });
      } catch (error) {
        db.rollback(() => {
          console.error('Transaction error:', error.message);
          if (error.message === 'Product not found') {
            res.status(404).json({ msg: 'Product not found' });
          } else {
            res.status(500).json({ msg: 'Error updating product or expense' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ฟังก์ชันดึงข้อมูลสินค้าทั้งหมด
exports.getAllProduct = (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/product_image/`;

  db.query('SELECT * FROM product ORDER BY id DESC', (error, results) => {
    if (error) {
      console.error('Error fetching products:', error.message);
      return res.status(500).json({ msg: 'Error fetching products' });
    }

    const updatedResults = results.map((product) => ({
      ...product,
      image: baseUrl + product.image
    }));

    return res.status(200).json(updatedResults);
  });
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

// สร้างการขาย
exports.createSale = async (req, res) => {
  try {
    const { totalAmount, receivedmoney, emp_id, details } = req.body;
    const date_time = new Date();

    db.beginTransaction((err) => {
      if (err) {
        console.error('Transaction error:', err.message);
        return res.status(500).json({ msg: 'Transaction error' });
      }

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

// รายงานรายได้
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
