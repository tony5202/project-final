const express = require('express');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');

const path = require('path');
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Router
readdirSync('./routes').map((routeFile) => app.use('/api', require('./routes/' + routeFile)));
app.use('/product_image', express.static(path.join(__dirname, 'product_image')));
app.use('/stadium', express.static(path.join(__dirname, 'stadium')));
app.use('/slip_payment', express.static(path.join(__dirname, 'slip_payment')));

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));