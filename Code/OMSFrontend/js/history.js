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

async function renderHistory() {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  if (!userId || !token) {
    window.location.replace('login.html');
    return;
  }

  const emptyState = document.getElementById('emptyState');
  const historyWrapper = document.getElementById('historyWrapper');
  const tbody = document.getElementById('historyBody');

  if (!tbody) return;

  try {
    const { ok, data } = await apiFetch(`/api/orders/user/${userId}`);

    if (!ok || !Array.isArray(data)) {
      if (emptyState) emptyState.style.display = 'block';
      if (historyWrapper) historyWrapper.style.display = 'none';
      return;
    }

    const ordersWithItems = data;

    if (!ordersWithItems || ordersWithItems.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (historyWrapper) historyWrapper.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (historyWrapper) historyWrapper.style.display = 'block';

    let html = '';
    ordersWithItems.forEach(group => {
      const order = group.order;
      const dateStr = new Date(order.order_date).toLocaleDateString();

      group.items.forEach(item => {
        const title = item.product_id ? item.product_id.product_title : 'Unknown';
        const image = item.product_id
          ? (item.product_id.image_url || 'img/default-product.png')
          : 'img/default-product.png';
        const price = item.product_id ? item.product_id.price : 0;

        html += `
          <tr>
            <td>
              <img src="${image}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
            </td>
            <td>${title}</td>
            <td>${price.toLocaleString()} EGP</td>
            <td>${item.quantity}</td>
            <td>${dateStr}</td>
          </tr>
        `;
      });
    });

    tbody.innerHTML = html;
  } catch (error) {
    console.error('Failed to fetch history:', error);
  }
}

window.onload = () => {
  updateCartBadge();
  renderHistory();
};
