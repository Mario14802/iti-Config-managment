const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.getCartByUser = async (userId) => {
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return null;
    
    const items = await CartItem.find({ cart_id: cart._id }).populate('product_id');
    return { cart, items };
};

exports.createCart = async (userId) => {
    const cart = new Cart({ user_id: userId });
    return await cart.save();
};

exports.addItemToCart = async (cartId, itemData) => {
    const product = await Product.findById(itemData.product_id);
    if (!product) {
        throw new Error('Product not found');
    }

    const stock = Number(product.stock_quantity) || 0;
    const existing = await CartItem.findOne({
        cart_id: cartId,
        product_id: itemData.product_id
    });

    const newQty = (existing ? existing.quantity : 0) + itemData.quantity;
    if (newQty > stock) {
        throw new Error('Not enough stock');
    }

    if (existing) {
        existing.quantity = newQty;
        return await existing.save();
    }

    const cartItem = new CartItem({
        cart_id: cartId,
        product_id: itemData.product_id,
        quantity: itemData.quantity
    });
    return await cartItem.save();
};

exports.removeItemFromCart = async (cartItemId) => {
    return await CartItem.findByIdAndDelete(cartItemId);
};

exports.checkout = async (cartId, orderDetails) => {
    const Order = require('../models/Order');
    const OrderItem = require('../models/OrderItem');

    const cart = await Cart.findById(cartId);
    if (!cart) {
        throw new Error('Cart not found');
    }
    if (String(cart.user_id) !== String(orderDetails.user_id)) {
        throw new Error('Cart not found');
    }

    const cartItems = await CartItem.find({ cart_id: cartId });
    if (cartItems.length === 0) {
        throw new Error('Cart is empty');
    }

    const qtyByProduct = new Map();
    for (const item of cartItems) {
        const productId = String(item.product_id);
        qtyByProduct.set(productId, (qtyByProduct.get(productId) || 0) + item.quantity);
    }

    for (const [productId, qty] of qtyByProduct) {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const stock = Number(product.stock_quantity) || 0;
        if (stock < qty) {
            throw new Error('Not enough stock for one of the products');
        }
    }

    const order = new Order({ ...orderDetails, user_id: orderDetails.user_id });
    const savedOrder = await order.save();

    const orderItems = [];
    for (const [productId, qty] of qtyByProduct) {
        const product = await Product.findById(productId);
        const stock = Number(product.stock_quantity) || 0;

        orderItems.push({
            order_id: savedOrder._id,
            product_id: product._id,
            quantity: qty,
            unit_price: product.price
        });

        product.stock_quantity = Math.max(0, stock - qty);
        if (product.stock_quantity <= 0) {
            product.stock_status = 'out_of_stock';
        }
        await product.save();
    }

    await OrderItem.insertMany(orderItems);
    await CartItem.deleteMany({ cart_id: cartId });
    return savedOrder;
};
