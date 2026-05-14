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

async function tryLoadProductFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return false;

  const { ok, data } = await apiFetch('/api/products', { auth: false });
  if (!ok || !Array.isArray(data)) return false;

  const p = data.find(x => String(x._id) === String(id));
  if (!p) return false;

  const stockQty = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0;
  const sel = {
    id: p._id,
    title: p.product_title,
    price: p.price,
    image: p.image_url || 'img/default-product.png',
    description: p.description || '',
    stock: stockQty > 0 ? 1 : 0,
    stock_quantity: stockQty
  };
  localStorage.setItem('selectedProduct', JSON.stringify(sel));
  return true;
}

function buildQtyOptions(maxQty) {
  const sel = document.getElementById('qty');
  if (!sel) return;
  const max = Math.min(20, Math.max(1, maxQty > 0 ? maxQty : 1));
  sel.innerHTML = '';
  for (let i = 1; i <= max; i++) {
    const opt = document.createElement('option');
    opt.value = String(i);
    opt.textContent = String(i);
    sel.appendChild(opt);
  }
}

function loadProduct() {
  const productStr = localStorage.getItem('selectedProduct');
  if (!productStr) {
    window.location.replace('home.html');
    return;
  }

  const p = JSON.parse(productStr);
  document.title = `${p.title} — Mobile Store`;

  const titleEl = document.getElementById('productTitle');
  if (titleEl) titleEl.textContent = p.title;

  const descEl = document.getElementById('productDesc');
  if (descEl) descEl.textContent = p.description || p.title;

  const priceEl = document.getElementById('productPrice');
  if (priceEl) {
    const priceNum =
      typeof p.price === 'string'
        ? parseFloat(String(p.price).replace(/,/g, '').replace('EGP', '').trim())
        : Number(p.price);
    priceEl.textContent = (Number.isFinite(priceNum) ? priceNum : 0).toLocaleString() + ' EGP';
  }

  const imgEl = document.querySelector('.product-detail-image-wrap img');
  if (imgEl) {
    imgEl.src = p.image || 'img/default-product.png';
    imgEl.alt = p.title;
  }

  const badgeEl = document.querySelector('.availability-badge');
  if (badgeEl) {
    if (p.stock === '0' || p.stock === 0) {
      badgeEl.className = 'availability-badge out-of-stock';
      badgeEl.textContent = 'Out of Stock';
    } else {
      badgeEl.className = 'availability-badge in-stock';
      badgeEl.textContent = 'In Stock';
    }
  }

  const maxQty =
    typeof p.stock_quantity === 'number' && p.stock_quantity > 0 ? p.stock_quantity : p.stock > 0 ? 5 : 1;
  buildQtyOptions(p.stock > 0 ? maxQty : 1);
}

async function addToCart() {
  try {
    const productStr = localStorage.getItem('selectedProduct');
    if (!productStr) {
      alert('No product selected.');
      return;
    }
    const p = JSON.parse(productStr);

    if (p.stock === '0' || p.stock === 0) {
      document.getElementById('outOfStockModal').classList.add('active');
      return;
    }

    const qtySelect = document.getElementById('qty');
    let qty = qtySelect && qtySelect.value ? parseInt(qtySelect.value, 10) : 1;
    const maxStock =
      typeof p.stock_quantity === 'number' && p.stock_quantity > 0 ? p.stock_quantity : qty;
    if (qty > maxStock) qty = maxStock;
    if (qty < 1) qty = 1;

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      window.location.replace('login.html');
      return;
    }

    let cartId = localStorage.getItem('cartId');
    const cartLookup = await apiFetch(`/api/carts/user/${userId}`);

    if (cartLookup.ok && cartLookup.data && cartLookup.data.cart) {
      cartId = cartLookup.data.cart._id;
    } else if (cartLookup.status === 404) {
      const created = await apiFetch('/api/carts', {
        method: 'POST',
        body: { user_id: userId }
      });
      if (!created.ok || !created.data || !created.data._id) {
        alert('Could not create cart: ' + (created.data && created.data.message ? created.data.message : 'Unknown error'));
        return;
      }
      cartId = created.data._id;
    } else {
      alert('Could not load cart: ' + (cartLookup.data && cartLookup.data.message ? cartLookup.data.message : 'Unknown error'));
      return;
    }

    localStorage.setItem('cartId', cartId);

    const addRes = await apiFetch(`/api/carts/${cartId}/items`, {
      method: 'POST',
      body: { product_id: p.id, quantity: qty }
    });

    if (addRes.ok) {
      await updateCartBadge();
      window.location.href = 'cart.html';
    } else {
      alert('Failed to add to cart: ' + (addRes.data.message || 'Unknown error'));
    }
  } catch (error) {
    console.error(error);
    alert('Error adding to cart: ' + error.message);
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

window.onload = async () => {
  if (!localStorage.getItem('selectedProduct')) {
    await tryLoadProductFromQuery();
  }
  updateCartBadge();
  loadProduct();
};
