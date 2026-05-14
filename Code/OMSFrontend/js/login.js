async function loginAPI(email, password) {
  const { ok, data } = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false
  });
  if (!ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

async function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError();
    return;
  }

  try {
    const data = await loginAPI(email, password);

    localStorage.setItem('currentUser', data.user.email);
    localStorage.setItem('registeredFirstName', data.user.firstName);
    localStorage.setItem('role', data.user.role);
    localStorage.setItem('userId', data.user._id);
    localStorage.removeItem('cartId');

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    if (data.user.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else if (data.user.role === 'supplier') {
      window.location.href = 'supplier-dashboard.html';
    } else {
      window.location.href = 'home.html';
    }
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

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});
