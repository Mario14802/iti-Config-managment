function saveSupplier() {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;

  const nameOk = str => /^[a-zA-Z\s]+$/.test(str) && str.length >= 2 && str.length <= 50;
  const emailOk = e => e.length > 0 && e.includes('@') && !e.includes(' ');
  const phoneOk = p => p.length === 11 && /^\d+$/.test(p);
  const passOk  = p => p.length >= 8 && /[A-Z]/.test(p);

  if (!nameOk(name) || !emailOk(email) || !phoneOk(phone) || !passOk(password)) {
    document.getElementById('invalidModal').classList.add('active');
    return;
  }

  const suppliers = JSON.parse(localStorage.getItem('adminSuppliers') || '[]');
  const exists = suppliers.some(s => s.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    document.getElementById('duplicateModal').classList.add('active');
    return;
  }

  suppliers.push({ name, email, password: password, displayPassword: '••••••••••••', phone });
  localStorage.setItem('adminSuppliers', JSON.stringify(suppliers));
  document.getElementById('successModal').classList.add('active');
}

function closeModal(id) {
  const mod = document.getElementById(id);
  if (mod) mod.classList.remove('active');
}
