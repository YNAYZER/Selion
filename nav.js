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
  