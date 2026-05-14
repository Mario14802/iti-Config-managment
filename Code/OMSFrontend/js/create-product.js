(function gate() {
  const role = localStorage.getItem('role');
  if (role !== 'supplier' && role !== 'admin') {
    window.location.replace('home.html');
  }
})();

let selectedImageBase64 = null;

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    selectedImageBase64 = e.target.result;
    document.getElementById('previewImg').src = selectedImageBase64;
    document.getElementById('previewImg').style.display = 'block';
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileLinkWrapper').style.display = 'block';
    document.getElementById('uploadInstructions').style.display = 'none';
    document.getElementById('removeImgBtn').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function removeImage(event) {
  event.stopPropagation();
  event.preventDefault();
  selectedImageBase64 = null;
  document.getElementById('imageInput').value = '';
  document.getElementById('previewImg').src = '';
  document.getElementById('previewImg').style.display = 'none';
  document.getElementById('fileLinkWrapper').style.display = 'none';
  document.getElementById('uploadInstructions').style.display = 'block';
  document.getElementById('removeImgBtn').style.display = 'none';
}

async function saveProduct() {
  const title = document.getElementById('title').value.trim();
  const price = document.getElementById('price').value;
  const description = document.getElementById('description').value.trim();
  const quantity = document.getElementById('quantity').value;

  const titleHasSpecialChars = /[^a-zA-Z0-9\s]/.test(title);
  const descHasSpecialChars = /[^a-zA-Z0-9\s]/.test(description);
  if (!title || title.length < 10 || title.length > 100 || titleHasSpecialChars || !description || description.length < 10 || description.length > 800 || descHasSpecialChars || !price || Number(price) <= 0 || !quantity) {
    alert('Invalid data');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Unauthorized: Please log in as a supplier.');
    window.location.replace('login.html');
    return;
  }

  const payload = {
    product_title: title,
    description: description,
    price: Number(price),
    image_url: selectedImageBase64 || '',
    stock_quantity: Number(quantity),
    stock_status: Number(quantity) > 0 ? 'in_stock' : 'out_of_stock'
  };

  try {
    const { ok, data } = await apiFetch('/api/products', {
      method: 'POST',
      body: payload
    });

    if (ok) {
      document.getElementById('successModal').classList.add('active');
    } else {
      console.error(data);
      document.getElementById('invalidModal').classList.add('active');
    }
  } catch (error) {
    console.error('Error creating product:', error);
    document.getElementById('invalidModal').classList.add('active');
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}
