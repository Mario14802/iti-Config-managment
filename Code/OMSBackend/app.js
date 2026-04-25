require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const swaggerSpec = require('./docs/swagger');

const app = express();

/* -------------------- PORT -------------------- */
const PORT = process.env.PORT || 3000;

/* -------------------- DB -------------------- */
connectDB()
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

/* -------------------- MIDDLEWARE -------------------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

/* =====================================================
   FRONTEND SERVING (IMPORTANT FIX)
   code/OMSfrontend contains your HTML/CSS/JS
===================================================== */
app.use(express.static(path.join(__dirname, 'OMSFrontend')));

/* -------------------- SWAGGER -------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- API ROUTES -------------------- */
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

/* -------------------- ROOT -------------------- */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'OMSfrontend', 'index.html'));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- START SERVER -------------------- */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});