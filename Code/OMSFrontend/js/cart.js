const LOGO_IMG = `<svg viewBox="0 0 24 24" width="32" height="32" fill="#bbb"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V4h10v12z"/></svg>`;
const DELETE_IMG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

function getCart() { 
  const user = localStorage.getItem('currentUser') || 'guest';
  return JSON.parse(localStorage.getItem('cart_' + user) || '[]'); 
}
function saveCart(cart) { 
  const user = localStorage.getItem('currentUser') || 'guest';
  localStorage.setItem('cart_' + user, JSON.stringify(cart)); 
}

function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const cart = getCart();
  const itemsEl  = document.getElementById('cartItems');
  const emptyEl  = document.getElementById('emptyState');
  const stripEl  = document.getElementById('paymentStrip');

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    emptyEl.style.display = 'block';
    stripEl.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';
  stripEl.style.display = 'block';

  let html = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    let opts = '';
    for (let i = 1; i <= 5; i++) opts += `<option${i === item.qty ? ' selected' : ''}>${i}</option>`;
    
    const imgTag = item.image ? `<img src="${item.image}" alt="Product">` : LOGO_IMG;
    
    html += `
      <div class="cart-item">
        <div class="cart-item-img">${imgTag}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} EGP</div>
        </div>
        <div class="cart-item-actions">
          <select class="qty-select" onchange="changeQty(${idx},this.value)">${opts}</select>
          <button class="btn-icon-delete" onclick="removeItem(${idx})" title="Remove item">${DELETE_IMG}</button>
        </div>
      </div>`;
  });

  itemsEl.innerHTML = html;
  document.getElementById('totalPrice').textContent = total.toLocaleString() + ' EGP';
}

function changeQty(idx, val) {
  let cart = getCart();
  cart[idx].qty = parseInt(val);
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

function removeItem(idx) {
  let cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  updateCartBadge();
  renderCart();
}

function handleCheckout() {
  if (getCart().length === 0) {
    document.getElementById('emptyCartModal').classList.add('active');
    return;
  }
  window.location.href = 'payment.html';
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.onload = () => {
  updateCartBadge();
  renderCart();
};
