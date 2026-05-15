function updateCartBadge() {
  const user = localStorage.getItem('currentUser') || 'guest';
  const cart = JSON.parse(localStorage.getItem('cart_' + user) || '[]');
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function displayUserInfo() {
  const name = localStorage.getItem('registeredFirstName') || 'John Doe';
  const nameEl = document.getElementById('userName');
  const initEl = document.getElementById('userInitial');
  if (nameEl) nameEl.textContent = name;
  if (initEl) initEl.textContent = name.charAt(0).toUpperCase();
}

const DEFAULT_MOBILES = [
  { title: 'iPhone 15 Pro Max', price: 60000, image: 'img/iphone.png', stock: 1 },
  { title: 'Samsung Galaxy S24', price: 40500, image: 'img/samsung.png', stock: 1 },
  { title: 'Xiaomi 14 Ultra', price: 25000, image: 'img/xiaomi.png', stock: 0 }
];

const DEFAULT_ACCESSORIES = [
  { title: 'AirPods Pro 2nd Gen', price: 3500, image: 'img/Airpods.png', stock: 1 },
  { title: 'Samsung 45W Charger', price: 2000, image: 'img/charger.png', stock: 1 },
  { title: 'Leather Phone Case', price: 200, image: 'img/Case.png', stock: 1 }
];

function renderProducts() {
  const supplierProducts = JSON.parse(localStorage.getItem('supplierProducts') || '[]');
  
  const mGrid = document.getElementById('mobilesGrid');
  const aGrid = document.getElementById('accessoriesGrid');
  
  if (!mGrid || !aGrid) return;

  const createCard = p => {
    const stockStatus = (p.stock !== undefined) ? p.stock : (p.qty > 0 ? 1 : 0);
    return `
      <a href="product-detail.html?id=${p.title.replace(/\s+/g, '')}" class="product-card" data-stock="${stockStatus}">
        <div class="card-img-placeholder">
          <img src="${p.image}" alt="${p.title}">
          ${stockStatus === 0 ? '<span class="out-of-stock-badge">OUT OF STOCK</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-title">${p.title}</div>
          <div class="card-price">${p.price.toLocaleString()} EGP</div>
          <span class="hidden-desc" style="display:none;">${p.description || ''}</span>
        </div>
      </a>
    `;
  };

  // Filter mobiles vs accessories 
  const isAccessory = t => t.toLowerCase().includes('buds') || t.toLowerCase().includes('charger') || t.toLowerCase().includes('case');
  
  const supMobiles = supplierProducts.filter(p => !isAccessory(p.title));
  const supAccess   = supplierProducts.filter(p => isAccessory(p.title));

  mGrid.innerHTML = [...DEFAULT_MOBILES, ...supMobiles].map(createCard).join('');
  aGrid.innerHTML = [...DEFAULT_ACCESSORIES, ...supAccess].map(createCard).join('');

  // Re-attach listeners for out of stock
  document.querySelectorAll('.product-card[data-stock="0"]').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('outOfStockModal').classList.add('active');
    });
  });
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('registeredFirstName'); // Optional: clear name too
  window.location.replace('login.html');
}

window.onload = () => {
  displayUserInfo();
  updateCartBadge();
  renderProducts();

  // Attach dynamic product selection listener
  document.getElementById('mobilesGrid').addEventListener('click', handleProductClick);
  document.getElementById('accessoriesGrid').addEventListener('click', handleProductClick);
};

function handleProductClick(e) {
  const card = e.target.closest('.product-card');
  if (!card) return;
  e.preventDefault();

  if (card.dataset.stock === "0") {
    document.getElementById('outOfStockModal').classList.add('active');
  } else {
    const title = card.querySelector('.card-title').textContent;
    const price = card.querySelector('.card-price').textContent;
    const img   = card.querySelector('img').getAttribute('src');
    const desc  = card.querySelector('.hidden-desc').textContent;
    const stock = card.dataset.stock;
    localStorage.setItem('selectedProduct', JSON.stringify({ title, price, image: img, description: desc, stock }));
    window.location.href = 'product-detail.html';
  }
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
