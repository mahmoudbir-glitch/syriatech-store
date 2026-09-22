const products = [
  {id:1,icon:"☀️",brand:"Anker",name:"SOLIX PS60 Portable Solar Panel",description:"لوح شمسي محمول من Anker",oldPrice:null,price:149.99,badge:"New"},
  {id:2,icon:"🔋",brand:"Anker",name:"Prime Power Bank 26K 300W",description:"باور بانك بسعة 26,000mAh وقدرة 300W",oldPrice:null,price:229.99,badge:"New"},
  {id:3,icon:"🔌",brand:"Anker",name:"Zolo Charger 70W 4 Port",description:"شاحن Zolo بقدرة 70W وأربع منافذ",oldPrice:null,price:44.99,badge:"New"},
  {id:4,icon:"🔌",brand:"Anker",name:"Zolo Charger 20W",description:"شاحن سريع بقدرة 20W",oldPrice:null,price:14.99,badge:"New"},
  {id:5,icon:"⚡",brand:"Anker",name:"SOLIX C2000 Gen 2",description:"محطة طاقة محمولة بقدرة عالية",oldPrice:1799.99,price:1399.99,badge:"-22%"},
  {id:6,icon:"⚡",brand:"Anker",name:"SOLIX C1000 Gen 2",description:"محطة طاقة بسعة 1,024Wh",oldPrice:999.99,price:799.99,badge:"-20%"},
  {id:7,icon:"🎧",brand:"Anker Soundcore",name:"Space One Pro",description:"سماعات لاسلكية عازلة للضوضاء",oldPrice:199.99,price:169.99,badge:"-15%"},
  {id:8,icon:"🎧",brand:"Anker Soundcore",name:"AeroFit 2",description:"سماعات رياضية لاسلكية",oldPrice:null,price:129.99,badge:"New"},
  {id:9,icon:"🎧",brand:"Anker Soundcore",name:"Sport X20",description:"سماعات رياضية مقاومة للماء",oldPrice:null,price:89.99,badge:""},
  {id:10,icon:"🎧",brand:"Anker Soundcore",name:"Q20i ANC",description:"سماعات رأس عازلة للضوضاء",oldPrice:69.99,price:54.99,badge:"-21%"},
  {id:11,icon:"🔊",brand:"Anker Soundcore",name:"Rave Neo 2",description:"سماعة محمولة للحفلات",oldPrice:null,price:179.99,badge:""},
  {id:12,icon:"🔊",brand:"Anker Soundcore",name:"Motion X500",description:"سماعة محمولة بصوت قوي",oldPrice:null,price:169.99,badge:""},
  {id:13,icon:"🔌",brand:"Anker",name:"GaNPrime Charger 100W",description:"شاحن سريع بقدرة 100W",oldPrice:null,price:84.99,badge:""},
  {id:14,icon:"🔌",brand:"Anker",name:"Prime Charger 200W",description:"شاحن متعدد المنافذ بقدرة 200W",oldPrice:null,price:99.99,badge:""},
  {id:15,icon:"🔗",brand:"Anker",name:"USB-C Cable",description:"كابل USB-C متين للشحن ونقل البيانات",oldPrice:null,price:9.99,badge:""}
];

const WHATSAPP = "963949951985";
const CART_KEY = "syriatech_cart";

let cart = [];
let isEnglish = false;

function $(selector) {
  return document.querySelector(selector);
}

function money(value) {
  return "$" + Number(value).toFixed(2);
}

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    cart = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    cart = [];
    try { localStorage.removeItem(CART_KEY); } catch (_) {}
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Cart could not be saved:", error);
  }
}

function renderProducts(list) {
  const grid = $("#productsGrid");
  if (!grid) return;

  const items = Array.isArray(list) ? list : products;

  if (!items.length) {
    grid.innerHTML = '<div class="empty-state">لا توجد منتجات مطابقة لبحثك.</div>';
    return;
  }

  grid.innerHTML = items.map(function (p) {
    return '<article class="product" data-product-id="' + p.id + '">' +
      (p.badge ? '<span class="product-badge">' + p.badge + '</span>' : '') +
      '<div class="product-image" role="img" aria-label="' + p.name + '">' + p.icon + '</div>' +
      '<div class="product-info">' +
        '<small>' + p.brand + '</small>' +
        '<h3>' + p.name + '</h3>' +
        '<p>' + p.description + '</p>' +
        '<div class="product-bottom">' +
          '<div>' +
            (p.oldPrice ? '<del>' + money(p.oldPrice) + '</del>' : '') +
            '<strong>' + money(p.price) + '</strong>' +
          '</div>' +
          '<button type="button" class="add-product" data-id="' + p.id + '">أضف للسلة</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join("");

  grid.querySelectorAll(".add-product").forEach(function (button) {
    button.addEventListener("click", function () {
      addToCart(Number(button.dataset.id));
    });
  });
}

function renderCart() {
  const items = $("#cartItems");
  const count = $("#cartCount");
  const total = $("#cartTotal");
  if (!items || !count || !total) return;

  const quantity = cart.reduce(function (sum, item) {
    return sum + Number(item.qty || 0);
  }, 0);

  const totalValue = cart.reduce(function (sum, item) {
    return sum + Number(item.price || 0) * Number(item.qty || 0);
  }, 0);

  count.textContent = String(quantity);
  total.textContent = totalValue.toFixed(2);

  if (!cart.length) {
    items.innerHTML = '<div class="empty-state">السلة فارغة حالياً.</div>';
    return;
  }

  items.innerHTML = cart.map(function (item) {
    return '<div class="cart-item">' +
      '<div>' +
        '<strong>' + item.name + '</strong>' +
        '<div class="cart-controls">' +
          '<button type="button" class="qty-minus" data-id="' + item.id + '">−</button>' +
          '<span>' + item.qty + '</span>' +
          '<button type="button" class="qty-plus" data-id="' + item.id + '">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-item-price">' +
        '<strong>' + money(Number(item.price) * Number(item.qty)) + '</strong>' +
        '<button type="button" class="remove-item" data-id="' + item.id + '">حذف</button>' +
      '</div>' +
    '</div>';
  }).join("");

  items.querySelectorAll(".qty-minus").forEach(function (button) {
    button.addEventListener("click", function () {
      changeQty(Number(button.dataset.id), -1);
    });
  });

  items.querySelectorAll(".qty-plus").forEach(function (button) {
    button.addEventListener("click", function () {
      changeQty(Number(button.dataset.id), 1);
    });
  });

  items.querySelectorAll(".remove-item").forEach(function (button) {
    button.addEventListener("click", function () {
      removeFromCart(Number(button.dataset.id));
    });
  });
}

function addToCart(id) {
  const product = products.find(function (item) { return item.id === id; });
  if (!product) return;

  const existing = cart.find(function (item) { return item.id === id; });

  if (existing) {
    existing.qty = Number(existing.qty) + 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, delta) {
  const item = cart.find(function (entry) { return entry.id === id; });
  if (!item) return;

  item.qty = Number(item.qty) + delta;
  if (item.qty <= 0) {
    cart = cart.filter(function (entry) { return entry.id !== id; });
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(function (item) { return item.id !== id; });
  saveCart();
  renderCart();
}

function openCart() {
  const cartPanel = $("#cart");
  const overlay = $("#overlay");
  if (cartPanel) cartPanel.classList.add("open");
  if (overlay) overlay.classList.add("active");
}

function closeCart() {
  const cartPanel = $("#cart");
  const overlay = $("#overlay");
  if (cartPanel) cartPanel.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

function searchProducts() {
  const input = $("#searchInput");
  const query = input ? input.value.trim().toLowerCase() : "";

  const filtered = !query ? products : products.filter(function (product) {
    return [product.name, product.brand, product.description]
      .some(function (value) { return value.toLowerCase().includes(query); });
  });

  renderProducts(filtered);

  const section = $("#products");
  if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function changeLanguage() {
  isEnglish = !isEnglish;
  document.documentElement.lang = isEnglish ? "en" : "ar";
  document.documentElement.dir = isEnglish ? "ltr" : "rtl";

  const button = $("#languageButton");
  if (button) button.textContent = isEnglish ? "AR" : "EN";
}

function checkoutWhatsApp(event) {
  if (event) event.preventDefault();

  if (!cart.length) {
    alert("السلة فارغة.");
    return;
  }

  const lines = cart.map(function (item) {
    return "• " + item.name + " × " + item.qty + " = " + money(item.price * item.qty);
  });

  const total = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  const message =
    "مرحباً Syriatech، أريد طلب:\n\n" +
    lines.join("\n") +
    "\n\nالإجمالي: " + money(total);

  window.open(
    "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message),
    "_blank",
    "noopener,noreferrer"
  );
}

function bindNavigation() {
  const languageButton = $("#languageButton");
  if (languageButton) languageButton.addEventListener("click", changeLanguage);

  const cartButton = $("#cartButton");
  if (cartButton) cartButton.addEventListener("click", openCart);

  const closeButton = $("#closeCartButton");
  if (closeButton) closeButton.addEventListener("click", closeCart);

  const overlay = $("#overlay");
  if (overlay) overlay.addEventListener("click", closeCart);

  const searchButton = $("#searchButton");
  if (searchButton) searchButton.addEventListener("click", searchProducts);

  const searchInput = $("#searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") searchProducts();
    });
  }

  const checkoutButton = $("#checkoutButton");
  if (checkoutButton) checkoutButton.addEventListener("click", checkoutWhatsApp);

  const shopButton = document.querySelector('.hero .main-button[href="#products"]');
  if (shopButton) {
    shopButton.addEventListener("click", function () {
      setTimeout(function () {
        const section = $("#products");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 0);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeCart();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  bindNavigation();
  renderProducts(products);
  renderCart();
});
