const User = require('../models/User');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

exports.getAllUsers = async () => {
    return await User.find();
};

exports.deleteUser = async (id) => {
    const user = await User.findById(id);
    if (!user) return null;

    if (user.role === 'supplier') {
        const productIds = await Product.find({ user_id: id }).distinct('_id');
        if (productIds.length > 0) {
            await CartItem.deleteMany({ product_id: { $in: productIds } });
            await Product.deleteMany({ user_id: id });
        }
    }

    return await User.findByIdAndDelete(id);
};
