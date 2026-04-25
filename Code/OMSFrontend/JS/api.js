const BASE_URL = 'https://mobilestore-production.up.railway.app';
const PostHeaders = { 'Content-Type': 'application/json' };

async function loginAPI(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: PostHeaders,
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
}


async function registerAPI(userData) {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: PostHeaders,
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Registration Error:', error);
    throw error;
  }
}

