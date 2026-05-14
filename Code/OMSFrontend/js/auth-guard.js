(function() {
  const user = localStorage.getItem('currentUser');
  const role = localStorage.getItem('role');
  const isLoginPage = window.location.pathname.includes('login.html') || window.location.pathname.endsWith('/');
  const isRegisterPage = window.location.pathname.includes('register.html');
  const isDashboard = window.location.pathname.includes('dashboard') || window.location.pathname.includes('create-product');

  // If not logged in and trying to access a protected page
  if (!user && !isLoginPage && !isRegisterPage) {
    window.location.replace('login.html');
  }

  // If already logged in and trying to access login/register
  if (user && (isLoginPage || isRegisterPage)) {
    // If it's the admin, go to dashboard, else home
    if (role === 'admin') {
      window.location.replace('admin-dashboard.html');
    } else if (role === 'supplier') {
      window.location.replace('supplier-dashboard.html');
    } else {
      window.location.replace('home.html');
    }
  }
})();
