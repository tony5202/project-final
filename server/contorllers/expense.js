const db = require('../config/connect_DB');

// Create a new expense (product or stadium)
exports.createExpense = async (req, res) => {
  try {
    const { detail, amount, quantity, date, id_pro } = req.body;

    // Validate inputs
    if (!detail || !amount || !date) {
      return res.status(400).json({ msg: 'Missing required fields: detail, amount, date' });
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ msg: 'Invalid amount: must be a positive number' });
    }
    if (id_pro && isNaN(id_pro)) {
      return res.status(400).json({ msg: 'Invalid id_pro: must be a number or null' });
    }
    if (id_pro && (quantity === null || isNaN(quantity) || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0)) {
      return res.status(400).json({ msg: 'Invalid quantity: must be a positive integer for product expenses' });
    }
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ msg: 'Invalid date: must be in YYYY-MM-DD format' });
    }

    // Format amount and calculate total
    const formattedAmount = parseFloat(amount).toFixed(2);
    const formattedTotal = quantity !== null 
      ? (parseFloat(amount) * Number(quantity)).toFixed(2)
      : formattedAmount; // total = amount if quantity is null

    // Start transaction
    await db.promise().query('START TRANSACTION');

    try {
      // If id_pro is provided, validate product and update quantity
      if (id_pro) {
        const [productRows] = await db.promise().query('SELECT id FROM product WHERE id = ?', [id_pro]);
        if (!productRows.length) {
          throw new Error('Product not found');
        }
        // Update product quantity if quantity is provided
        if (quantity !== null) {
          await db.promise().query('UPDATE product SET quantity = quantity + ? WHERE id = ?', [quantity, id_pro]);
        }
      }

      // Insert expense
      const query = 'INSERT INTO expense (amount, detail, total, date, id_pro, quantity) VALUES (?, ?, ?, ?, ?, ?)';
      const params = [formattedAmount, detail, formattedTotal, date, id_pro || null, quantity];
      await db.promise().query(query, params);

      // Commit transaction
      await db.promise().query('COMMIT');
      console.log('Expense inserted and product updated successfully');
      return res.status(200).json({ msg: 'Insert expense success' });
    } catch (error) {
      // Rollback transaction on error
      await db.promise().query('ROLLBACK');
      console.error('Transaction error:', error.message);
      if (error.message === 'Product not found') {
        return res.status(400).json({ msg: 'Invalid id_pro: product not found' });
      }
      return res.status(500).json({ msg: 'Error processing expense' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get all expenses
// expenseController.js
exports.getExpense = async (req, res) => {
  try {
    const query = `
      SELECT e.id, e.amount, e.detail, e.total, DATE_FORMAT(e.date, '%Y-%m-%d') AS date, e.id_pro, e.quantity, p.name AS product_name
      FROM expense e
      LEFT JOIN product p ON e.id_pro = p.id ORDER BY e.id DESC
    `;
    const [results] = await db.promise().query(query);
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching expenses:', error.message);
    return res.status(500).json({ msg: 'Error fetching expenses' });
  }
};