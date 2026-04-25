const LOGO_IMG = `<svg viewBox="0 0 24 24" width="26" height="26" fill="#bbb"><path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-5 18a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5-4H7V4h10v12z"/></svg>`;
const DELETE_IMG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`;

const DEFAULTS = [
  { id:1, title:'iPhone 15 Pro Max',   description:'Apple flagship with titanium design & A17 Pro chip',   qty:50, price:45999, image: 'img/iphone.png' },
  { id:2, title:'Samsung Galaxy S24',  description:'Flagship Android with advanced AI camera features',   qty:35, price:38500, image: 'img/samsung.png' },
  { id:3, title:'Xiaomi 14 Ultra',     description:'Premium Leica collaboration camera phone',            qty:20, price:29999, image: 'img/redmi.png' },
  { id:4, title:'AirPods Pro 2nd Gen', description:'Premium earbuds with active noise cancellation',     qty:80, price:8500,  image: 'img/earbuds.png'  },
  { id:5, title:'Samsung 45W Charger', description:'Fast charging adapter compatible with USB-C devices', qty:100,price:1200,  image: 'img/charger.png'  },
];

let products = JSON.parse(localStorage.getItem('supplierProducts') || 'null') || DEFAULTS;

function save() { localStorage.setItem('supplierProducts', JSON.stringify(products)); }

function renderProducts() {
  const wrapper = document.getElementById('productsWrapper');
  const noData  = document.getElementById('noData');
  const tbody   = document.getElementById('productsBody');

  const totalProdEl = document.getElementById('totalProducts');
  const totalProfEl = document.getElementById('totalProfit');

  if (totalProdEl) totalProdEl.textContent = products.length;
  
  // Profit now reflects actual sales from this device
  const profit = parseFloat(localStorage.getItem('totalSupplierProfit') || '0');
  if (totalProfEl) totalProfEl.textContent = profit.toLocaleString() + ' EGP';

  if (products.length === 0) {
    if (wrapper) wrapper.style.display = 'none';
    if (noData) noData.style.display  = 'block';
    return;
  }
  if (wrapper) wrapper.style.display = 'block';
  if (noData) noData.style.display  = 'none';

  if (tbody) {
    tbody.innerHTML = products.map((p, i) => `
      <tr>
        <td><div class="td-img">${p.image ? `<img src="${p.image}" alt="Product">` : LOGO_IMG}</div></td>
        <td class="td-title">${p.title}</td>
        <td class="td-desc">${p.description}</td>
        <td>${p.qty}</td>
        <td class="td-price">${p.price.toLocaleString()} EGP</td>
        <td>
          <button class="btn-icon-delete" onclick="deleteProduct(${i})" title="Delete product">${DELETE_IMG}</button>
        </td>
      </tr>
    `).join('');
  }
}

function deleteProduct(idx) {
  products.splice(idx, 1);
  save();
  renderProducts();
  const mod = document.getElementById('deletedModal');
  if (mod) mod.classList.add('active');
}

function closeModal(id) { 
  const mod = document.getElementById(id);
  if (mod) mod.classList.remove('active'); 
}

function handleLogout() {
  localStorage.removeItem('currentUser');
  window.location.replace('login.html');
}

window.onload = () => {
  renderProducts();
};
