function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) { 
    alert('Image is too large for local storage. Please use an image under 2MB.'); 
    return; 
  }

  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById('previewImg');
    if (img) img.src = ev.target.result;
    
    // Show link and filename
    const linkWrap = document.getElementById('fileLinkWrapper');
    const fileName = document.getElementById('fileName');
    const instructions = document.getElementById('uploadInstructions');
    const removeBtn = document.getElementById('removeImgBtn');
    
    if (linkWrap) linkWrap.style.display = 'flex';
    if (fileName) fileName.textContent = file.name;
    if (instructions) instructions.style.display = 'none';
    if (removeBtn) removeBtn.style.display = 'flex';

    console.log('Image uploaded:', file.name);
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  if (e) e.stopPropagation();
  const input = document.getElementById('imageInput');
  const img = document.getElementById('previewImg');
  const linkWrap = document.getElementById('fileLinkWrapper');
  const instructions = document.getElementById('uploadInstructions');
  const removeBtn = document.getElementById('removeImgBtn');

  if (input) input.value = '';
  if (img) img.src = '';
  if (linkWrap) linkWrap.style.display = 'none';
  if (instructions) instructions.style.display = 'block';
  if (removeBtn) removeBtn.style.display = 'none';
}

function saveProduct() {
  const title       = document.getElementById('title').value.trim();
  const price       = parseFloat(document.getElementById('price').value);
  const description = document.getElementById('description').value.trim();
  const quantity    = parseInt(document.getElementById('quantity').value);
  const previewImg  = document.getElementById('previewImg');
  const image       = previewImg && previewImg.src && previewImg.src.startsWith('data:') ? previewImg.src : '';

  // SIQ_28, 29, 30, 31 validations
  const titleOk = title.length >= 10 && title.length <= 100;
  const descOk  = description.length >= 10 && description.length <= 2000;
  const priceOk = !isNaN(price) && price > 0;
  const qtyOk   = !isNaN(quantity) && quantity >= 0;
  const imgOk   = !!image;

  if (!titleOk || !descOk || !priceOk || !qtyOk || !imgOk) {
    document.getElementById('invalidModal').classList.add('active'); 
    return;
  }

  // SIQ_35: duplicate check
  const products = JSON.parse(localStorage.getItem('supplierProducts') || '[]');
  if (products.some(p => p.title.toLowerCase() === title.toLowerCase())) {
    document.getElementById('duplicateModal').classList.add('active'); 
    return;
  }

  try {
    products.push({ id: Date.now(), title, description, qty: quantity, price, image });
    localStorage.setItem('supplierProducts', JSON.stringify(products));
    document.getElementById('successModal').classList.add('active');
  } catch (err) {
    console.error('Storage error:', err);
    alert('Failed to save product. The image might be too large for browser storage. Try a smaller file.');
  }
}

function closeModal(id) { 
  const mod = document.getElementById(id);
  if (mod) mod.classList.remove('active'); 
}
