const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');

global.window = global;
window.location = { href: '', search: '' };

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

localStorage.setItem('userId', 'u1');
localStorage.setItem('token', 't1');

eval(fs.readFileSync(path.join(jsDir, 'api-config.js'), 'utf8'));

window.apiFetch = async reqPath => {
  if (reqPath.includes('/api/carts/user/')) {
    return {
      ok: true,
      status: 200,
      data: {
        cart: { _id: 'c1' },
        items: [
          {
            _id: 'item1',
            quantity: 2,
            product_id: {
              product_title: 'iPhone 15 Pro Max',
              price: 45999,
              image_url: 'img/iphone.png'
            }
          }
        ]
      }
    };
  }
  return { ok: false, status: 404, data: {} };
};

const innerHTMLs = {};
const textContents = {};

global.document = {
  getElementById: id => {
    return {
      style: {},
      set innerHTML(val) {
        innerHTMLs[id] = val;
      },
      get innerHTML() {
        return innerHTMLs[id];
      },
      set textContent(val) {
        textContents[id] = val;
      },
      get textContent() {
        return textContents[id];
      }
    };
  }
};

eval(fs.readFileSync(path.join(jsDir, 'cart.js'), 'utf8'));

(async () => {
  try {
    await renderCart();
    console.log('Cart Items HTML:');
    console.log(innerHTMLs.cartItems);
    console.log('Total Price Text:');
    console.log(textContents.totalPrice);
    process.exit(0);
  } catch (err) {
    console.error('Error in renderCart:', err);
    process.exit(1);
  }
})();
