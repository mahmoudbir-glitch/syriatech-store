const products = [
  {
    id: 1,
    icon: "🎧",
    name: "سماعات Soundcore لاسلكية",
    description: "صوت واضح وبطارية تدوم طويلًا",
    price: 25
  },
  {
    id: 2,
    icon: "🔋",
    name: "Power Bank Anker",
    description: "شحن سريع وآمن لجميع الأجهزة",
    price: 35
  },
  {
    id: 3,
    icon: "🔌",
    name: "شاحن Anker سريع",
    description: "شاحن صغير وقوي للاستخدام اليومي",
    price: 18
  },
  {
    id: 4,
    icon: "📱",
    name: "كابل USB-C",
    description: "كابل متين للشحن ونقل البيانات",
    price: 10
  }
];

let cart = [];

const productsGrid = document.getElementById("productsGrid");
const cartElement = document.getElementById("cart");
const overlay = document.getElementById("overlay");

function displayProducts(list = products) {
  productsGrid.innerHTML = list.map(product => `
    <div class="product">
      <div class="product-image">${product.icon}</div>

      <div class="product-info">
        <small>Anker</small>
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-bottom">
          <strong>$${product.price}</strong>
          <button onclick="addToCart(${product.id})">
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const item = cart.find(item => item.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
  openCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");

  cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartTotal.textContent = total;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>السلة فارغة حاليًا</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>
        ${item.name}<br>
        $${item.price} × ${item.quantity}
      </span>

      <button onclick="removeFromCart(${item.id})">
        حذف
      </button>
    </div>
  `).join("");
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function openCart() {
  cartElement.classList.add("open");
  overlay.classList.add("active");
}

function closeCart() {
  cartElement.classList.remove("open");
  overlay.classList.remove("active");
}

function searchProducts() {
  const value = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const result = products.filter(product =>
    product.name.toLowerCase().includes(value)
  );

  displayProducts(result);
}

function changeLanguage() {
  alert("سيتم إضافة النسخة الإنجليزية الكاملة في الخطوة التالية.");
}

displayProducts();
updateCart();
