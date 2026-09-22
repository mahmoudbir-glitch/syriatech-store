const products = [
{id:1,category:"power-bank",brand:"UGREEN",name:"UGREEN Nexode Power Bank 20000mAh",description:"High-capacity portable charger with fast USB-C charging",oldPrice:89.99,price:62.99,badge:"New"},
{id:2,category:"power-bank",brand:"UGREEN",name:"UGREEN 10000mAh Magnetic Power Bank",description:"Slim magnetic power bank for everyday charging",oldPrice:59.99,price:41.99,badge:"New"},
{id:3,category:"power-bank",brand:"Baseus",name:"Baseus Blade Power Bank 100W",description:"Ultra-slim laptop and phone power bank",oldPrice:99.99,price:69.99,badge:"Hot"},
{id:4,category:"power-bank",brand:"Baseus",name:"Baseus Airpow 20000mAh",description:"Portable high-capacity fast charger",oldPrice:49.99,price:34.99,badge:"New"},
{id:5,category:"power-bank",brand:"UGREEN",name:"UGREEN 5000mAh Mini Power Bank",description:"Compact pocket-sized power bank",oldPrice:39.99,price:27.99,badge:""},
{id:6,category:"power-bank",brand:"Baseus",name:"Baseus Magnetic Mini Power Bank",description:"Compact magnetic wireless battery",oldPrice:54.99,price:38.49,badge:"Hot"},

{id:11,category:"charger",brand:"UGREEN",name:"UGREEN Nexode 100W GaN Charger",description:"100W multi-port GaN charger for laptops and phones",oldPrice:89.99,price:62.99,badge:"New"},
{id:12,category:"charger",brand:"UGREEN",name:"UGREEN Nexode 65W GaN Charger",description:"Compact fast charger with USB-C ports",oldPrice:59.99,price:41.99,badge:"Hot"},
{id:13,category:"charger",brand:"Baseus",name:"Baseus GaN5 Pro 100W Charger",description:"High-output desktop wall charger",oldPrice:79.99,price:55.99,badge:"New"},
{id:14,category:"charger",brand:"UGREEN",name:"UGREEN 30W USB-C Charger",description:"Compact everyday fast charger",oldPrice:24.99,price:17.49,badge:""},
{id:15,category:"charger",brand:"Baseus",name:"Baseus 65W GaN Charger",description:"Portable laptop and phone charger",oldPrice:49.99,price:34.99,badge:"New"},
{id:16,category:"charger",brand:"UGREEN",name:"UGREEN 140W Desktop Charger",description:"High-power charging station for multiple devices",oldPrice:129.99,price:90.99,badge:"Hot"},

{id:21,category:"wireless",brand:"UGREEN",name:"UGREEN MagFlow Qi2 Charger",description:"Magnetic wireless charger with Qi2 support",oldPrice:49.99,price:34.99,badge:"New"},
{id:22,category:"wireless",brand:"Baseus",name:"Baseus MagPro Wireless Charger",description:"Magnetic fast wireless charging stand",oldPrice:59.99,price:41.99,badge:"Hot"},
{id:23,category:"wireless",brand:"UGREEN",name:"UGREEN 3-in-1 Wireless Charging Station",description:"Charging station for phone, watch and earbuds",oldPrice:99.99,price:69.99,badge:"New"},
{id:24,category:"wireless",brand:"Baseus",name:"Baseus 3-in-1 Foldable Charger",description:"Foldable multi-device wireless charger",oldPrice:89.99,price:62.99,badge:""},
{id:25,category:"wireless",brand:"UGREEN",name:"UGREEN Wireless Charging Stand",description:"Adjustable desktop wireless charger",oldPrice:39.99,price:27.99,badge:"New"},
{id:26,category:"wireless",brand:"Baseus",name:"Baseus Magnetic Charging Pad",description:"Slim magnetic charging pad",oldPrice:34.99,price:24.49,badge:""},

{id:31,category:"cables",brand:"UGREEN",name:"UGREEN USB-C 240W Braided Cable",description:"Premium high-power braided USB-C cable",oldPrice:24.99,price:17.49,badge:"New"},
{id:32,category:"cables",brand:"Baseus",name:"Baseus USB-C 100W Braided Cable",description:"Durable fast charging cable",oldPrice:19.99,price:13.99,badge:"Hot"},
{id:33,category:"cables",brand:"UGREEN",name:"UGREEN USB-C to Lightning Cable",description:"Fast charging and data cable",oldPrice:21.99,price:15.39,badge:""},
{id:34,category:"cables",brand:"Baseus",name:"Baseus USB-C to USB-C Cable",description:"High-speed charging and data cable",oldPrice:14.99,price:10.49,badge:"New"},
{id:35,category:"cables",brand:"UGREEN",name:"UGREEN Nylon USB-A to USB-C Cable",description:"Reinforced nylon charging cable",oldPrice:12.99,price:9.09,badge:""},
{id:36,category:"cables",brand:"Baseus",name:"Baseus DisplayPort 1.4 Cable",description:"High-resolution display cable",oldPrice:29.99,price:20.99,badge:"Hot"},

{id:41,category:"hubs-docks",brand:"UGREEN",name:"UGREEN Revodok Pro 13-in-1 Hub",description:"Professional USB-C hub with multiple display and data ports",oldPrice:149.99,price:104.99,badge:"New"},
{id:42,category:"hubs-docks",brand:"Baseus",name:"Baseus Metal Gleam 9-in-1 Hub",description:"Premium aluminum USB-C hub",oldPrice:89.99,price:62.99,badge:"Hot"},
{id:43,category:"hubs-docks",brand:"UGREEN",name:"UGREEN 6-in-1 USB-C Hub",description:"Compact connectivity hub",oldPrice:59.99,price:41.99,badge:""},
{id:44,category:"hubs-docks",brand:"Baseus",name:"Baseus 8-in-1 USB-C Dock",description:"Multi-port laptop docking solution",oldPrice:79.99,price:55.99,badge:"New"},
{id:45,category:"hubs-docks",brand:"UGREEN",name:"UGREEN 9-in-1 Docking Station",description:"Desktop connectivity station",oldPrice:109.99,price:76.99,badge:"Hot"},
{id:46,category:"hubs-docks",brand:"Baseus",name:"Baseus 6-in-1 Metal Hub",description:"Compact aluminum multi-port hub",oldPrice:54.99,price:38.49,badge:""},

{id:51,category:"power",brand:"UGREEN",name:"UGREEN Desktop Charging Station",description:"Multi-device desktop charging solution",oldPrice:89.99,price:62.99,badge:"New"},
{id:52,category:"power",brand:"Baseus",name:"Baseus PowerCombo Station",description:"Compact desktop power and charging station",oldPrice:69.99,price:48.99,badge:"Hot"},
{id:53,category:"power",brand:"UGREEN",name:"UGREEN 100W Charging Station",description:"High-speed multi-port desktop charger",oldPrice:99.99,price:69.99,badge:"New"},
{id:54,category:"power",brand:"Baseus",name:"Baseus 65W Desktop Charger",description:"Compact multi-device charging station",oldPrice:64.99,price:45.49,badge:""},
{id:55,category:"power",brand:"UGREEN",name:"UGREEN Power Strip with USB-C",description:"Modern power strip with fast USB charging",oldPrice:59.99,price:41.99,badge:"New"},
{id:56,category:"power",brand:"Baseus",name:"Baseus Power Strip",description:"Desktop power and charging strip",oldPrice:49.99,price:34.99,badge:""},

{id:61,category:"car",brand:"UGREEN",name:"UGREEN 69W Car Charger",description:"Fast dual-port USB-C car charger",oldPrice:34.99,price:24.49,badge:"New"},
{id:62,category:"car",brand:"Baseus",name:"Baseus 65W Car Charger",description:"High-power multi-port car charger",oldPrice:39.99,price:27.99,badge:"Hot"},
{id:63,category:"car",brand:"UGREEN",name:"UGREEN Magnetic Car Mount",description:"Magnetic phone mount for vehicles",oldPrice:29.99,price:20.99,badge:""},
{id:64,category:"car",brand:"Baseus",name:"Baseus Wireless Car Charger Mount",description:"Wireless charging car holder",oldPrice:59.99,price:41.99,badge:"New"},
{id:65,category:"car",brand:"UGREEN",name:"UGREEN USB-C Car Charger",description:"Compact fast car charger",oldPrice:24.99,price:17.49,badge:""},
{id:66,category:"car",brand:"Baseus",name:"Baseus Bluetooth FM Transmitter",description:"Bluetooth audio adapter for cars",oldPrice:29.99,price:20.99,badge:"Hot"},

{id:71,category:"audio",brand:"soundcore",name:"soundcore Liberty 5",description:"True wireless earbuds with active noise cancellation",oldPrice:129.99,price:90.99,badge:"New"},
{id:72,category:"audio",brand:"soundcore",name:"soundcore Space Q45",description:"Wireless headphones with adaptive noise cancellation",oldPrice:149.99,price:104.99,badge:"Hot"},
{id:73,category:"audio",brand:"soundcore",name:"soundcore Boom 2",description:"Portable Bluetooth speaker",oldPrice:129.99,price:90.99,badge:"New"},
{id:74,category:"audio",brand:"soundcore",name:"soundcore Q20i",description:"Wireless headphones with hybrid ANC",oldPrice:69.99,price:48.99,badge:""},
{id:75,category:"audio",brand:"soundcore",name:"soundcore Motion X600",description:"Premium portable spatial audio speaker",oldPrice:199.99,price:139.99,badge:"Hot"},
{id:76,category:"audio",brand:"soundcore",name:"soundcore AeroFit 2",description:"Open-ear wireless headphones",oldPrice:129.99,price:90.99,badge:"New"},

{id:81,category:"security",brand:"eufy",name:"eufyCam S330 4K",description:"4K wireless home security camera",oldPrice:349.99,price:244.99,badge:"New"},
{id:82,category:"security",brand:"eufy",name:"eufy SoloCam S340",description:"Dual-camera wireless security system",oldPrice:129.99,price:90.99,badge:"Hot"},
{id:83,category:"security",brand:"eufy",name:"eufy Indoor Cam S350",description:"High-resolution indoor security camera",oldPrice:129.99,price:90.99,badge:"New"},
{id:84,category:"security",brand:"eufy",name:"eufy Video Doorbell E340",description:"Dual-camera smart video doorbell",oldPrice:179.99,price:125.99,badge:""},
{id:85,category:"security",brand:"eufy",name:"eufy Floodlight Cam E340",description:"Outdoor floodlight security camera",oldPrice:199.99,price:139.99,badge:"Hot"},
{id:86,category:"security",brand:"eufy",name:"eufy HomeBase S380",description:"Smart security central hub",oldPrice:139.99,price:97.99,badge:"New"},

{id:91,category:"smart-home",brand:"eufy",name:"eufy X10 Pro Omni",description:"Robot vacuum and mop with smart station",oldPrice:799.99,price:559.99,badge:"Hot"},
{id:92,category:"smart-home",brand:"eufy",name:"eufy Omni C20",description:"All-in-one robot vacuum and mop",oldPrice:599.99,price:419.99,badge:"New"},
{id:93,category:"smart-home",brand:"eufy",name:"eufy Smart Lock C220",description:"Keypad smart door lock",oldPrice:119.99,price:83.99,badge:""},
{id:94,category:"smart-home",brand:"eufy",name:"eufy Smart Lock E30",description:"Modern smart access control",oldPrice:179.99,price:125.99,badge:"New"},
{id:95,category:"smart-home",brand:"eufy",name:"eufy Baby Monitor E110",description:"Smart baby monitoring system",oldPrice:99.99,price:69.99,badge:""},
{id:96,category:"smart-home",brand:"eufy",name:"eufy Smart Scale P2 Pro",description:"Smart connected body scale",oldPrice:69.99,price:48.99,badge:"New"},

{id:101,category:"projector",brand:"Nebula",name:"Nebula Capsule 3 Laser",description:"Portable laser smart projector",oldPrice:799.99,price:559.99,badge:"New"},
{id:102,category:"projector",brand:"Nebula",name:"Nebula Mars 3 Air",description:"Portable Full HD smart projector",oldPrice:599.99,price:419.99,badge:"Hot"},
{id:103,category:"projector",brand:"Nebula",name:"Nebula Cosmos 4K SE",description:"4K home cinema projector",oldPrice:1299.99,price:909.99,badge:"New"},
{id:104,category:"projector",brand:"Nebula",name:"Nebula Capsule Air",description:"Ultra-portable smart projector",oldPrice:399.99,price:279.99,badge:""},
{id:105,category:"projector",brand:"Nebula",name:"Nebula Mars 3",description:"Outdoor portable cinema projector",oldPrice:1099.99,price:769.99,badge:"Hot"},
{id:106,category:"projector",brand:"Nebula",name:"Nebula Cosmos Laser 4K",description:"Premium laser home cinema projector",oldPrice:1599.99,price:1119.99,badge:"New"},

{id:111,category:"solar",brand:"UGREEN",name:"UGREEN PowerRoam 1200",description:"Portable power station for home and travel",oldPrice:899.99,price:629.99,badge:"New"},
{id:112,category:"solar",brand:"UGREEN",name:"UGREEN PowerRoam 600",description:"Compact portable power station",oldPrice:499.99,price:349.99,badge:"Hot"},
{id:113,category:"solar",brand:"BLUETTI",name:"BLUETTI AC70P",description:"Portable solar power station",oldPrice:699.99,price:489.99,badge:"New"},
{id:114,category:"solar",brand:"BLUETTI",name:"BLUETTI AC180",description:"High-capacity portable power station",oldPrice:999.99,price:699.99,badge:"Hot"},
{id:115,category:"solar",brand:"EcoFlow",name:"EcoFlow RIVER 2 Pro",description:"Portable backup power station",oldPrice:749.99,price:524.99,badge:"New"},
{id:116,category:"solar",brand:"EcoFlow",name:"EcoFlow DELTA 2",description:"Expandable home backup power station",oldPrice:999.99,price:699.99,badge:"New"}
];

// Store promotion: all catalog items show a clear 30% promotional discount.
// Base price = current catalog price (or existing original price when available).
products.forEach(p => {
  const base = Number(p.oldPrice || p.price);
  p.oldPrice = Number(base.toFixed(2));
  p.price = Number((base * 0.70).toFixed(2));
  p.discount = 30;
  p.badge = "30% OFF";
});



// Catalog integrity guard: prevents malformed product records from breaking filters/cart.
products.forEach(p=>{
  if(!p.brand) p.brand="Anker";
  if(!p.category) p.category="accessories";
  if(!p.name) p.name="Anker Product";
  p.price=Number(p.price)||0;
  p.oldPrice=Number(p.oldPrice)||p.price;
  p.discount=p.oldPrice>p.price?Math.round((1-p.price/p.oldPrice)*100):0;
});
const WHATSAPP = "963949951985";
const CART_KEY = "syriatech_cart";
let cart = [];
let isEnglish = false;
let currentView = { category: null, brand: null, query: "" };
function $(selector){return document.querySelector(selector);}
function money(value){return "$"+Number(value).toFixed(2);}
function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    cart = Array.isArray(parsed)
      ? parsed
          .filter(item =>
            item &&
            Number.isFinite(Number(item.id)) &&
            Number(item.qty) > 0 &&
            Number.isFinite(Number(item.price))
          )
          .map(item => ({
            ...item,
            id: Number(item.id),
            qty: Number(item.qty),
            price: Number(item.price)
          }))
      : [];
  } catch (error) {
    cart = [];
    try {
      localStorage.removeItem(CART_KEY);
    } catch (_) {}
  }
}
function saveCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart));}catch(e){}}

function t(){return isEnglish?translations.en:translations.ar;}
function activeFilters(){return{brands:[...document.querySelectorAll("[data-brand-check]:checked")].map(x=>x.dataset.brandCheck),min:+($("#minPrice")?.value||0),max:+($("#maxPrice")?.value||0)}}
function filterProducts({category=undefined,brand=undefined,reset=false}={}) {
  if(reset){
    currentView={category:null,brand:null,query:""};
    document.querySelectorAll("[data-brand-check]").forEach(x=>x.checked=false);
    if($("#minPrice"))$("#minPrice").value="";
    if($("#maxPrice"))$("#maxPrice").value="";
    if($("#searchInput"))$("#searchInput").value="";
  } else {
    const viewChanged = category!==undefined || brand!==undefined;
    if(category!==undefined) currentView.category=category;
    if(brand!==undefined) currentView.brand=brand;
    if(viewChanged){
      currentView.query="";
      if($("#searchInput"))$("#searchInput").value="";
    }
  }

  let list=[...products];
  if(currentView.category) list=list.filter(p=>p.category===currentView.category);
  if(currentView.brand) list=list.filter(p=>p.brand.toLowerCase()===currentView.brand.toLowerCase());

  const f=activeFilters();
  if(f.brands.length) list=list.filter(p=>f.brands.includes(p.brand));
  if(f.min) list=list.filter(p=>p.price>=f.min);
  if(f.max) list=list.filter(p=>p.price<=f.max);

  const q=currentView.query;
  if(q) list=list.filter(p=>[p.name,p.brand,p.description].some(v=>String(v).toLowerCase().includes(q)));

  let label=t().productsTitle;
  if(q) label=t().searchResults;
  else if(currentView.brand) label=currentView.brand+" — "+t().productsLabel;
  else if(currentView.category) label=(t().categories[currentView.category]||t().productsLabel);

  renderProducts(list,label);
  document.querySelectorAll(".side-filter").forEach(x=>x.classList.toggle("active",
    currentView.category ? x.dataset.category===currentView.category : x.hasAttribute("data-category-all")
  ));
  $("#products")?.scrollIntoView({behavior:"smooth",block:"start"});
}
function productImagePath(p){
  // 1) Admin/Vercel image always has priority.
  if (p && typeof p.image === "string" && p.image.trim()) {
    return p.image.trim();
  }

  // 2) Central image file controlled from product-images.js.
  const custom = window.PRODUCT_IMAGES && window.PRODUCT_IMAGES[String(p?.id)];
  if (custom) return custom;

  // 3) Category fallback prevents broken/empty product images.
  const fallbacks = window.PRODUCT_IMAGE_FALLBACKS || {};
  return fallbacks[p?.category] || window.PRODUCT_IMAGE_PLACEHOLDER || "assets/product-accessories.svg";
}
function openImageLightbox(src, alt){
 const box=document.getElementById("imageLightbox");
 const image=document.getElementById("lightboxImage");
 if(!box||!image)return;
 image.src=src; image.alt=alt||"Product image"; box.hidden=false; document.body.classList.add("lightbox-open");
}
function closeImageLightbox(){const box=document.getElementById("imageLightbox");if(box){box.hidden=true;document.body.classList.remove("lightbox-open");}}
function renderProducts(list,label){
 const grid=$("#productsGrid");if(!grid)return;
 let items=[...(list||products)];
 const sort=$("#sortSelect")?.value;
 if(sort==="price-low")items.sort((a,b)=>a.price-b.price);
 if(sort==="price-high")items.sort((a,b)=>b.price-a.price);
 if(sort==="name")items.sort((a,b)=>String(a.name).localeCompare(String(b.name)));
 setText("productsTitle",label||t().productsTitle);
 setText("resultCount",t().showing.replace("{n}",items.length));
 if(!items.length){grid.innerHTML='<div class="empty-state">'+t().emptyProducts+"</div>";return;}
 grid.innerHTML=items.map(p=>{
   const tx=productText(p);
   return '<article class="product"><span class="product-badge">'+(p.badge||"")+'</span><button class="quick-btn" data-quick="'+p.id+'" type="button" aria-label="Quick view">⌕</button><div class="product-image"><img src="'+productImagePath(p)+'" alt="'+tx.name+'" loading="lazy" onerror="this.onerror=null;this.src=&quot;assets/product-accessories.svg&quot;"></div><div class="product-info"><small>'+p.brand+'</small><h3>'+tx.name+'</h3><p>'+tx.description+'</p><div class="product-bottom"><div><del>'+money(p.oldPrice)+'</del><strong>'+money(p.price)+'</strong><span class="discount-label">30% OFF</span></div><button class="add-product" data-id="'+p.id+'" type="button" aria-label="'+t().addToCart+'"><i class="fa-solid fa-plus"></i></button></div></div></article>';
 }).join("");
 grid.querySelectorAll(".product-image img").forEach(img=>img.onclick=()=>openImageLightbox(img.src,img.alt));
 grid.querySelectorAll(".add-product").forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));
 grid.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>openQuickView(+b.dataset.quick));
}
function renderCart() {
  const box = $("#cartItems");
  const count = $("#cartCount");
  const total = $("#cartTotal");

  if (!box) return;

  const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);

  if (count) count.textContent = totalQty;
  if (total) total.textContent = totalPrice.toFixed(2);

  if (!cart.length) {
    box.innerHTML = `<div class="empty-state">${t().emptyCart}</div>`;
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div class="cart-controls">
          <button class="qty-minus" data-id="${item.id}" type="button" aria-label="${isEnglish ? "Decrease quantity" : "إنقاص الكمية"}">−</button>
          <span>${item.qty}</span>
          <button class="qty-plus" data-id="${item.id}" type="button" aria-label="${isEnglish ? "Increase quantity" : "زيادة الكمية"}">+</button>
        </div>
      </div>
      <div>
        <strong>${money(Number(item.price) * Number(item.qty))}</strong>
        <button class="remove-item" data-id="${item.id}" type="button" title="${t().remove}" aria-label="${t().remove}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join("");

  box.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.id), -1));
  });

  box.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.id), 1));
  });

  box.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const e=cart.find(x=>x.id===id);e?e.qty++:cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();renderCart();openCart();}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<1)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function openCart(){$("#cart")?.classList.add("open");$("#overlay")?.classList.add("active");}function closeCart(){$("#cart")?.classList.remove("open");$("#overlay")?.classList.remove("active");}
function openQuickView(id){const p=products.find(x=>x.id===id);if(!p)return;$("#quickContent").innerHTML='<div class="quick-product"><div class="quick-product-image"><img src="'+productImagePath(p)+'" alt="'+p.name+'"></div><div><small>'+p.brand+'</small><h2>'+p.name+'</h2><div class="quick-price">'+money(p.price)+' <del>'+money(p.oldPrice)+'</del></div><p class="quick-desc">'+p.description+'</p><button class="main-button" id="quickAdd">'+t().addToCart+'</button></div></div>';$("#quickView").classList.add("open");$("#quickAdd").onclick=()=>{addToCart(id);closeQuickView();};}
function closeQuickView(){$("#quickView")?.classList.remove("open");}
function searchProducts(){
  const q=($("#searchInput")?.value||"").trim().toLowerCase();
  currentView.query=q;
  let list=[...products];
  if(currentView.category)list=list.filter(p=>p.category===currentView.category);
  if(currentView.brand)list=list.filter(p=>p.brand.toLowerCase()===currentView.brand.toLowerCase());
  const f=activeFilters();
  if(f.brands.length)list=list.filter(p=>f.brands.includes(p.brand));
  if(f.min)list=list.filter(p=>p.price>=f.min);
  if(f.max)list=list.filter(p=>p.price<=f.max);
  if(q)list=list.filter(p=>[p.name,p.brand,p.description].some(v=>String(v).toLowerCase().includes(q)));
  renderProducts(list,q?t().searchResults:t().productsTitle);
  $("#products")?.scrollIntoView({behavior:"smooth"});
}
const translations={
ar:{
top:"شحن سريع لجميع المناطق | اطلب الآن عبر واتساب",noticeRight:"منتجات تقنية أصلية • دعم عبر واتساب",
home:"الرئيسية",shopNav:"المتجر",brands:"العلامات التجارية",offers:"العروض",collections:"المجموعات",contactNav:"تواصل معنا",search:"بحث",shop:"تسوق الآن",heroTitle:"تقنية أصلية. اختيار أذكى.",heroSub:"اكتشف منتجات Anker ومنظومات soundcore وeufy وNebula في تجربة متجر سريعة وواضحة.",heroBadge:"مجموعة منتجات أصلية",
benefit1:"منتجات أصلية",benefit2:"شحن سريع",benefit3:"دعم عبر واتساب",benefit4:"عروض وأسعار واضحة",
brandsEyebrow:"علاماتنا التجارية",brandsTitle:"تسوق حسب العلامة التجارية",ankerDesc:"طاقة • شحن • ملحقات",soundcoreDesc:"سماعات • أذن • مكبرات",eufyDesc:"أمان • منزل ذكي",nebulaDesc:"أجهزة عرض • سينما",solixDesc:"طاقة متنقلة • طاقة شمسية",
productsEyebrow:"منتجات مميزة",productsTitle:"منتجات Anker ومجموعاتها",productsLabel:"المنتجات",allProducts:"عرض كل المنتجات",catPowerBank:"باور بانك",catChargers:"الشواحن",catWireless:"الشحن اللاسلكي",catCables:"الكابلات",catHubs:"المحطات والموزعات",catPower:"الطاقة ومحطات الشحن",catCar:"شحن السيارة",catAudio:"الصوتيات والسماعات",catSecurity:"الأمان",catSmart:"المنزل الذكي",catProjector:"أجهزة العرض",catSolar:"طاقة SOLIX",
categories:{"power-bank":"Power Banks",charger:"Chargers",wireless:"Wireless Charging",cables:"Cables","hubs-docks":"Hubs & Docks",power:"Power & Charging Stations",car:"Car Charging",audio:"Audio & Headphones",security:"Security","smart-home":"Smart Home",projector:"Projectors",solar:"SOLIX Energy"},
sortFeatured:"مميز",sortLow:"السعر: من الأقل",sortHigh:"السعر: من الأعلى",sortName:"الاسم",showing:"عرض {n} منتج",emptyProducts:"لا توجد منتجات مطابقة.",
offersEyebrow:"عروض خاصة",offersTitle:"عروض مختارة من Anker ومنظوماته",dealSub:"خصومات على منتجات محددة مع عرض السعر قبل وبعد الخصم.",order:"اطلب عبر واتساب",
quickAnker:"الشحن والطاقة",quickSoundcore:"الصوتيات",quickEufy:"المنزل الذكي والأمان",quickNebula:"أجهزة العرض",
contactEyebrow:"تواصل معنا",contactTitle:"تواصل معنا",contactSub:"للطلب والاستفسار تواصل معنا مباشرة عبر واتساب.",
cartLabel:"السلة",cartEyebrow:"طلبك",cartTitle:"سلة المشتريات",emptyCart:"السلة فارغة حالياً.",addToCart:"أضف للسلة",remove:"حذف",total:"المجموع",checkout:"إتمام الطلب عبر واتساب",searchResults:"نتائج البحث",
footerDesc:"متجر تقني مستقل لمنتجات Anker ومنظوماته.",footerProducts:"المنتجات",footerHelp:"المساعدة",footerBrands:"العلامات التجارية",footerNote:"جميع أسماء المنتجات علامات تجارية لمالكيها.",
megaCharging:"الشحن",megaAllAudio:"كل الصوتيات",megaEufy:"الأمان والمنزل الذكي",megaNebula:"أجهزة Nebula"
},
en:{
top:"Fast shipping to all areas | Order now on WhatsApp",noticeRight:"Original technology products • WhatsApp support",
home:"Home",shopNav:"Shop",brands:"Brands",offers:"Offers",collections:"Collections",contactNav:"Contact Us",search:"Search",shop:"Shop Now",heroTitle:"Original technology. Smarter choice.",heroSub:"Discover Anker and its soundcore, eufy and Nebula ecosystem in a fast, clear shopping experience.",heroBadge:"Original product collection",
benefit1:"Original products",benefit2:"Fast shipping",benefit3:"WhatsApp support",benefit4:"Clear prices & offers",
brandsEyebrow:"OUR BRANDS",brandsTitle:"Shop by Brand",ankerDesc:"Power • Charging • Accessories",soundcoreDesc:"Headphones • Earbuds • Speakers",eufyDesc:"Security • Smart Home",nebulaDesc:"Projectors • Cinema",solixDesc:"Portable Energy • Solar",
productsEyebrow:"FEATURED PRODUCTS",productsTitle:"Anker Products & Ecosystem",productsLabel:"Products",allProducts:"View All Products",catPowerBank:"Power Banks",catChargers:"Chargers",catWireless:"Wireless Charging",catCables:"Cables",catHubs:"Hubs & Docks",catPower:"Power & Charging",catCar:"Car Charging",catAudio:"Audio & Headphones",catSecurity:"Security",catSmart:"Smart Home",catProjector:"Projectors",catSolar:"SOLIX Energy",
categories:{"power-bank":"Power Banks",charger:"Chargers",wireless:"Wireless Charging",cables:"Cables","hubs-docks":"Hubs & Docks",power:"Power & Charging Stations",car:"Car Charging",audio:"Audio & Headphones",security:"Security","smart-home":"Smart Home",projector:"Projectors",solar:"SOLIX Energy"},
sortFeatured:"Featured",sortLow:"Price: Low to High",sortHigh:"Price: High to Low",sortName:"Name",showing:"Showing {n} products",emptyProducts:"No matching products.",
offersEyebrow:"SPECIAL OFFERS",offersTitle:"Selected offers from Anker and its ecosystem",dealSub:"Discounts on selected products with the original and sale prices shown.",order:"Order via WhatsApp",
quickAnker:"Charging & Power",quickSoundcore:"Audio",quickEufy:"Smart Home & Security",quickNebula:"Projectors",
contactEyebrow:"CONTACT",contactTitle:"Contact Us",contactSub:"For orders and inquiries, contact us directly on WhatsApp.",
cartLabel:"Cart",cartEyebrow:"YOUR ORDER",cartTitle:"Shopping Cart",emptyCart:"Your cart is empty.",addToCart:"Add to cart",remove:"Remove",total:"Total",checkout:"Checkout via WhatsApp",searchResults:"Search results",
footerDesc:"Independent technology store for Anker and its ecosystem.",footerProducts:"Products",footerHelp:"Help",footerBrands:"Brands",footerNote:"All product names are trademarks of their respective owners.",
megaCharging:"Charging",megaAllAudio:"All Audio",megaEufy:"Security & Smart Home",megaNebula:"Nebula Projectors"
}};
function setText(id,v){const e=$("#"+id);if(e)e.textContent=v;}
function changeLanguage(){isEnglish=!isEnglish;const x=t();document.documentElement.lang=isEnglish?"en":"ar";document.documentElement.dir=isEnglish?"ltr":"rtl";document.querySelectorAll("[data-i18n]").forEach(e=>{if(x[e.dataset.i18n])e.textContent=x[e.dataset.i18n]});setText("languageButton",isEnglish?"🌐 AR":"🌐 EN");if($("#searchInput"))$("#searchInput").placeholder=isEnglish?"Search for a product or model...":"ابحث عن منتج أو موديل...";let list=[...products];
if(currentView.category)list=list.filter(p=>p.category===currentView.category);
if(currentView.brand)list=list.filter(p=>p.brand.toLowerCase()===currentView.brand.toLowerCase());
if(currentView.query)list=list.filter(p=>[p.name,p.brand,p.description].some(v=>String(v).toLowerCase().includes(currentView.query)));
renderProducts(list,currentView.query?t().searchResults:(currentView.brand?currentView.brand+" — "+t().productsLabel:(currentView.category?(t().categories[currentView.category]||t().productsLabel):t().productsTitle)));
renderCart();}
function checkoutWhatsApp(e){if(e)e.preventDefault();if(!cart.length){alert(t().emptyCart);return;}const lines=cart.map(i=>"• "+i.name+" × "+i.qty+" = "+money(i.price*i.qty));const total=cart.reduce((s,i)=>s+i.price*i.qty,0);window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent((isEnglish?"Hello Syriatech, I would like to order:":"مرحباً Syriatech، أريد طلب المنتجات التالية:")+"\n\n"+lines.join("\n")+"\n\n"+(isEnglish?"Total: ":"المجموع: ")+money(total)),"_blank");}
function bindNavigation(){$("#languageButton")?.addEventListener("click",changeLanguage);$("#cartButton")?.addEventListener("click",openCart);$("#closeCartButton")?.addEventListener("click",closeCart);$("#overlay")?.addEventListener("click",closeCart);$("#searchForm")?.addEventListener("submit",e=>{e.preventDefault();searchProducts()});$("#checkoutButton")?.addEventListener("click",checkoutWhatsApp);$("#clearFilterButton")?.addEventListener("click",()=>filterProducts({reset:true}));$("#applyPrice")?.addEventListener("click",()=>filterProducts());$("#sortSelect")?.addEventListener("change",()=>filterProducts());document.querySelectorAll("[data-category]").forEach(e=>e.addEventListener("click",()=>filterProducts({category:e.dataset.category})));document.querySelectorAll("[data-category-all]").forEach(e=>e.addEventListener("click",()=>filterProducts({reset:true})));document.querySelectorAll("[data-brand]").forEach(e=>e.addEventListener("click",a=>{a.preventDefault();filterProducts({brand:e.dataset.brand})}));document.querySelectorAll("[data-filter-all]").forEach(e=>e.addEventListener("click",a=>{a.preventDefault();filterProducts({reset:true})}));document.querySelectorAll("[data-brand-check]").forEach(e=>e.addEventListener("change",()=>filterProducts()));$("#closeQuick")?.addEventListener("click",closeQuickView);$("#quickView")?.addEventListener("click",e=>{if(e.target.id==="quickView")closeQuickView()});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeQuickView()}});}
document.addEventListener("DOMContentLoaded",()=>{loadCart();bindNavigation();renderProducts(products);renderCart();});function productText(p){
  if(isEnglish) return {name:p.name,description:p.description};
  const d={
    "power-bank":"باور بانك أصلي من Anker للاستخدام اليومي والشحن السريع.",
    "charger":"شاحن أصلي من Anker للشحن السريع والآمن.",
    "wireless":"حل شحن لاسلكي أصلي من Anker للأجهزة المتوافقة.",
    "cables":"كابل أصلي من Anker لنقل البيانات والشحن.",
    "hubs-docks":"محطة أو موزع أصلي من Anker لتوسيع الاتصال والمنافذ.",
    "power":"حل طاقة وشحن أصلي من Anker للمكتب والمنزل.",
    "car":"حل شحن أصلي من Anker للسيارة.",
    "audio":"منتج صوتي أصلي من منظومة soundcore.",
    "security":"منتج أمان ذكي أصلي من منظومة eufy.",
    "smart-home":"منتج منزل ذكي أصلي من منظومة eufy.",
    "projector":"جهاز عرض أصلي من Nebula.",
    "solar":"حل طاقة أصلي من Anker SOLIX."
  };
  return {name:p.name,description:d[p.category]||p.description};
}
function renderProducts(list,label){
 const grid=$("#productsGrid");if(!grid)return;let items=[...(list||products)];const s=$("#sortSelect")?.value;if(s==="price-low")items.sort((a,b)=>a.price-b.price);if(s==="price-high")items.sort((a,b)=>b.price-a.price);if(s==="name")items.sort((a,b)=>a.name.localeCompare(b.name));
 setText("productsTitle",label||t().productsTitle);setText("resultCount",t().showing.replace("{n}",items.length));setText("allCount",products.length);
 if(!items.length){grid.innerHTML='<div class="empty-state">'+t().emptyProducts+"</div>";return;}
 grid.innerHTML=items.map(p=>'<article class="product"><span class="product-badge">'+(p.badge||"")+'</span><button class="quick-btn" data-quick="'+p.id+'" type="button" aria-label="Quick view">⌕</button><div class="product-image"><img src="'+productImagePath(p)+'" alt="'+p.name+'" loading="lazy" onerror="this.onerror=null;this.src=\'assets/product-accessories.svg\'"></div><div class="product-info"><small>'+p.brand+'</small><h3>'+p.name+'</h3><p>'+p.description+'</p><div class="product-bottom"><div><del>'+money(p.oldPrice)+'</del><strong>'+money(p.price)+'</strong><span class="discount-label">30% OFF</span></div><button class="add-product" data-id="'+p.id+'" type="button" aria-label="'+t().addToCart+'"><i class="fa-solid fa-plus"></i></button></div></div></article>').join("");
 grid.querySelectorAll(".add-product").forEach(b=>b.onclick=()=>addToCart(+b.dataset.id));grid.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>openQuickView(+b.dataset.quick));
}
function renderCart() {
  const box = $("#cartItems");
  const count = $("#cartCount");
  const total = $("#cartTotal");

  if (!box) return;

  const totalQty = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0);

  if (count) count.textContent = totalQty;
  if (total) total.textContent = totalPrice.toFixed(2);

  if (!cart.length) {
    box.innerHTML = `<div class="empty-state">${t().emptyCart}</div>`;
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <div class="cart-controls">
          <button class="qty-minus" data-id="${item.id}" type="button" aria-label="${isEnglish ? "Decrease quantity" : "إنقاص الكمية"}">−</button>
          <span>${item.qty}</span>
          <button class="qty-plus" data-id="${item.id}" type="button" aria-label="${isEnglish ? "Increase quantity" : "زيادة الكمية"}">+</button>
        </div>
      </div>
      <div>
        <strong>${money(Number(item.price) * Number(item.qty))}</strong>
        <button class="remove-item" data-id="${item.id}" type="button" title="${t().remove}" aria-label="${t().remove}">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join("");

  box.querySelectorAll(".qty-minus").forEach(button => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.id), -1));
  });

  box.querySelectorAll(".qty-plus").forEach(button => {
    button.addEventListener("click", () => changeQty(Number(button.dataset.id), 1));
  });

  box.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => removeFromCart(Number(button.dataset.id)));
  });
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const e=cart.find(x=>x.id===id);e?e.qty++:cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();renderCart();openCart();}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<1)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function openCart(){$("#cart")?.classList.add("open");$("#overlay")?.classList.add("active");}function closeCart(){$("#cart")?.classList.remove("open");$("#overlay")?.classList.remove("active");}
function openQuickView(id){const p=products.find(x=>x.id===id);if(!p)return;$("#quickContent").innerHTML='<div class="quick-product"><div class="quick-product-image"><img src="'+productImagePath(p)+'" alt="'+p.name+'"></div><div><small>'+p.brand+'</small><h2>'+p.name+'</h2><div class="quick-price">'+money(p.price)+' <del>'+money(p.oldPrice)+'</del></div><p class="quick-desc">'+p.description+'</p><button class="main-button" id="quickAdd">'+t().addToCart+'</button></div></div>';$("#quickView").classList.add("open");$("#quickAdd").onclick=()=>{addToCart(id);closeQuickView();};}
function closeQuickView(){$("#quickView")?.classList.remove("open");}
function searchProducts(){
  const q=($("#searchInput")?.value||"").trim().toLowerCase();
  currentView.query=q;
  let list=[...products];
  if(currentView.category)list=list.filter(p=>p.category===currentView.category);
  if(currentView.brand)list=list.filter(p=>p.brand.toLowerCase()===currentView.brand.toLowerCase());
  const f=activeFilters();
  if(f.brands.length)list=list.filter(p=>f.brands.includes(p.brand));
  if(f.min)list=list.filter(p=>p.price>=f.min);
  if(f.max)list=list.filter(p=>p.price<=f.max);
  if(q)list=list.filter(p=>[p.name,p.brand,p.description].some(v=>String(v).toLowerCase().includes(q)));
  renderProducts(list,q?t().searchResults:t().productsTitle);
  $("#products")?.scrollIntoView({behavior:"smooth"});
}
function setText(id,v){const e=$("#"+id);if(e)e.textContent=v;}
function changeLanguage(){isEnglish=!isEnglish;const x=t();document.documentElement.lang=isEnglish?"en":"ar";document.documentElement.dir=isEnglish?"ltr":"rtl";document.querySelectorAll("[data-i18n]").forEach(e=>{if(x[e.dataset.i18n])e.textContent=x[e.dataset.i18n]});setText("languageButton",isEnglish?"🌐 AR":"🌐 EN");if($("#searchInput"))$("#searchInput").placeholder=isEnglish?"Search for a product or model...":"ابحث عن منتج أو موديل...";let list=[...products];
if(currentView.category)list=list.filter(p=>p.category===currentView.category);
if(currentView.brand)list=list.filter(p=>p.brand.toLowerCase()===currentView.brand.toLowerCase());
if(currentView.query)list=list.filter(p=>[p.name,p.brand,p.description].some(v=>String(v).toLowerCase().includes(currentView.query)));
renderProducts(list,currentView.query?t().searchResults:(currentView.brand?currentView.brand+" — "+t().productsLabel:(currentView.category?(t().categories[currentView.category]||t().productsLabel):t().productsTitle)));
renderCart();}
function checkoutWhatsApp(e){if(e)e.preventDefault();if(!cart.length){alert(t().emptyCart);return;}const lines=cart.map(i=>"• "+i.name+" × "+i.qty+" = "+money(i.price*i.qty));const total=cart.reduce((s,i)=>s+i.price*i.qty,0);window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent((isEnglish?"Hello Syriatech, I would like to order:":"مرحباً Syriatech، أريد طلب المنتجات التالية:")+"\n\n"+lines.join("\n")+"\n\n"+(isEnglish?"Total: ":"المجموع: ")+money(total)),"_blank");}
function bindNavigation(){$("#languageButton")?.addEventListener("click",changeLanguage);$("#cartButton")?.addEventListener("click",openCart);$("#closeCartButton")?.addEventListener("click",closeCart);$("#overlay")?.addEventListener("click",closeCart);$("#searchForm")?.addEventListener("submit",e=>{e.preventDefault();searchProducts()});$("#checkoutButton")?.addEventListener("click",checkoutWhatsApp);$("#clearFilterButton")?.addEventListener("click",()=>filterProducts({reset:true}));$("#applyPrice")?.addEventListener("click",()=>filterProducts());$("#sortSelect")?.addEventListener("change",()=>filterProducts());document.querySelectorAll("[data-category]").forEach(e=>e.addEventListener("click",()=>filterProducts({category:e.dataset.category})));document.querySelectorAll("[data-category-all]").forEach(e=>e.addEventListener("click",()=>filterProducts({reset:true})));document.querySelectorAll("[data-brand]").forEach(e=>e.addEventListener("click",a=>{a.preventDefault();filterProducts({brand:e.dataset.brand})}));document.querySelectorAll("[data-filter-all]").forEach(e=>e.addEventListener("click",a=>{a.preventDefault();filterProducts({reset:true})}));document.querySelectorAll("[data-brand-check]").forEach(e=>e.addEventListener("change",()=>filterProducts()));$("#closeQuick")?.addEventListener("click",closeQuickView);$("#quickView")?.addEventListener("click",e=>{if(e.target.id==="quickView")closeQuickView()});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeCart();closeQuickView()}});}
document.addEventListener("DOMContentLoaded",()=>{loadCart();bindNavigation();renderProducts(products);renderCart();});


// Admin/Vercel catalog sync: loads administrator changes and uploaded Vercel Blob images.
async function syncAdminCatalog(){
  try{
    const response=await fetch("/api/products?ts="+Date.now(),{cache:"no-store"});
    if(!response.ok) return;
    const remote=await response.json();
    const deleted=new Set((remote.deleted||[]).map(Number));

    for(let i=products.length-1;i>=0;i--){
      if(deleted.has(Number(products[i].id))) products.splice(i,1);
    }

    Object.values(remote.overrides||{}).forEach(remoteProduct=>{
      const id=Number(remoteProduct.id);
      const local=products.find(p=>Number(p.id)===id);
      if(local) Object.assign(local,remoteProduct);
      else if(!deleted.has(id)) products.push(remoteProduct);
    });

    (remote.additions||[]).forEach(remoteProduct=>{
      const id=Number(remoteProduct.id);
      if(!deleted.has(id) && !products.some(p=>Number(p.id)===id)) products.push(remoteProduct);
    });

    products.forEach(p=>{
      p.price=Number(p.price)||0;
      p.oldPrice=Number(p.oldPrice)||p.price;
      if(!p.badge) p.badge="NEW";
    });

    renderProducts(products);
    renderCart();
  }catch(error){
    console.warn("Admin catalog sync unavailable",error);
  }
}


document.addEventListener("DOMContentLoaded",()=>{setTimeout(syncAdminCatalog,150);});
