const BASE_URL = "https://mobilestore-production.up.railway.app";

async function loginAPI(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

async function handleLogin() {
  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showError();
    return;
  }

  try {
    const data = await loginAPI(email, password);

    // ✅ Save user data
    localStorage.setItem('currentUser', data.user.email);
    localStorage.setItem('registeredFirstName', data.user.firstName);
    localStorage.setItem('role', data.user.role);

    // ✅ Save token if exists
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    // ✅ Redirect based on role
    if (data.user.role === "admin") {
      window.location.href = 'admin-dashboard.html';
    } else if (data.user.role === "supplier") {
      window.location.href = 'supplier-dashboard.html';
    } else {
      window.location.href = 'home.html';
    }

  } catch (error) {
    showError();
  }
}

// ================= UI =================
function showError() {
  document.getElementById('errorModal').classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});