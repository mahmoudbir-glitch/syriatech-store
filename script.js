const products = [
{id:1,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Prime Power Bank 26K 300W",description:"باور بانك Prime بسعة 26,000mAh وقدرة تصل إلى 300W",oldPrice:229.99,price:199.99,badge:"New"},
{id:2,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Prime Power Bank 20K 220W",description:"باور بانك Prime عالي القدرة للشحن متعدد الأجهزة",oldPrice:179.99,price:129.99,badge:"New"},
{id:3,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Laptop Power Bank 25K 165W",description:"25,000mAh و165W مع كابلات USB-C مدمجة قابلة للسحب",oldPrice:119.99,price:104.99,badge:"Hot"},
{id:4,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Nano Power Bank 5K MagGo",description:"باور بانك مغناطيسي نحيف بسعة 5,000mAh",oldPrice:null,price:54.99,badge:"New"},
{id:5,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker MagGo Power Bank 10K Slim",description:"باور بانك MagGo بسعة 10,000mAh وتصميم نحيف",oldPrice:null,price:79.99,badge:"Hot"},
{id:6,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker 737 Power Bank (PowerCore 24K)",description:"باور بانك عالي الأداء بسعة 24,000mAh",oldPrice:null,price:109.99,badge:""},
{id:7,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker 633 Magnetic Battery",description:"بطارية مغناطيسية للشحن أثناء التنقل",oldPrice:59.99,price:39.99,badge:"Sale"},
{id:8,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Zolo Power Bank 10K 30W",description:"باور بانك 10,000mAh بقدرة 30W وكابل USB-C مدمج",oldPrice:null,price:29.99,badge:""},
{id:9,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Prime Charger 160W 3-Port",description:"شاحن Prime بقدرة 160W وثلاثة منافذ",oldPrice:null,price:109.99,badge:"New"},
{id:10,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Charger 45W Smart Display",description:"شاحن Nano بقدرة 45W مع شاشة ذكية وتصميم قابل للطي",oldPrice:null,price:39.99,badge:"New"},
{id:11,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Charger 30W",description:"شاحن USB-C صغير بقدرة 30W",oldPrice:null,price:29.99,badge:""},
{id:12,category:"charger",icon:"🔌",brand:"Anker",name:"Anker 735 Charger GaNPrime 65W",description:"شاحن GaN متعدد المنافذ بقدرة 65W",oldPrice:null,price:49.99,badge:""},
{id:13,category:"charger",icon:"🔌",brand:"Anker",name:"Anker 737 Charger GaNPrime 120W",description:"شاحن سريع متعدد المنافذ بقدرة 120W",oldPrice:null,price:89.99,badge:""},
{id:14,category:"charger",icon:"🔌",brand:"Anker",name:"Anker 747 Charger GaNPrime 150W",description:"شاحن مكتبي عالي القدرة للأجهزة المتعددة",oldPrice:null,price:99.99,badge:""},
{id:15,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Charging Station 7-in-1 100W",description:"محطة شحن متعددة المنافذ بقدرة 100W",oldPrice:null,price:79.99,badge:"New"},
{id:16,category:"accessories",icon:"🔗",brand:"Anker",name:"Anker Prime USB-C to USB-C Cable 240W",description:"كابل USB-C إلى USB-C بقدرة تصل إلى 240W",oldPrice:null,price:29.99,badge:""},
{id:17,category:"accessories",icon:"🔗",brand:"Anker",name:"Anker USB-C Cable 333 Series",description:"كابل USB-C متين للاستخدام اليومي",oldPrice:null,price:19.99,badge:""},
{id:18,category:"accessories",icon:"📡",brand:"Anker",name:"Anker 3-in-1 Cube with Qi2",description:"قاعدة شحن لاسلكية متعددة الأجهزة بتقنية Qi2",oldPrice:null,price:109.99,badge:""},
{id:19,category:"accessories",icon:"🖥️",brand:"Anker",name:"Anker Prime DL7400 Docking Station 14-in-1",description:"Docking Station متعددة المنافذ مع دعم شاشات متعددة",oldPrice:299.99,price:259.99,badge:""},
{id:20,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Liberty 5 Pro",description:"سماعات True Wireless من سلسلة Liberty",oldPrice:null,price:149.99,badge:"New"},
{id:21,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Space 2",description:"سماعات رأس لاسلكية مع عزل ضوضاء",oldPrice:null,price:99.99,badge:"New"},
{id:22,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore AeroFit 2 Pro",description:"سماعات Open-Ear رياضية مريحة للاستخدام الطويل",oldPrice:null,price:129.99,badge:""},
{id:23,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore AeroClip",description:"سماعات Clip-On لاسلكية خفيفة",oldPrice:null,price:129.99,badge:"New"},
{id:24,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Sleep Earbuds 4 Pro",description:"سماعات مصممة للنوم والراحة",oldPrice:null,price:149.99,badge:"New"},
{id:25,category:"audio",icon:"🔊",brand:"Anker soundcore",name:"soundcore Motion X500",description:"سماعة محمولة بصوت قوي",oldPrice:null,price:169.99,badge:""},
{id:26,category:"audio",icon:"🔊",brand:"Anker soundcore",name:"soundcore Rave Neo 2",description:"سماعة محمولة للحفلات",oldPrice:null,price:179.99,badge:""},
{id:27,category:"security",icon:"📷",brand:"eufy",name:"eufyCam S3 Pro",description:"نظام كاميرات أمان لاسلكية متقدم",oldPrice:null,price:699.99,badge:"New"},
{id:28,category:"security",icon:"📷",brand:"eufy",name:"eufyCam S330 (eufyCam 3)",description:"كاميرا أمنية 4K مع خيارات تخزين محلي وطاقة شمسية",oldPrice:null,price:349.99,badge:""},
{id:29,category:"security",icon:"📷",brand:"eufy",name:"SoloCam S340",description:"كاميرا أمنية مزدوجة العدسة مع رؤية ليلية ملونة",oldPrice:null,price:129.99,badge:""},
{id:30,category:"security",icon:"📷",brand:"eufy",name:"Floodlight Camera E340",description:"كاميرا Floodlight مزدوجة العدسة وتغطية 360°",oldPrice:null,price:199.99,badge:"New"},
{id:31,category:"security",icon:"🔔",brand:"eufy",name:"Video Smart Lock S330",description:"قفل ذكي للفيديو والأبواب",oldPrice:null,price:349.99,badge:""},
{id:32,category:"smart-home",icon:"🔐",brand:"eufy",name:"eufy Smart Lock C210",description:"قفل ذكي للمنزل مع تحكم إلكتروني",oldPrice:null,price:89.99,badge:""},
{id:33,category:"smart-home",icon:"🏠",brand:"eufy",name:"eufy HomeBase S380 (HomeBase 3)",description:"مركز المنزل الذكي وإدارة أجهزة الأمان",oldPrice:null,price:139.99,badge:""},
{id:34,category:"smart-home",icon:"🤖",brand:"eufy",name:"eufy Robot Vacuum",description:"حلول تنظيف روبوتية من منظومة eufy",oldPrice:null,price:499.99,badge:""},
{id:35,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula X1 Pro",description:"محطة سينما محمولة من Nebula",oldPrice:null,price:2499.99,badge:"New"},
{id:36,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Capsule Series",description:"أجهزة عرض محمولة مدمجة من سلسلة Capsule",oldPrice:null,price:599.99,badge:""},
{id:37,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Mars Series",description:"أجهزة عرض محمولة عالية السطوع من سلسلة Mars",oldPrice:null,price:999.99,badge:""},
{id:38,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Cosmos Series",description:"أجهزة عرض منزلية من سلسلة Cosmos",oldPrice:null,price:899.99,badge:""},
{id:39,category:"solar",icon:"☀️",brand:"Anker",name:"Anker SOLIX C1000 Gen 2",description:"محطة طاقة محمولة عالية السعة من Anker SOLIX",oldPrice:null,price:799.99,badge:""},
{id:40,category:"solar",icon:"☀️",brand:"Anker",name:"Anker SOLIX C2000 Gen 2",description:"محطة طاقة محمولة عالية القدرة من Anker SOLIX",oldPrice:null,price:1399.99,badge:""},
{id:41,category:"solar",icon:"☀️",brand:"Anker",name:"Anker SOLIX PS60 Portable Solar Panel",description:"لوح شمسي محمول من منظومة Anker SOLIX",oldPrice:null,price:149.99,badge:""}
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


const ankerCategoryAdditions = [
  {id:101,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Nano Power Bank 10K 45W",description:"10,000mAh، خرج 45W وكابل USB-C مدمج",base:59.99},
  {id:102,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Prime Power Bank 9.6K 65W",description:"بطارية Prime مدمجة بقدرة 65W",base:89.99},
  {id:103,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Nano Power Bank 30W Built-In USB-C",description:"باور بانك Nano مع كابل USB-C مدمج",base:49.99},
  {id:104,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker 621 Magnetic Battery MagGo",description:"بطارية مغناطيسية MagGo نحيفة",base:42.99},
  {id:105,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker 622 Magnetic Battery MagGo",description:"بطارية مغناطيسية مع تصميم عملي للحمل",base:47.99},
  {id:106,category:"power-bank",icon:"🔋",brand:"Anker",name:"Anker Zolo Power Bank 20K",description:"20,000mAh مع USB-C وكابل مدمج",base:54.99},

  {id:107,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Charger 45W 180° Foldable",description:"شاحن Nano سريع وقابل للطي",base:39.99},
  {id:108,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Charger 65W",description:"شاحن USB-C صغير بقدرة 65W",base:49.99},
  {id:109,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Prime Charger 100W 3-Port",description:"شاحن Prime متعدد المنافذ بقدرة 100W",base:79.99},
  {id:110,category:"charger",icon:"🔌",brand:"Anker",name:"Anker 735 Charger 65W GaNPrime",description:"شاحن GaNPrime متعدد المنافذ",base:59.99},
  {id:111,category:"charger",icon:"🔌",brand:"Anker",name:"Anker 737 Charger 120W GaNPrime",description:"شاحن سريع عالي القدرة للأجهزة المتعددة",base:99.99},
  {id:112,category:"charger",icon:"🔌",brand:"Anker",name:"Anker Nano Travel Adapter 5-in-1 20W",description:"محول سفر متعدد الوظائف",base:39.99},

  {id:113,category:"accessories",icon:"🔗",brand:"Anker",name:"Anker Prime USB-C Cable 240W Upcycled-Braided",description:"كابل USB-C متين بقدرة تصل إلى 240W",base:29.99},
  {id:114,category:"accessories",icon:"📡",brand:"Anker",name:"Anker MagGo Wireless Charger 2-in-1",description:"شاحن لاسلكي 2-in-1 مع محول",base:69.99},
  {id:115,category:"accessories",icon:"📱",brand:"Anker",name:"Anker MagGo Qi2 15W Stand",description:"حامل وشاحن MagGo بتقنية Qi2",base:45.99},
  {id:116,category:"accessories",icon:"🖥️",brand:"Anker",name:"Anker Nano Docking Station 13-in-1",description:"Docking Station متعددة المنافذ ودعم شاشات",base:149.99},
  {id:117,category:"accessories",icon:"🖥️",brand:"Anker",name:"Anker Prime TB5 Docking Station 14-in-1",description:"محطة Thunderbolt 5 احترافية",base:399.99},
  {id:118,category:"accessories",icon:"🔌",brand:"Anker",name:"Anker 543 USB-C Hub",description:"Hub USB-C لتوسيع منافذ الكمبيوتر",base:39.99},

  {id:119,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Liberty 5",description:"سماعات True Wireless مع إلغاء ضوضاء",base:129.99},
  {id:120,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore P42i",description:"سماعات لاسلكية للاستخدام اليومي",base:79.99},
  {id:121,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Liberty 4 NC",description:"سماعات True Wireless مع ANC",base:99.99},
  {id:122,category:"audio",icon:"🎧",brand:"Anker soundcore",name:"soundcore Space Q45",description:"سماعات رأس لاسلكية مع عزل ضوضاء",base:149.99},
  {id:123,category:"audio",icon:"🔊",brand:"Anker soundcore",name:"soundcore Boom 2",description:"سماعة Bluetooth محمولة بصوت قوي",base:129.99},
  {id:124,category:"audio",icon:"🔊",brand:"Anker soundcore",name:"soundcore Select 4 Go",description:"سماعة Bluetooth صغيرة ومحمولة",base:29.99},

  {id:125,category:"security",icon:"📷",brand:"eufy",name:"eufyCam S4",description:"كاميرا أمنية ذكية من منظومة eufy",base:299.99},
  {id:126,category:"security",icon:"📷",brand:"eufy",name:"eufy Indoor Cam E220",description:"كاميرا داخلية ذكية للمراقبة المنزلية",base:59.99},
  {id:127,category:"security",icon:"📷",brand:"eufy",name:"eufy SoloCam C210",description:"كاميرا أمنية لاسلكية للاستخدام الخارجي",base:79.99},
  {id:128,category:"security",icon:"🔔",brand:"eufy",name:"eufy Video Doorbell S330",description:"جرس باب فيديو ذكي بدقة عالية",base:199.99},
  {id:129,category:"security",icon:"📷",brand:"eufy",name:"eufy Indoor Cam S350",description:"كاميرا داخلية بدقة عالية وعدسة مزدوجة",base:129.99},
  {id:130,category:"security",icon:"🔦",brand:"eufy",name:"eufy Floodlight Cam E340",description:"كاميرا Floodlight للمراقبة الخارجية",base:199.99},

  {id:131,category:"smart-home",icon:"🤖",brand:"eufy",name:"eufy X10 Pro Omni",description:"روبوت تنظيف ذكي متكامل",base:799.99},
  {id:132,category:"smart-home",icon:"🤖",brand:"eufy",name:"eufy Omni C20",description:"روبوت تنظيف ذكي مع محطة متكاملة",base:599.99},
  {id:133,category:"smart-home",icon:"🔐",brand:"eufy",name:"eufy Smart Lock C220",description:"قفل ذكي للمنزل مع تحكم إلكتروني",base:119.99},
  {id:134,category:"smart-home",icon:"🔐",brand:"eufy",name:"eufy Smart Lock E30",description:"قفل ذكي حديث للأبواب",base:179.99},
  {id:135,category:"smart-home",icon:"🏠",brand:"eufy",name:"eufy HomeBase S380 HomeBase 3",description:"مركز إدارة أجهزة المنزل والأمان",base:139.99},
  {id:136,category:"smart-home",icon:"👶",brand:"eufy",name:"eufy Baby Monitor E110",description:"حل مراقبة ذكي للطفل والمنزل",base:99.99},

  {id:137,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Capsule 3 Laser",description:"جهاز عرض محمول بتقنية Laser",base:799.99},
  {id:138,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Capsule 3",description:"جهاز عرض محمول ذكي من Capsule",base:599.99},
  {id:139,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Mars 3 Air",description:"جهاز عرض محمول للمنزل والسفر",base:599.99},
  {id:140,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Mars 3",description:"جهاز عرض محمول عالي السطوع",base:1099.99},
  {id:141,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Cosmos 4K SE",description:"جهاز عرض منزلي بدقة 4K",base:1299.99},
  {id:142,category:"projector",icon:"📽️",brand:"Nebula",name:"Nebula Cosmos Laser 4K",description:"جهاز عرض منزلي Laser بدقة 4K",base:1599.99},

  {id:143,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX C1000 Gen 2",description:"محطة طاقة محمولة عالية السعة",base:1199.99},
  {id:144,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX C2000 Gen 2",description:"محطة طاقة محمولة عالية القدرة",base:1699.99},
  {id:145,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX F3800",description:"نظام طاقة منزلي محمول عالي القدرة",base:3999.99},
  {id:146,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX PS60 Portable Solar Panel",description:"لوح شمسي محمول للطاقة المتنقلة",base:149.99},
  {id:147,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX PS100 Portable Solar Panel",description:"لوح شمسي محمول بقدرة أعلى",base:249.99},
  {id:148,category:"solar",icon:"☀️",brand:"Anker SOLIX",name:"Anker SOLIX PS400 Portable Solar Panel",description:"لوح شمسي محمول عالي القدرة",base:999.99}
];

ankerCategoryAdditions.forEach(p => {
  p.oldPrice = Number(p.base.toFixed(2));
  p.price = Number((p.base * 0.70).toFixed(2));
  p.discount = 30;
  p.badge = "30% OFF";
  products.push(p);
});

const WHATSAPP = "963949951985";
const CART_KEY = "syriatech_cart";
let cart = [];
let isEnglish = false;
function $(selector){return document.querySelector(selector);}
function money(value){return "$"+Number(value).toFixed(2);}
function loadCart(){try{const saved=localStorage.getItem(CART_KEY);const parsed=saved?JSON.parse(saved):[];cart=Array.isArray(parsed)?parsed:[]}catch(e){cart=[];try{localStorage.removeItem(CART_KEY);}catch(_) {}}}
function saveCart(){try{localStorage.setItem(CART_KEY,JSON.stringify(cart));}catch(e){}}

function renderProducts(list, label){
  const grid=$("#productsGrid"); if(!grid)return;
  const items=Array.isArray(list)?list:products;
  const title=$("#productsTitle");
  if(title) title.textContent=label||"منتجات Anker ومجموعاتها";
  if(!items.length){grid.innerHTML='<div class="empty-state">لا توجد منتجات في هذا القسم.</div>';return;}
  grid.innerHTML=items.map(p=>'<article class="product"><span class="product-badge">'+(p.badge||"")+'</span><div class="product-image" role="img" aria-label="'+p.name+'">'+p.icon+'</div><div class="product-info"><small>'+p.brand+'</small><h3>'+p.name+'</h3><p>'+p.description+'</p><div class="product-bottom"><div>'+(p.oldPrice?'<del>'+money(p.oldPrice)+'</del>':'')+'<strong>'+money(p.price)+'</strong></div><button type="button" class="add-product" data-id="'+p.id+'">أضف للسلة</button></div></div></article>').join("");
  grid.querySelectorAll(".add-product").forEach(b=>b.addEventListener("click",()=>addToCart(Number(b.dataset.id))));
}
function filterProducts({category=null,brand=null}={}){
  let list=products;
  let label="منتجات Anker ومجموعاتها";
  if(category){list=products.filter(p=>p.category===category);const names={"power-bank":"Power Banks","audio":"Headphones & Audio","charger":"Chargers","accessories":"Accessories","security":"Security","smart-home":"Smart Home","projector":"Projectors","solar":"SOLIX Energy"};label=names[category]||"المنتجات";}
  if(brand){list=products.filter(p=>p.brand.toLowerCase()===brand.toLowerCase());label=brand+" — المنتجات";}
  renderProducts(list,label);
  const section=$("#products");if(section)section.scrollIntoView({behavior:"smooth",block:"start"});
}
function renderCart(){
  const items=$("#cartItems"),count=$("#cartCount"),total=$("#cartTotal");if(!items||!count||!total)return;
  count.textContent=String(cart.reduce((s,i)=>s+Number(i.qty||0),0));
  total.textContent=cart.reduce((s,i)=>s+Number(i.price||0)*Number(i.qty||0),0).toFixed(2);
  if(!cart.length){items.innerHTML='<div class="empty-state">السلة فارغة حالياً.</div>';return;}
  items.innerHTML=cart.map(i=>'<div class="cart-item"><div><strong>'+i.name+'</strong><div class="cart-controls"><button type="button" class="qty-minus" data-id="'+i.id+'">−</button><span>'+i.qty+'</span><button type="button" class="qty-plus" data-id="'+i.id+'">+</button></div></div><div class="cart-item-price"><strong>'+money(i.price*i.qty)+'</strong><button type="button" class="remove-item" data-id="'+i.id+'">حذف</button></div></div>').join("");
  items.querySelectorAll(".qty-minus").forEach(b=>b.addEventListener("click",()=>changeQty(Number(b.dataset.id),-1)));
  items.querySelectorAll(".qty-plus").forEach(b=>b.addEventListener("click",()=>changeQty(Number(b.dataset.id),1)));
  items.querySelectorAll(".remove-item").forEach(b=>b.addEventListener("click",()=>removeFromCart(Number(b.dataset.id))));
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const e=cart.find(x=>x.id===id);if(e)e.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();renderCart();openCart();}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function openCart(){$("#cart")?.classList.add("open");$("#overlay")?.classList.add("active");}
function closeCart(){$("#cart")?.classList.remove("open");$("#overlay")?.classList.remove("active");}
function searchProducts(){const q=($("#searchInput")?.value||"").trim().toLowerCase();const list=!q?products:products.filter(p=>[p.name,p.brand,p.description].some(v=>v.toLowerCase().includes(q)));renderProducts(list,q?"نتائج البحث":"منتجات Anker ومجموعاتها");$("#products")?.scrollIntoView({behavior:"smooth"});}
function changeLanguage(){isEnglish=!isEnglish;document.documentElement.lang=isEnglish?"en":"ar";document.documentElement.dir=isEnglish?"ltr":"rtl";const b=$("#languageButton");if(b)b.textContent=isEnglish?"AR":"EN";}
function checkoutWhatsApp(e){if(e)e.preventDefault();if(!cart.length){alert("السلة فارغة.");return;}const lines=cart.map(i=>"• "+i.name+" × "+i.qty+" = "+money(i.price*i.qty));const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const msg="مرحباً Syriatech، أريد طلب:\n\n"+lines.join("\n")+"\n\nالإجمالي: "+money(total);window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(msg),"_blank","noopener,noreferrer");}
function bindNavigation(){
  $("#languageButton")?.addEventListener("click",changeLanguage);
  $("#cartButton")?.addEventListener("click",openCart);
  $("#closeCartButton")?.addEventListener("click",closeCart);
  $("#overlay")?.addEventListener("click",closeCart);
  $("#searchButton")?.addEventListener("click",searchProducts);
  $("#searchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts();});
  $("#checkoutButton")?.addEventListener("click",checkoutWhatsApp);
  $("#clearFilterButton")?.addEventListener("click",()=>filterProducts());
  document.querySelectorAll("[data-category]").forEach(el=>el.addEventListener("click",()=>filterProducts({category:el.dataset.category})));
  document.querySelectorAll("[data-brand]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();filterProducts({brand:el.dataset.brand});}));
  document.querySelectorAll("[data-filter-all]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();filterProducts();}));
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
}
document.addEventListener("DOMContentLoaded",()=>{loadCart();bindNavigation();renderProducts(products);renderCart();});
