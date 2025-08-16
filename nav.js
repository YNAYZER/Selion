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