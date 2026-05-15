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

function loadPaymentTotals() {
  const total = parseFloat(localStorage.getItem('checkoutTotal')) || 0;
  if (total === 0) {
    window.location.replace('cart.html');
    return;
  }

  const subtotalEl = document.getElementById('subtotal');
  const orderTotalEl = document.getElementById('orderTotal');

  if (subtotalEl) subtotalEl.textContent = total.toLocaleString() + ' EGP';
  if (orderTotalEl) orderTotalEl.textContent = (total).toLocaleString() + ' EGP';
}

async function placeOrder() {
  const phone = document.getElementById('phone').value.trim();
  const city = document.getElementById('city').value;
  const address = document.getElementById('address').value.trim();

  if (!phone || phone.length !== 11 || !city || !address || address.length < 10) {
    document.getElementById('invalidModal').classList.add('active');
    return;
  }

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const cartId = localStorage.getItem('cartId');
  const total = parseFloat(localStorage.getItem('checkoutTotal')) || 0;

  if (!userId || !token || !cartId) {
    window.location.replace('login.html');
    return;
  }

  const name = localStorage.getItem('registeredFirstName') || 'Customer';

  const payload = {
    total_price: total + 50,
    client_name: name,
    phone_number: phone,
    address: address,
    city: city
  };

  try {
    const { ok, data } = await apiFetch(`/api/carts/${cartId}/checkout`, {
      method: 'POST',
      body: payload
    });

    if (ok) {
      localStorage.removeItem('cartId');
      localStorage.removeItem('checkoutTotal');
      updateCartBadge();
      document.getElementById('successModal').classList.add('active');
    } else {
      document.getElementById('invalidModal').classList.add('active');
    }
  } catch (error) {
    console.error(error);
    document.getElementById('invalidModal').classList.add('active');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

window.onload = () => {
  updateCartBadge();
  loadPaymentTotals();
};
