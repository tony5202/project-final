const db = require('../config/connect_DB');
const sanitizeHtml = require('sanitize-html');

exports.createReview = (req, res) => {
  const { user_id, star, review } = req.body;
  console.log('Create Review Request:', { user_id, star, review });

  if (!user_id || star === undefined || !review) {
    return res.status(400).json({ msg: 'ກະລຸນາປ້ອນຂໍ້ມູນທີ່ຕ້ອງການທັງໝົດ (user_id, star, review)' });
  }

  if (!Number.isInteger(star) || star < 1 || star > 5) {
    return res.status(400).json({ msg: 'ດາວຕ້ອງເປັນຕົວເລກລະຫວ່າງ 1 ຫາ 5' });
  }

  if (typeof review !== 'string' || review.trim().length === 0) {
    return res.status(400).json({ msg: 'ຣີີວິວຕ້ອງເປັນຂໍ້ຄວາມທີ່ບໍ່ຫວ່າງເປົ່າ' });
  }
  const sanitizedReview = sanitizeHtml(review.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });

  db.query('SELECT id FROM user WHERE id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('ຂໍ້ຜິດພາດໃນການກວດສອບຜູ້ໃຊ້:', err.message);
      return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດຂອງເຊີບເວີ' });
    }
    if (results.length === 0) {
      return res.status(400).json({ msg: 'ຜູ້ໃຊ້ບໍ່ມີຢູ່' });
    }

    const query = `
      INSERT INTO review (user_id, star, review, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    const values = [user_id, star, sanitizedReview];

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('ຂໍ້ຜິດພາດໃນການບັນທຶກຣີີວິວ:', error.message);
        return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດໃນການບັນທຶກຣີີວິວ' });
      }

      console.log('Review created successfully:', { reviewId: results.insertId });
      return res.status(201).json({
        msg: 'ບັນທຶກຣີີວິວສຳເລັດ',
        reviewId: results.insertId,
      });
    });
  });
};

exports.getReview = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  console.log('Get Reviews Request:', { page, limit, offset, sort: 'created_at DESC' });

  const query = `
    SELECT r.id, r.user_id, r.star, r.review, r.created_at, u.username, u.name 
    FROM review r 
    JOIN user u ON r.user_id = u.id 
    ORDER BY r.created_at DESC 
    LIMIT ? OFFSET ?
  `;
  db.query(query, [limit, offset], (error, results) => {
    if (error) {
      console.error('ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຣີີວິວ:', error.message);
      return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຣີີວິວ' });
    }

    // Log the first few reviews to confirm sorting
    console.log('Fetched Reviews:', results.slice(0, 3).map(r => ({
      id: r.id,
      created_at: r.created_at,
      username: r.username
    })));

    db.query('SELECT COUNT(*) as total FROM review', (err, countResult) => {
      if (err) {
        console.error('ຂໍ້ຜິດພາດໃນການນັບຣີີວິວ:', err.message);
        return res.status(500).json({ msg: 'ຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຣີີວິວ' });
      }
      const total = countResult[0].total;
      console.log('Get Reviews Response:', { total, page, totalPages: Math.ceil(total / limit) });
      return res.status(200).json({
        reviews: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    });
  });
};