const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

exports.getOrdersByUser = async (userId) => {
    const orders = await Order.find({ user_id: userId });
    
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const items = await OrderItem.find({ order_id: order._id }).populate('product_id');
        return { order, items };
    }));

    return ordersWithItems;
};

exports.createOrder = async (orderData) => {
    const { items, ...orderDetails } = orderData;

    if (!items || items.length === 0) {
        throw new Error('Order must include at least one item');
    }

    for (const item of items) {
        const product = await Product.findById(item.product_id);
        if (!product) {
            throw new Error('Product not found');
        }
        const stock = Number(product.stock_quantity) || 0;
        if (stock < item.quantity) {
            throw new Error('Not enough stock for one of the products');
        }
    }

    const order = new Order(orderDetails);
    const savedOrder = await order.save();

    const orderItems = [];
    for (const item of items) {
        const product = await Product.findById(item.product_id);
        const stock = Number(product.stock_quantity) || 0;

        orderItems.push({
            order_id: savedOrder._id,
            product_id: product._id,
            quantity: item.quantity,
            unit_price: item.unit_price != null ? item.unit_price : product.price
        });

        product.stock_quantity = Math.max(0, stock - item.quantity);
        if (product.stock_quantity <= 0) {
            product.stock_status = 'out_of_stock';
        }
        await product.save();
    }

    await OrderItem.insertMany(orderItems);
    return savedOrder;
};
