const BASE_URL = "https://mobilestore-production.up.railway.app";

// ================= REGISTER API =================
async function registerAPI(userData) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// ================= HANDLE REGISTER =================
async function handleRegister() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const email     = document.getElementById('email').value.trim();
  const password  = document.getElementById('password').value;

  const isNameOk     = name => /^[a-zA-Z\s]+$/.test(name) && name.length >= 2 && name.length <= 20;
  const isEmailOk    = email => email.length > 0 && email.includes('@') && !email.includes(' ');
  const isPasswordOk = password => password.length >= 8 && /[A-Z]/.test(password);

  if (!isNameOk(firstName) || !isNameOk(lastName) || !isEmailOk(email) || !isPasswordOk(password)) {
    document.getElementById('errorModal').classList.add('active');
    return;
  }

  const userData = {
    firstName,
    lastName,
    email,
    password,
    role: 'client'
  };

  try {
    // ✅ Call backend API (real registration)
    const data = await registerAPI(userData);

    // ✅ Save first name locally for UI فقط
    localStorage.setItem('registeredFirstName', firstName);

    // ✅ Optional: auto-login after register
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', data.user.email);
      localStorage.setItem('role', data.user.role);
    }

    document.getElementById('successModal').classList.add('active');

    // ✅ Optional redirect after 1.5 sec
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1500);

  } catch (error) {
    document.getElementById('errorModal').classList.add('active');
  }
}

// ================= UI =================
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}