async function registerAPI(userData) {
  const { ok, data } = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: userData,
    auth: false
  });
  if (!ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

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

async function handleRegister() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const isNameOk = name => /^[a-zA-Z]+$/.test(name);
  const isEmailOk = em => em.length > 0 && em.includes('@') && !em.includes(' ');
  const isPasswordOk = pw => pw.length >= 8 && /[A-Z]/.test(pw);

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
    await registerAPI(userData);
  } catch (error) {
    document.getElementById('errorModal').classList.add('active');
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
    document.getElementById('successModal').classList.add('active');
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 1500);
  } catch (error) {
    const msg = document.querySelector('#errorModal p');
    if (msg) {
      msg.textContent = 'Account created. Please sign in from the login page.';
    }
    document.getElementById('errorModal').classList.add('active');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
