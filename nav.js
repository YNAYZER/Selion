// 📦 Бургер-меню
const burger = document.getElementById('burger');
const closeBtn = document.getElementById('Close');
const sideMenu = document.getElementById('sideMenu');

burger.addEventListener('click', () => {
  document.body.classList.add('menu-open');
  sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  sideMenu.style.display = 'none';
});

window.addEventListener('resize', () => {
  sideMenu.style.display = window.innerWidth > 900 ? 'block' : 'none';
});

// 🛒 Кошик (завантаження з localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 🔹 Універсальна функція додавання товару
function addToCart(title, price, imgSrc) {
  cart.push({ title, price, imgSrc });
  saveCart();
  updateCartUI();
  updateCartCounter();
}

// 🔹 Збереження кошика
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 🔹 Оновлення інтерфейсу кошика
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartItemsContainer || !cartTotal) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.imgSrc}" alt="">
      <div class="item-info">
        <div class="item-title">${item.title}</div>
        <div class="item-price">${item.price.toFixed(2)} ₴</div>
      </div>
      <button class="remove-btn" data-index="${index}">✖</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = `Разом: ${total.toFixed(2)} ₴`;

  // Видалення товару
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
      updateCartCounter();
    });
  });
}

// 🔹 Лічильник товарів
function updateCartCounter() {
  const counter = document.getElementById('cart-counter');
  if (!counter) return;
  counter.textContent = cart.length;
  counter.style.display = cart.length > 0 ? 'inline-block' : 'none';
}

// 🛍️ Клік по картці — відкриває product.html з даними
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Якщо клік по кнопці кошика — не переходимо
    if (e.target.closest('#shop-cards')) return;

    const productData = {
      title: card.dataset.title,
      desc: card.dataset.desc,
      price: card.dataset.price,
      img: card.dataset.img
    };

    localStorage.setItem('selectedProduct', JSON.stringify(productData));
    window.location.href = 'product.html';
  });
});

// 🛒 Додавання з головної сторінки по кнопці кошика
document.querySelectorAll('#shop-cards').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.card');
    const title = card.dataset.title || card.querySelector('.p_h1_cards').textContent;
    const price = parseFloat(card.dataset.price || card.querySelector('.p_price').textContent);
    const imgSrc = card.dataset.img || card.querySelector('.card_img').src;
    addToCart(title, price, imgSrc);
  });
});

// 🛒 Додавання з сторінки продукту
const buyBtn = document.querySelector('.buy');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    const product = JSON.parse(localStorage.getItem('selectedProduct'));
    if (product) {
      addToCart(product.title, parseFloat(product.price), product.img);
    } else {
      const title = document.querySelector('.h1-name').textContent;
      const price = parseFloat(document.querySelector('.prise-name').textContent);
      const imgSrc = document.querySelector('.product-img').src;
      addToCart(title, price, imgSrc);
    }
    document.getElementById('cart-modal').style.display = 'flex';
  });
}

// 📤 Відкриття кошика
const shopBtn = document.querySelector('.Shop');
if (shopBtn) {
  shopBtn.addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'flex';
  });
}

// ❌ Закриття кошика
const closeCartBtn = document.getElementById('close-cart');
if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
  });
}

// 📦 Відкриття форми замовлення
const checkoutBtn = document.getElementById('checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('order-modal').style.display = 'flex';
  });
}

// ❌ Закриття форми
const closeOrderBtn = document.getElementById('close-order');
if (closeOrderBtn) {
  closeOrderBtn.addEventListener('click', () => {
    document.getElementById('order-modal').style.display = 'none';
  });
}

// ✅ Валідація
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s()-]/g, '');
  return /^(\+)?\d{10,15}$/.test(cleaned);
}

// 📧 Надсилання замовлення через EmailJS
const orderForm = document.getElementById('order-form');
if (orderForm) {
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cleanedPhone = phone.replace(/[\s()-]/g, '');

    if (!isValidEmail(email)) {
      alert("❗ Введіть коректну електронну пошту.");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("❗ Введіть коректний номер телефону.");
      return;
    }

    if (cart.length === 0) {
      alert("🛒 Ваш кошик порожній.");
      return;
    }

    const items = cart.map(item => `${item.title} — ${item.price.toFixed(2)} ₴`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const templateParams = {
      user_email: email,
      phone: cleanedPhone,
      message: `Ваше замовлення:\n${items}\n\nСума: ${total} ₴`
    };

    emailjs.send("service_gmail123", "template_v33auei", templateParams)
      .then(() => {
        alert("✅ Замовлення оформлено! Лист надіслано.");
        document.getElementById('order-modal').style.display = 'none';
        cart = [];
        saveCart();
        updateCartUI();
        updateCartCounter();
        orderForm.reset();
      }, (error) => {
        alert("❌ Помилка при надсиланні листа: " + error.text);
      });
  });
}

// 🔹 Ініціалізація при завантаженні
updateCartUI();
updateCartCounter();

// 🖼 Підстановка даних у product.html
document.addEventListener('DOMContentLoaded', () => {
  const product = JSON.parse(localStorage.getItem('selectedProduct'));
  if (product && document.querySelector('.product-img')) {
    document.querySelector('.product-img').src = product.img;
    document.querySelector('.h1-name').textContent = product.title;
    document.querySelector('.h2-name').textContent = product.desc;
    document.querySelector('.prise-name').textContent = product.price + ' ₴';
  }
});
function saveCartToCookie() {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // зберігати 7 днів
  document.cookie = "cart=" + encodeURIComponent(JSON.stringify(cart)) + ";expires=" + expires.toUTCString() + ";path=/";
}

function loadCartFromCookie() {
  const match = document.cookie.match(new RegExp('(^| )cart=([^;]+)'));
  if (match) {
    try {
      cart = JSON.parse(decodeURIComponent(match[2]));
    } catch (e) {
      cart = [];
    }
  }
}

// 🔍 Пошук товарів
const searchInput = document.querySelector('.Serch');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    document.querySelectorAll('.card').forEach(card => {
      const title = card.querySelector('.p_h1_cards').textContent.toLowerCase();
      const desc = card.querySelector('.p_h2_cards').textContent.toLowerCase();
      if (title.includes(query) || desc.includes(query)) {
        card.style.display = ''; // показуємо
      } else {
        card.style.display = 'none'; // ховаємо
      }
    });
  });
}