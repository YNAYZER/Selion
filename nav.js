const burger = document.getElementById('burger');
const closeBtn = document.getElementById('Close');
const menu = document.getElementById('sideMenu');

burger.addEventListener('click', () => {
  menu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  menu.style.display = 'none';
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  });
 
  
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      window.location.href = link;
    });
  });


const sideMenu = document.getElementById('sideMenu');

burger.addEventListener('click', () => {
  document.body.classList.add('menu-open');
  sideMenu.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  sideMenu.style.display = 'none';
});

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

  // Видалення товару
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      cart.splice(index, 1);
      updateCartUI();
    });
  });
}

// Відкриття кошика
document.querySelector('.Shop').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'flex';
});

// Закриття кошика
document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
});




// Відкриття форми
document.getElementById('checkout').addEventListener('click', () => {
  document.getElementById('cart-modal').style.display = 'none';
  document.getElementById('order-modal').style.display = 'flex';
});

// Закриття форми
document.getElementById('close-order').addEventListener('click', () => {
  document.getElementById('order-modal').style.display = 'none';
});

// Обробка форми
document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  const items = cart.map(item => `${item.title} — ${item.price.toFixed(2)} ₴`).join('\n');
  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  const templateParams = {
    to_email: email,
    phone: phone,
    message: `Дякуємо за замовлення!\n\nВаші товари:\n${items}\n\nСума: ${total} ₴`
  };

  emailjs.send("service_gmail123", "template_v33auei", templateParams)
    .then(() => {
      alert("✅ Замовлення оформлено! Лист надіслано.");
      document.getElementById('order-modal').style.display = 'none';
      cart = [];
      updateCartUI();
    }, (error) => {
      alert("❌ Помилка при надсиланні листа: " + error.text);
    });
});