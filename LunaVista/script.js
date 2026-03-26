// Hero Slider
const hero = document.querySelector("#hero");
const hotelImages = [
  "hotel1.webp",
  "hotel2.jfif",
  "hotel3.webp",
  "hotel4.avif",
  "hotel5.avif",
  "hotel6.jpg",
  "hotel7.jpg",
  "hotel8.jpg"
];
let hotelIndex = 0;

if(hero){
  hero.style.backgroundImage = `url(${hotelImages[0]})`;
  setInterval(() => {
    hotelIndex = (hotelIndex + 1) % hotelImages.length;
    hero.style.backgroundImage = `url(${hotelImages[hotelIndex]})`;
  }, 4000);
}

// Login form
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    window.location.href = "reservation.html";
  });
}