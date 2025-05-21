// routes/product.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // path ตามจริง
const { product ,getAllProduct,editProduct,deleteProduct,createSale,getIncomeReport} = require('../contorllers/product');

router.post('/product', upload.single('image'), product); // image = ชื่อ field ที่ front ส่งมา
router.get('/product', getAllProduct);
router.put('/product/:id', upload.single('image'), editProduct);
router.delete('/product/:id', deleteProduct);
router.get('/products', getAllProduct);
router.post('/sale', createSale);
router.get('/income-report', getIncomeReport);
module.exports = router;
