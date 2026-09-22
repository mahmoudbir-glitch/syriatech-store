const products = [
  {
    id: 1,
    icon: "🎧",
    brand: "Anker Soundcore",
    nameAr: "سماعات لاسلكية",
    nameEn: "Wireless Earbuds",
    descriptionAr: "صوت واضح وبطارية تدوم طويلًا.",
    descriptionEn: "Clear sound with long-lasting battery.",
    price: 25
  },
  {
    id: 2,
    icon: "🔋",
    brand: "Anker",
    nameAr: "باور بانك سريع",
    nameEn: "Fast Power Bank",
    descriptionAr: "شحن سريع وآمن لأجهزتك.",
    descriptionEn: "Fast and safe charging for your devices.",
    price: 35
  },
  {
    id: 3,
    icon: "🔌",
    brand: "Anker",
    nameAr: "شاحن جداري",
    nameEn: "Wall Charger",
    descriptionAr: "شاحن صغير وعملي للاستخدام اليومي.",
    descriptionEn: "Compact and practical daily charger.",
    price: 18
  },
  {
    id: 4,
    icon: "📡",
    brand: "Anker",
    nameAr: "كابل USB-C",
    nameEn: "USB-C Cable",
    descriptionAr: "كابل متين للشحن ونقل البيانات.",
    descriptionEn: "Durable cable for charging and data transfer.",
    price: 10
  }
];

let currentLanguage = "ar";
let cart = [];

const productsGrid = document.getElementById("productsGrid");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const languageButton = document.getElementById("languageButton");

function renderProducts() {
  productsGrid.innerHTML = products
    .map((product) => {
      const name =
        currentLanguage === "ar" ? product.nameAr : product.nameEn;

      const description =
        currentLanguage === "ar"
          ? product.descriptionAr
          : product.descriptionEn;

      const addText = currentLanguage === "ar" ? "أضف للسلة" : "Add to cart";

      return `
        <article class="product-card">
          <div class="product-image">${product.icon}</div>

          <div class="product-info">
            <span class="product-brand">${product.brand}</span>
            <h3>${name}</h3>
            <p class="product-description">${description}</p>

            <div class="product-bottom">
              <span class="product-price">$${product.price}</span>

              <button class="add-button" onclick="addToCart(${product.id})">
                ${addText}
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  updateCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCart();
}

function updateCart() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = `$${totalPrice}`;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p>
        ${
          currentLanguage === "ar"
            ? "السلة فارغة حاليًا."
            : "Your cart is empty."
        }
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart
    .map((item) => {
      const name = currentLanguage === "ar" ? item.nameAr : item.nameEn;

      return `
        <div class="cart-item">
          <div>
            <h4>${name}</h4>
            <p>$${item.price} × ${item.quantity}</p>
          </div>

          <button class="remove-item" onclick="removeFromCart(${item.id})">
            ${
              currentLanguage === "ar"
                ? "حذف"
                : "Remove"
            }
          </button>
        </div>
      `;
    })
    .join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
}

function changeLanguage() {
  currentLanguage = currentLanguage === "ar" ? "en" : "ar";

  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.body.dir = currentLanguage === "ar" ? "rtl" : "ltr";

  languageButton.textContent = currentLanguage === "ar" ? "EN" : "AR";

  document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
    element.textContent =
      currentLanguage === "ar"
        ? element.dataset.ar
        : element.dataset.en;
  });

  renderProducts();
  updateCart();
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);
languageButton.addEventListener("click", changeLanguage);

renderProducts();
updateCart();
    
