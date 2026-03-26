const cakeData = [
    { name: "Midnight Truffle", price: 45, category: "Chocolate", desc: "Deep dark chocolate with a silky ganache.", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
    { name: "Velvet Strawberry", price: 38, category: "Fruit", desc: "Fresh strawberries whipped into light cream.", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400" },
    { name: "Golden Honey", price: 35, category: "Classic", desc: "Local honey infused into a crunchy crust.", img: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400" },
    { name: "Vanilla Bean", price: 40, category: "Classic", desc: "Authentic Madagascan vanilla bean sponge.", img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400" },
    { name: "Caramel Crunch", price: 42, category: "Specialty", desc: "Salted caramel with toasted almond bits.", img: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400" },
    { name: "Pistachio Dream", price: 50, category: "Specialty", desc: "Roasted pistachios and white chocolate glaze.", img: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=400" },
    { name: "Lemon Zest", price: 32, category: "Fruit", desc: "Zesty lemon curd on a shortbread base.", img: "https://images.unsplash.com/photo-1519869325930-281384150729?w=400" },
    { name: "Berry Cheesecake", price: 48, category: "Cheesecake", desc: "NY style cheesecake with forest berries.", img: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400" },
    { name: "Dark Forest", price: 46, category: "Chocolate", desc: "Cherries and chocolate with whipped kirsch.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400" },
    { name: "Espresso Cream", price: 44, category: "Specialty", desc: "Rich coffee layers for the caffeine lovers.", img: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=400" }
];

const banners = [
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=1200",
    "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?w=1200"
];

const CART_KEY = "velvetCart";

let cart = [];
let bannerIdx = 0;
let pendingItem = null;
let currentCategory = "All";

// ✅ ONLY ONE ONLOAD (FIXED)
window.onload = () => {
    // LOGIN
    checkLogin();

    // CART LOAD (VERY IMPORTANT)
    cart = loadCartFromStorage();

    updateCartCountDisplay();
    updateCart();

    renderCakes();

    // SEARCH
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            renderCakes(e.target.value.toLowerCase());
        });
    }

    // BANNER
    setInterval(rotateBanner, 4000);

    // MODAL BUTTON SAFE
    const noBtn = document.getElementById('modal-no');
    if (noBtn) noBtn.onclick = closeModal;
};

// CATEGORY FILTER
function filterCategory(cat) {
    currentCategory = cat;
    renderCakes();
}

// RENDER
function renderCakes(filter = "") {
    const fullGrid = document.getElementById('full-grid');
    const trendGrid = document.getElementById('trending-grid');

    if (fullGrid) fullGrid.innerHTML = '';
    if (trendGrid) trendGrid.innerHTML = '';

    cakeData.forEach((cake, idx) => {
        if (
            (cake.name.toLowerCase().includes(filter) ||
            cake.category.toLowerCase().includes(filter)) &&
            (currentCategory === "All" || cake.category === currentCategory)
        ) {
            const html = `
                <div class="cake-card">
                    <span class="category-tag">${cake.category}</span>
                    <img src="${cake.img}" style="width:100%; height:180px; object-fit:cover; border-radius:15px;">
                    <h3>${cake.name}</h3>
                    <p style="font-size:0.8rem;">${cake.desc}</p>
                    <p><strong>$${cake.price}</strong></p>
                    <button class="btn-cream" onclick="askConfirm('${cake.name}', ${cake.price})">Add to Cart</button>
                </div>`;
            if (fullGrid) fullGrid.innerHTML += html;
            if (trendGrid && idx < 3 && filter === "") trendGrid.innerHTML += html;
        }
    });
}

// BANNER
function rotateBanner() {
    bannerIdx = (bannerIdx + 1) % banners.length;
    const img = document.getElementById('carousel-img');
    if (img) {
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = banners[bannerIdx];
            img.style.opacity = 1;
        }, 500);
    }
}

// CART
function askConfirm(name, price) {
    pendingItem = { name, price };
    document.getElementById('modal-msg').innerText = `Add ${name}?`;
    document.getElementById('qty-box').style.display = 'block';
    document.getElementById('cart-modal').style.display = 'flex';

    document.getElementById('modal-yes').onclick = finalizeAdd;
}

function finalizeAdd() {
    const qty = parseInt(document.getElementById('item-qty').value) || 1;

    cart.push({ ...pendingItem, qty, id: Date.now() });

    saveCartToStorage(); // ✅ VERY IMPORTANT
    updateCart();

    closeModal();
    showToast(`Added ${qty}x ${pendingItem.name}`);
}

function closeModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

// UPDATE CART (FIXED)
function updateCart() {
    const list = document.getElementById('cart-items');
    const emptyMsg = document.getElementById('empty-msg');

    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
    }

    cart.forEach(item => {
        list.innerHTML += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price * item.qty}</td>
            <td><button onclick="removeItem(${item.id})">❌</button></td>
        </tr>`;
        total += item.price * item.qty;
    });

    document.getElementById('total-price').innerText = total;
}

// REMOVE
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCartToStorage();
    updateCart();
}

// STORAGE
function loadCartFromStorage() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCartToStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// COUNT
function updateCartCountDisplay() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('#cart-count').forEach(el => el.innerText = count);
}

// CHECKOUT
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    alert("Order placed 🎉");
    cart = [];
    saveCartToStorage();
    updateCart();
}

// LOGIN
function checkLogin() {
    const email = localStorage.getItem("userEmail");
    const loginBtn = document.getElementById("login-btn");

    if (email && loginBtn) {
        loginBtn.innerText = email;
        loginBtn.onclick = logout;
    }
}

// LOGOUT
function logout() {
    localStorage.clear();
    location.reload();
}

// TOAST
function showToast(msg) {
    alert(msg);
}