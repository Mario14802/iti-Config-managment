const DELIVERY_FEE = 0;

function getCart() { 
  const user = localStorage.getItem('currentUser') || 'guest';
  return JSON.parse(localStorage.getItem('cart_' + user) || '[]'); 
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = getCart().reduce((s, i) => s + i.qty, 0);
}

function calcTotals() {
  const subtotal = getCart().reduce((s, i) => s + i.price * i.qty, 0);
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('orderTotal');
  if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' EGP';
  if (totalEl) totalEl.textContent = (subtotal + DELIVERY_FEE).toLocaleString() + ' EGP';
}

function placeOrder() {
  const phone   = document.getElementById('phone').value.trim();
  const city    = document.getElementById('city').value;
  const address = document.getElementById('address').value.trim();

  // SIQ_23: phone 11 digits; SIQ_24: city not blank; SIQ_25: address min 10
  if (!phone || phone.length !== 11 || !/^\d+$/.test(phone) || !city || address.length < 10) {
    document.getElementById('invalidModal').classList.add('active');
    return;
  }

  // Save to history, clear cart (SIQ_26)
  const cart = getCart();
  const user = localStorage.getItem('currentUser') || 'guest';
  const historyKey = 'history_' + user;
  const cartKey = 'cart_' + user;
  
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`;
  
  let orderTotal = 0;
  cart.forEach(item => {
    history.unshift({ ...item, date: dateStr });
    orderTotal += item.price * item.qty;
  });

  // Track global supplier profit (new requirement)
  let totalProfit = parseFloat(localStorage.getItem('totalSupplierProfit') || '0');
  totalProfit += orderTotal;
  localStorage.setItem('totalSupplierProfit', totalProfit);

  localStorage.setItem(historyKey, JSON.stringify(history));
  localStorage.setItem(cartKey, '[]');

  updateCartBadge();
  document.getElementById('successModal').classList.add('active');
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.onload = () => {
  updateCartBadge();
  calcTotals();
};
