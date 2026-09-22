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
const WHATSAPP="963949951985";
let cart=JSON.parse(localStorage.getItem("syriatech_cart")||"[]");
let isEnglish=false;
const $=s=>document.querySelector(s);
const money=v=>"$"+Number(v).toFixed(2);
function saveCart(){localStorage.setItem("syriatech_cart",JSON.stringify(cart));}
function renderProducts(list=products){const grid=$("#productsGrid");if(!grid)return;if(!list.length){grid.innerHTML="<div class=\"empty-state\">لا توجد منتجات مطابقة لبحثك.</div>";return;}grid.innerHTML=list.map(p=>"<article class=\"product\"><div class=\"product-image\">"+p.icon+"</div>"+(p.badge?"<span class=\"product-badge\">"+p.badge+"</span>":"")+"<div class=\"product-info\"><small>"+p.brand+"</small><h3>"+p.name+"</h3><p>"+p.description+"</p><div class=\"product-bottom\"><div>"+(p.oldPrice?"<del>"+money(p.oldPrice)+"</del>":"")+"<strong>"+money(p.price)+"</strong></div><button type=\"button\" onclick=\"addToCart("+p.id+")\">أضف للسلة</button></div></div></article>").join("");}
function renderCart(){const items=$("#cartItems"),count=$("#cartCount"),total=$("#cartTotal");if(!items||!count||!total)return;count.textContent=cart.reduce((s,i)=>s+i.qty,0);if(!cart.length){items.innerHTML="<div class=\"empty-state\">السلة فارغة حالياً.</div>";total.textContent="0.00";return;}items.innerHTML=cart.map(i=>"<div class=\"cart-item\"><div><strong>"+i.name+"</strong><div class=\"cart-controls\"><button type=\"button\" onclick=\"changeQty("+i.id+",-1)\">−</button><span>"+i.qty+"</span><button type=\"button\" onclick=\"changeQty("+i.id+",1)\">+</button></div></div><div class=\"cart-item-price\"><strong>"+money(i.price*i.qty)+"</strong><button type=\"button\" onclick=\"removeFromCart("+i.id+")\">حذف</button></div></div>").join("");total.textContent=cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;const e=cart.find(x=>x.id===id);if(e)e.qty++;else cart.push({id:p.id,name:p.name,price:p.price,qty:1});saveCart();renderCart();openCart();}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function removeFromCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
function openCart(){$("#cart")?.classList.add("open");$("#overlay")?.classList.add("active");}
function closeCart(){$("#cart")?.classList.remove("open");$("#overlay")?.classList.remove("active");}
function searchProducts(){const q=($("#searchInput")?.value||"").trim().toLowerCase();renderProducts(!q?products:products.filter(p=>[p.name,p.brand,p.description].some(v=>v.toLowerCase().includes(q))));$("#products")?.scrollIntoView({behavior:"smooth"});}
function changeLanguage(){isEnglish=!isEnglish;document.documentElement.lang=isEnglish?"en":"ar";document.documentElement.dir=isEnglish?"ltr":"rtl";const b=document.querySelector(".header-icons button");if(b)b.textContent=isEnglish?"AR":"EN";}
function checkoutWhatsApp(){if(!cart.length){alert("السلة فارغة.");return;}const lines=cart.map(i=>"• "+i.name+" × "+i.qty+" = "+money(i.price*i.qty));const total=cart.reduce((s,i)=>s+i.price*i.qty,0);const msg="مرحباً Syriatech، أريد طلب:\n\n"+lines.join("\n")+"\n\nالإجمالي: "+money(total);window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(msg),"_blank");}
document.addEventListener("DOMContentLoaded",()=>{renderProducts();renderCart();$("#searchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")searchProducts();});document.querySelector(".checkout-button")?.addEventListener("click",e=>{e.preventDefault();checkoutWhatsApp();});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});});
window.addToCart=addToCart;window.changeQty=changeQty;window.removeFromCart=removeFromCart;window.openCart=openCart;window.closeCart=closeCart;window.searchProducts=searchProducts;window.changeLanguage=changeLanguage;