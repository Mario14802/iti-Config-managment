const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');

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
    const Product = require('../models/Product');
    const cartItems = await CartItem.find({ cart_id: cartId });
    
    // Check stock
    for (const item of cartItems) {
        const product = await Product.findById(item.product_id);
        if (product && product.stock_quantity < item.quantity) {
            throw new Error(`Not enough stock for one of the products`);
        }
    }

    const order = new Order({ ...orderDetails, user_id: orderDetails.user_id });
    const savedOrder = await order.save();
    
    if (cartItems.length > 0) {
        const orderItems = cartItems.map(item => ({
            order_id: savedOrder._id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: 0 // Simplification
        }));
        await OrderItem.insertMany(orderItems);
        
        // Deduct stock
        for (const item of cartItems) {
            const product = await Product.findById(item.product_id);
            if (product) {
                if (typeof product.quantity !== 'number') {
                    // For older products, set their initial quantity before deduction
                    product.quantity = product.stock_quantity;
                }
                product.stock_quantity -= item.quantity;
                if (product.stock_quantity <= 0) {
                    product.stock_quantity = 0;
                    product.stock_status = 'out_of_stock';
                }
                await product.save();
            }
        }
    }
    
    // Clear cart
    await CartItem.deleteMany({ cart_id: cartId });
    return savedOrder;
};
