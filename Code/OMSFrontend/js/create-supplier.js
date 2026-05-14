(function gate() {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    window.location.replace('home.html');
  }
})();

async function saveSupplier() {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;

  if (!fullName || !email || !phone || !password) {
    document.getElementById('invalidModal').classList.add('active');
    return;
  }

  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = parts[0].replace(/[^a-zA-Z]/g, '');
  const lastName =
    parts.length > 1
      ? parts.slice(1).join('').replace(/[^a-zA-Z]/g, '')
      : 'Supplier';

  if (firstName.length < 2 || lastName.length < 2) {
    document.getElementById('invalidModal').classList.add('active');
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    password,
    phone_number: phone
  };

  const token = localStorage.getItem('token');
  if (!token) {
    window.location.replace('login.html');
    return;
  }

  try {
    const { ok, data } = await apiFetch('/api/users/supplier', {
      method: 'POST',
      body: payload
    });

    if (ok) {
      document.getElementById('successModal').classList.add('active');
    } else {
      const msg = (data.message || '').toLowerCase();
      if (msg.includes('duplicate') || msg.includes('11000')) {
        document.getElementById('duplicateModal').classList.add('active');
      } else {
        document.getElementById('invalidModal').classList.add('active');
      }
    }
  } catch (error) {
    console.error('Error creating supplier:', error);
    document.getElementById('invalidModal').classList.add('active');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
