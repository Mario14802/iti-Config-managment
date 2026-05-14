async function updateCartBadge() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const badge = document.getElementById('cartCount');
  if (!badge) return;

  if (!userId || !token) {
    badge.textContent = '0';
    return;
  }

  try {
    const { ok, data } = await apiFetch(`/api/carts/user/${userId}`);
    if (ok && data.items) {
      badge.textContent = data.items.reduce((s, i) => s + i.quantity, 0);
    } else {
      badge.textContent = '0';
    }
  } catch (err) {
    console.error(err);
    badge.textContent = '0';
  }
}

async function renderCart() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!userId || !token) {
    window.location.replace('login.html');
    return;
  }

  const cartItemsDiv = document.getElementById('cartItems');
  const emptyState = document.getElementById('emptyState');
  const paymentStrip = document.getElementById('paymentStrip');
  const totalPriceEl = document.getElementById('totalPrice');

  try {
    const { ok, data } = await apiFetch(`/api/carts/user/${userId}`);

    if (!ok) {
      if (emptyState) emptyState.style.display = 'block';
      if (paymentStrip) paymentStrip.style.display = 'none';
      if (cartItemsDiv) cartItemsDiv.innerHTML = '';
      return;
    }

    const items = data.items || [];

    if (items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (paymentStrip) paymentStrip.style.display = 'none';
      if (cartItemsDiv) cartItemsDiv.innerHTML = '';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (paymentStrip) paymentStrip.style.display = 'block';

    let total = 0;
    let html = '';

    items.forEach(item => {
      const price = item.product_id ? item.product_id.price : 0;
      const title = item.product_id ? item.product_id.product_title : 'Unknown';
      const image = item.product_id
        ? (item.product_id.image_url || 'img/default-product.png')
        : 'img/default-product.png';

      total += price * item.quantity;
      html += `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${image}" alt="${title}">
          </div>
          <div class="cart-item-info">
            <div class="cart-item-title">${title}</div>
            <div class="cart-item-price">${price.toLocaleString()} EGP</div>
          </div>
          <div class="cart-item-qty">
            Qty: ${item.quantity}
          </div>
          <button class="btn btn-primary" style="background:#dc3545;" onclick="removeItem('${item._id}')">Remove</button>
        </div>
      `;
    });

    if (cartItemsDiv) cartItemsDiv.innerHTML = html;
    if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString() + ' EGP';

    localStorage.setItem('checkoutTotal', String(total));
    if (data.cart && data.cart._id) {
      localStorage.setItem('cartId', data.cart._id);
    }
  } catch (error) {
    console.error('Failed to load cart', error);
  }
}

async function removeItem(itemId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const { ok } = await apiFetch(`/api/carts/items/${itemId}`, { method: 'DELETE' });

    if (ok) {
      updateCartBadge();
      renderCart();
    } else {
      alert('Failed to remove item');
    }
  } catch (error) {
    console.error(error);
  }
}

function handleCheckout() {
  const cartId = localStorage.getItem('cartId');
  if (!cartId) {
    const modal = document.getElementById('emptyCartModal');
    if (modal) modal.classList.add('active');
    return;
  }
  window.location.href = 'payment.html';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

window.onload = () => {
  updateCartBadge();
  renderCart();
};
