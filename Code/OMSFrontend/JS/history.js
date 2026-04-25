const LOGO_IMG = `<svg viewBox="0 0 24 24" width="26" height="26" fill="#bbb"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V4h10v12z"/></svg>`;

function updateCartBadge() {
  const user = localStorage.getItem('currentUser') || 'guest';
  const cart = JSON.parse(localStorage.getItem('cart_' + user) || '[]');
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function renderHistory() {
  const user = localStorage.getItem('currentUser') || 'guest';
  const historyKey = 'history_' + user;
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  
  // Fallback for default demo user (John Doe) if history is empty
  if (history.length === 0 && (user === 'guest' || user === 'john@example.com')) {
    history = [
      { title: 'iPhone 15 Pro Max',   price: 45999, qty: 1, date: '16/4/2026', image: 'img/iphone.png' },
      { title: 'Samsung Galaxy S24',  price: 38500, qty: 1, date: '15/4/2026', image: 'img/samsung.png' },
      { title: 'AirPods Pro 2nd Gen', price: 8500,  qty: 1, date: '15/4/2026', image: 'img/earbuds.png' },
      { title: 'Leather Phone Case',  price: 750,   qty: 2, date: '15/4/2026', image: 'img/type_c.png' },
      { title: 'Samsung 45W Charger', price: 1200,  qty: 1, date: '15/4/2026', image: 'img/charger.png' }
    ];
  }

  const tbody   = document.getElementById('historyBody');
  const wrapper = document.getElementById('historyWrapper');
  const empty   = document.getElementById('emptyState');

  if (history.length === 0) {
    if (wrapper) wrapper.style.display = 'none';
    if (empty) empty.style.display   = 'block';
    return;
  }

  if (wrapper) wrapper.style.display = 'block';
  if (empty) empty.style.display   = 'none';

  if (tbody) {
    tbody.innerHTML = history.map(item => `
      <tr>
        <td><div class="td-img">${item.image ? `<img src="${item.image}" alt="Product">` : LOGO_IMG}</div></td>
        <td>${item.title}</td>
        <td class="td-price">${Number(item.price).toLocaleString()} EGP</td>
        <td>${item.qty}</td>
        <td class="td-date">${item.date}</td>
      </tr>
    `).join('');
  }
}

window.onload = () => {
  updateCartBadge();
  renderHistory();
};
