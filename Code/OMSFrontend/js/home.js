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

function displayUserInfo() {
  const name = localStorage.getItem('registeredFirstName') || 'Customer';
  const nameEl = document.getElementById('userName');
  const initEl = document.getElementById('userInitial');
  if (nameEl) nameEl.textContent = name;
  if (initEl) initEl.textContent = name.charAt(0).toUpperCase();
}

async function renderProducts() {
  let backendProducts = [];
  try {
    const { ok, data } = await apiFetch('/api/products', { auth: false });
    if (ok && Array.isArray(data)) {
      backendProducts = data.map(p => {
        const stockQty = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0;
        return {
          id: p._id,
          title: p.product_title,
          price: p.price,
          image: p.image_url || 'img/default-product.png',
          stock: stockQty > 0 ? 1 : 0,
          stock_quantity: stockQty,
          description: p.description || ''
        };
      });
    }
  } catch (err) {
    console.error('Failed to fetch products', err);
  }

  const supplierProducts = backendProducts;

  const mGrid = document.getElementById('mobilesGrid');
  const aGrid = document.getElementById('accessoriesGrid');

  if (!mGrid || !aGrid) return;

  const createCard = p => {
    const stockStatus = (p.stock !== undefined) ? p.stock : (p.qty > 0 ? 1 : 0);
    const qtyAvail = typeof p.stock_quantity === 'number' ? p.stock_quantity : 0;
    return `
      <a href="product-detail.html?id=${encodeURIComponent(p.id)}" class="product-card" data-stock="${stockStatus}" data-id="${p.id}" data-stock-qty="${qtyAvail}">
        <div class="card-img-placeholder">
          <img src="${p.image}" alt="${p.title}">
          ${stockStatus === 0 ? '<span class="out-of-stock-badge">OUT OF STOCK</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-title">${p.title}</div>
          <div class="card-price">${Number(p.price).toLocaleString()} EGP</div>
          <span class="hidden-desc" style="display:none;">${p.description || ''}</span>
        </div>
      </a>
    `;
  };

  const isAccessory = t =>
    t.toLowerCase().includes('buds') ||
    t.toLowerCase().includes('charger') ||
    t.toLowerCase().includes('case');

  const supMobiles = supplierProducts.filter(p => !isAccessory(p.title));
  const supAccess = supplierProducts.filter(p => isAccessory(p.title));

  mGrid.innerHTML = supMobiles.map(createCard).join('');
  aGrid.innerHTML = supAccess.map(createCard).join('');

  document.querySelectorAll('.product-card[data-stock="0"]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('outOfStockModal').classList.add('active');
    });
  });
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('registeredFirstName');
  localStorage.removeItem('userId');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  localStorage.removeItem('cartId');
  localStorage.removeItem('checkoutTotal');
  window.location.replace('login.html');
}

window.onload = async () => {
  displayUserInfo();
  await updateCartBadge();
  await renderProducts();

  document.getElementById('mobilesGrid').addEventListener('click', handleProductClick);
  document.getElementById('accessoriesGrid').addEventListener('click', handleProductClick);
};

function handleProductClick(e) {
  const card = e.target.closest('.product-card');
  if (!card) return;
  e.preventDefault();

  if (card.dataset.stock === '0') {
    document.getElementById('outOfStockModal').classList.add('active');
  } else {
    const id = card.dataset.id;
    const title = card.querySelector('.card-title').textContent;
    const priceText = card.querySelector('.card-price').textContent;
    const img = card.querySelector('img').getAttribute('src');
    const desc = card.querySelector('.hidden-desc').textContent;
    const stock = card.dataset.stock;
    const href = card.getAttribute('href') || '';
    const match = href.match(/[?&]id=([^&]+)/);
    const productId = match ? decodeURIComponent(match[1]) : id;
    const priceNum = parseFloat(priceText.replace(/,/g, '').replace('EGP', '').trim()) || 0;
    const stockQty = parseInt(card.dataset.stockQty, 10) || 0;
    localStorage.setItem(
      'selectedProduct',
      JSON.stringify({
        id: productId,
        title,
        price: priceNum,
        image: img,
        description: desc,
        stock,
        stock_quantity: stockQty
      })
    );
    window.location.href = 'product-detail.html?id=' + encodeURIComponent(productId);
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
