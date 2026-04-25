async function handleLogin() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const role     = document.getElementById('role').value;

  if (!email || !password) {
    showError(); return;
  }

  // Hardcoded admin — no API call needed
  if (role === 'Admin') {
    if (email === 'admin@store.com' && password === 'Admin1234') {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('registeredFirstName', 'Admin');
      window.location.href = 'admin-dashboard.html';
      return;
    }
    showError(); return;
  }

  // Hardcoded default supplier — no API call needed
  if (role === 'Supplier') {
    if (email === 'supplier@store.com' && password === 'Supplier1') {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('registeredFirstName', 'Supplier');
      window.location.href = 'supplier-dashboard.html';
      return;
    }
    const suppliers = JSON.parse(localStorage.getItem('adminSuppliers') || '[]');
    const sup = suppliers.find(s => s.email === email && s.password === password);
    if (sup) {
      localStorage.setItem('currentUser', email);
      localStorage.setItem('registeredFirstName', sup.name.split(' ')[0]);
      window.location.href = 'supplier-dashboard.html';
      return;
    }
    showError(); return;
  }

  // Clients — use the API
  try {
    const data = await loginAPI(email, password);

    localStorage.setItem('currentUser', email);

    // Save first name from API response — data.user.firstName
    if (data.user && data.user.firstName) {
      localStorage.setItem('registeredFirstName', data.user.firstName);
    }

    window.location.href = 'home.html';

  } catch (error) {
    showError();
  }
}

function showError() {
  document.getElementById('errorModal').classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
