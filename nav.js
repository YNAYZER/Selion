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

// 🛍️ Перехід на сторінку товару
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const link = card.getAttribute('data-link');
    window.location.href = link;
  });
});

// 🛒 Кошик
let cart = [];

document.querySelectorAll('#shop-cards').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.card');
    const title = card.querySelector('.p_h1_cards').textContent;
    const price = parseFloat(card.querySelector('.p_price').textContent);
    const imgSrc = card.querySelector('.card_img').src;

    cart.push({ title, price, imgSrc });
    updateCartUI();
    updateCartCounter();
  });
});

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
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

  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      cart.splice(index, 1);
      updateCartUI();
      updateCartCounter();
    });
  });
}

function updateCartCounter() {
  const counter = document.getElementById('cart-counter');
  if (!counter) return;
  counter.textContent = cart.length;
  counter.style.display = cart.length > 0 ? 'inline-block' : 'none';
}

// 📤 Відкриття кошика
document.querySelector('.Shop').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'flex';
});

// ❌ Закриття кошика
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});

// 📦 Відкриття форми замовлення
document.getElementById('checkout').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
  document.getElementById('order-modal').style.display = 'flex';
});

// ❌ Закриття форми
document.getElementById('close-order').addEventListener('click', () => {
  document.getElementById('order-modal').style.display = 'none';
});

// ✅ Валідація
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s()-]/g, '');
  return /^(\+)?\d{10,15}$/.test(cleaned);
}

// 📧 Надсилання замовлення через EmailJS
document.getElementById('order-form').addEventListener('submit', function(e) {
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
    user_email: email, // 👈 назва змінної має збігатися з шаблоном EmailJS
    phone: cleanedPhone,
    message: `Дякуємо за замовлення!\n\nВаші товари:\n${items}\n\nСума: ${total} ₴`
  };

  emailjs.send("service_gmail123", "template_v33auei", templateParams)
    .then(() => {
      alert("✅ Замовлення оформлено! Лист надіслано.");
      document.getElementById('order-modal').style.display = 'none';
      cart = [];
      updateCartUI();
      updateCartCounter();
      document.getElementById('order-form').reset();
    }, (error) => {
      alert("❌ Помилка при надсиланні листа: " + error.text);
    });
});