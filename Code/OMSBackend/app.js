require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const swaggerSpec = require('./docs/swagger');

const app = express();

/* -------------------- PORT FIX (IMPORTANT) -------------------- */
const PORT = process.env.PORT || 3000;

/* -------------------- DB CONNECTION (SAFE) -------------------- */
connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

/* -------------------- MIDDLEWARE -------------------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* -------------------- SWAGGER -------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* -------------------- ROUTES -------------------- */
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

/* -------------------- TEST ROUTE -------------------- */
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Mobilestore API!'
    });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- START SERVER (RAILWAY FIX) -------------------- */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});