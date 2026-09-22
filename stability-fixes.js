/* Syriatech stability fixes — frontend only */
(function(){
  const style=document.createElement("style");
  style.textContent=
    "#overlay{position:fixed;inset:0;background:rgba(7,17,31,.48);z-index:40;opacity:0;visibility:hidden;transition:.2s}#overlay.active{opacity:1;visibility:visible}"+
    "@media(max-width:700px){.cart{width:min(420px,94vw)}.product-info h3{font-size:13px}.product-info p{min-height:0}.product-bottom strong{font-size:16px}.product-image{height:210px!important}.sidebar{margin-top:8px}}"+
    ".product-badge:empty{display:none}.quick-product-image img{width:100%;height:100%;display:block;object-fit:contain}"+
    ".brand-rail button,.category-card,.brand-list button,.side-filter{touch-action:manipulation}";
  document.head.appendChild(style);
})();