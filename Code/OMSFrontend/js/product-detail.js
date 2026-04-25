let currentProduct = null;

const PRODUCT_DESCRIPTIONS = {
  'iPhone 15 Pro Max': 'The iPhone 15 Pro Max features a premium titanium design, the powerful A17 Pro chip, and a breakthrough camera system with 5x optical zoom. Experience extraordinary performance with the Action button, USB-C connectivity, and a stunning 6.7-inch Super Retina XDR display with ProMotion technology.',
  'Samsung Galaxy S24': 'Samsung Galaxy S24 Ultra represents the pinnacle of mobile technology with its integrated S Pen, Snapdragon 8 Gen 3 for Galaxy, and an advanced 200MP quad-camera system. The bright Vision Booster display and long-lasting battery ensure you stay productive and entertained all day.',
  'Xiaomi 14 Ultra': 'Xiaomi 14 Ultra features a professional-grade Leica quad-camera system with a 1-inch main sensor. Powered by the latest Snapdragon flagship processor, it offers exceptional photography capabilities, rapid charging, and a beautiful WQHD+ AMOLED display for creators.',
  'AirPods Pro 2nd Gen': 'AirPods Pro (2nd generation) features up to 2x more Active Noise Cancellation, plus Adaptive Transparency, and Personalized Spatial Audio with dynamic head tracking for immersive sound. Now with multiple ear tips and up to 6 hours of listening time on a single charge.',
  'Samsung 45W Charger': 'The Samsung 45W USB-C Fast Charging Wall Charger provides super fast charging for compatible devices. Its compact design and high-power output make it the perfect accessory for modern smartphones and tablets, ensuring minimal downtime while charging.',
  'Leather Phone Case': 'Crafted from premium genuine leather, this protective case offers a luxurious feel and robust protection against drops and scratches. The soft microfiber lining helps protect your device, while the slim profile maintains the sleek look of your phone.'
};

function loadProduct() {
  const data = localStorage.getItem('selectedProduct');
  if (data) {
    currentProduct = JSON.parse(data);
    const title = currentProduct.title;
    
    document.getElementById('productTitle').textContent = title;
    document.getElementById('productPrice').textContent = currentProduct.price;
    
    // Use dynamic description if available, otherwise fallback
    document.getElementById('productDesc').textContent = currentProduct.description || PRODUCT_DESCRIPTIONS[title] || 'High-quality premium product with exceptional performance and durability.';
    
    const prodImg = document.querySelector('.product-detail-image-wrap img');
    if (prodImg) prodImg.src = currentProduct.image;
    
    // Check stock status (passed as string from data-stock)
    if (currentProduct.stock === "0") {
      const buyBtn = document.querySelector('.product-info .btn-primary');
      if (buyBtn) {
        buyBtn.textContent = 'Out of Stock';
        buyBtn.disabled = true;
        buyBtn.style.opacity = '0.5';
        buyBtn.style.cursor = 'not-allowed';
      }
    }

    document.title = title + " — Mobile Store";
  }
}

function updateCartBadge() {
  const user = localStorage.getItem('currentUser') || 'guest';
  const cart = JSON.parse(localStorage.getItem('cart_' + user) || '[]');
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function addToCart() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('qty').value);
  const user = localStorage.getItem('currentUser') || 'guest';
  const cartKey = 'cart_' + user;
  
  let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
  const productId = currentProduct.title.replace(/\s+/g, '').toLowerCase();
  
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    const priceNum = parseInt(currentProduct.price.replace(/[^0-9]/g, ''));
    cart.push({ 
      id: productId, 
      title: currentProduct.title, 
      price: priceNum, 
      image: currentProduct.image,
      qty 
    });
  }
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartBadge();
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.onload = () => {
  loadProduct();
  updateCartBadge();
};
