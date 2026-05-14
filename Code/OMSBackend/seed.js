require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const CartItem = require('./models/CartItem');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for Seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Cart.deleteMany({});
        await CartItem.deleteMany({});
        await Order.deleteMany({});
        await OrderItem.deleteMany({});
        console.log('Old Data Cleared.');

        // Plaintext must match what you type at login; authService compares with bcrypt.
        const adminPasswordHash = await bcrypt.hash('hashed123', await bcrypt.genSalt(10));
        const clientPasswordHash = await bcrypt.hash('hashed456', await bcrypt.genSalt(10));

        // 1. Create Users
        const user1 = new User({
            firstName: 'John',
            lastName: 'Doe',
            role: 'admin',
            password: adminPasswordHash,
            email: 'admin@example.com',
            phone_number: '1234567890'
        });
        const user2 = new User({
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'client',
            password: clientPasswordHash,
            email: 'customer@example.com',
            phone_number: '0987654321'
        });
        await user1.save();
        await user2.save();

        console.log('Admin and Customer Users Created. Database is ready and realistic!');
        console.log('Login: admin@example.com / hashed123 | customer@example.com / hashed456');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

seedData();
