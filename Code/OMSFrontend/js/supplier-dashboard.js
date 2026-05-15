(function gate() {
  const role = localStorage.getItem('role');
  if (role !== 'supplier' && role !== 'admin') {
    window.location.replace('home.html');
  }
})();

let productsList = [];

function supplierIdFromProduct(p) {
  if (!p || !p.user_id) return '';
  if (typeof p.user_id === 'object' && p.user_id._id) return String(p.user_id._id);
  return String(p.user_id);
}

async function fetchSupplierProducts() {
  const token = localStorage.getItem('token');
  const myId = localStorage.getItem('userId');
  if (!token || !myId) {
    window.location.replace('login.html');
    return;
  }

  try {
    const { ok, data } = await apiFetch('/api/products');

    if (ok && Array.isArray(data)) {
      const role = localStorage.getItem('role');
      if (role === 'admin') {
        productsList = data;
      } else {
        productsList = data.filter(p => supplierIdFromProduct(p) === String(myId));
      }
      renderTable();
    } else {
      console.error('Failed to fetch products', data);
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function renderTable() {
  const tbody = document.getElementById('productsBody');
  const wrapper = document.getElementById('productsWrapper');
  const noData = document.getElementById('noData');
  const totalCount = document.getElementById('totalProducts');
  const totalProfit = document.getElementById('totalProfit');

  if (!tbody) return;

  if (productsList.length === 0) {
    wrapper.style.display = 'none';
    noData.style.display = 'flex';
    totalCount.textContent = '0';
    totalProfit.textContent = '0 EGP';
    return;
  }

  wrapper.style.display = 'block';
  noData.style.display = 'none';
  totalCount.textContent = productsList.length;

  let profit = 0;
  const rows = productsList.map(p => {
    const initialQty = typeof p.quantity === 'number' ? p.quantity : p.stock_quantity || 0;
    const currentStock = p.stock_quantity || 0;
    const soldCount = Math.max(0, initialQty - currentStock);
    profit += p.price * soldCount;
    return `
      <tr>
        <td>
          <img src="${p.image_url || 'img/default-product.png'}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
        </td>
        <td>${p.product_title}</td>
        <td><div class="desc-cell" title="${p.description || ''}">${p.description || ''}</div></td>
        <td>${p.stock_quantity}</td>
        <td>${p.price.toLocaleString()} EGP</td>
        <td>
          <button class="btn btn-primary" style="background:#dc3545;" onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = rows.join('');
  totalProfit.textContent = profit.toLocaleString() + ' EGP';
}

async function deleteProduct(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const { ok } = await apiFetch(`/api/products/${id}`, { method: 'DELETE' });

    if (ok) {
      document.getElementById('deletedModal').classList.add('active');
      productsList = productsList.filter(p => p._id !== id);
      renderTable();
    } else {
      console.error('Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
  }
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

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

window.onload = () => {
  fetchSupplierProducts();
};
