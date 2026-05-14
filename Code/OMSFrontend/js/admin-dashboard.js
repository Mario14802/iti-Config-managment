(function gate() {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    window.location.replace('home.html');
  }
})();

let usersList = [];

async function fetchUsers() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('login.html');
    return;
  }

  try {
    const { ok, data } = await apiFetch('/api/users');

    if (ok && Array.isArray(data)) {
      usersList = data;
      renderTables();
    } else {
      console.error('Failed to fetch users', data);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

function renderTables() {
  const suppliers = usersList.filter(u => u.role === 'supplier');
  const clients = usersList.filter(u => u.role === 'client');

  document.getElementById('totalSuppliers').textContent = suppliers.length;
  document.getElementById('totalClients').textContent = clients.length;

  const sWrapper = document.getElementById('suppliersWrapper');
  const sNoData = document.getElementById('noSuppliers');
  const sBody = document.getElementById('suppliersBody');

  if (suppliers.length === 0) {
    sWrapper.style.display = 'none';
    sNoData.style.display = 'block';
  } else {
    sWrapper.style.display = 'block';
    sNoData.style.display = 'none';
    sBody.innerHTML = suppliers.map(s => `
      <tr>
        <td>${s.firstName} ${s.lastName || ''}</td>
        <td>${s.email}</td>
        <td>********</td>
        <td>${s.phone_number || 'N/A'}</td>
        <td>
          <button class="btn btn-primary" style="background:#dc3545;" onclick="deleteUser('${s._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  const cWrapper = document.getElementById('clientsWrapper');
  const cNoData = document.getElementById('noClients');
  const cBody = document.getElementById('clientsBody');

  if (clients.length === 0) {
    cWrapper.style.display = 'none';
    cNoData.style.display = 'block';
  } else {
    cWrapper.style.display = 'block';
    cNoData.style.display = 'none';
    cBody.innerHTML = clients.map(c => `
      <tr>
        <td>${c.firstName}</td>
        <td>${c.lastName || ''}</td>
        <td>${c.email}</td>
        <td>********</td>
        <td>
          <button class="btn btn-primary" style="background:#dc3545;" onclick="deleteUser('${c._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }
}

async function deleteUser(id) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const { ok } = await apiFetch(`/api/users/${id}`, { method: 'DELETE' });

    if (ok) {
      document.getElementById('deletedModal').classList.add('active');
      usersList = usersList.filter(u => u._id !== id);
      renderTables();
    } else {
      console.error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
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
  fetchUsers();
};
