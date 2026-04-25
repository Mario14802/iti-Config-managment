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
    firstName: firstName,
    lastName:  lastName,
    email:     email,
    password:  password,
    role:      'client'
  };

  try {
    // Step 1: call the API — registers user in the real database
    await registerAPI(userData);

    // Step 2: also save to localStorage so admin dashboard can show them
    const clients = JSON.parse(localStorage.getItem('adminClients') || '[]');
    const alreadyExists = clients.some(c => c.email === email);
    if (!alreadyExists) {
      clients.push({ first: firstName, last: lastName, email: email, password: '•••••••••••••' });
      localStorage.setItem('adminClients', JSON.stringify(clients));
    }

    // Step 3: save first name for the home page greeting
    localStorage.setItem('registeredFirstName', firstName);

    document.getElementById('successModal').classList.add('active');
  } catch (error) {
    document.getElementById('errorModal').classList.add('active');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
