const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');

global.window = global;
window.location = { href: '', search: '', pathname: '/product-detail.html' };

global.localStorage = {
  data: {},
  getItem(k) {
    return this.data[k] || null;
  },
  setItem(k, v) {
    this.data[k] = v;
  },
  removeItem(k) {
    delete this.data[k];
  }
};

eval(fs.readFileSync(path.join(jsDir, 'api-config.js'), 'utf8'));

window.apiFetch = async (reqPath, init) => {
  if (reqPath.includes('/api/carts/user/')) {
    return { ok: true, status: 200, data: { cart: { _id: 'cart_test' }, items: [] } };
  }
  if (reqPath.includes('/items') && init && init.method === 'POST') {
    return { ok: true, status: 201, data: {} };
  }
  return { ok: false, status: 404, data: { message: 'not used' } };
};

global.document = {
  getElementById: id => {
    if (id === 'qty') return { value: '2' };
    if (id === 'outOfStockModal') return { classList: { add: () => {} } };
    if (id === 'cartCount') return { textContent: '' };
    return null;
  }
};

eval(fs.readFileSync(path.join(jsDir, 'product-detail.js'), 'utf8'));

localStorage.setItem('userId', 'user_test_id');
localStorage.setItem('token', 'test_token');
localStorage.setItem(
  'selectedProduct',
  JSON.stringify({
    id: 'prod_test_id',
    title: 'iPhone 15 Pro Max',
    price: 45999,
    image: 'img/iphone.png',
    stock: 1,
    stock_quantity: 5
  })
);

(async () => {
  try {
    await addToCart();
    console.log('navigate to:', window.location.href);
    process.exit(0);
  } catch (err) {
    console.error('Error in addToCart:', err);
    process.exit(1);
  }
})();
