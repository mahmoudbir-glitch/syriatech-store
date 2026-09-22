/* Syriatech stability fixes — no backend required */
(function(){
  function esc(v){return String(v??"").replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[s]));}
  function fallbackSvg(p){
    const colors={"power-bank":"#0879e8",charger:"#0ea5e9",accessories:"#6366f1",audio:"#8b5cf6",security:"#ef4444","smart-home":"#10b981",projector:"#f59e0b",solar:"#eab308"};
    const c=colors[p.category]||"#0879e8";
    const icon=p.icon||"⚡";
    const label=(p.brand||"TECH")+" • "+(p.name||"Product");
    const svg='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e8f3ff"/></linearGradient></defs><rect width="900" height="700" rx="44" fill="url(#g)"/><circle cx="450" cy="270" r="150" fill="'+c+'" opacity=".12"/><rect x="275" y="120" width="350" height="300" rx="38" fill="#fff" stroke="'+c+'" stroke-width="5"/><text x="450" y="305" text-anchor="middle" font-size="100">'+icon+'</text><text x="450" y="490" text-anchor="middle" font-family="Arial" font-size="30" font-weight="700" fill="#07111f">'+esc(p.brand||"TECH")+'</text><text x="450" y="535" text-anchor="middle" font-family="Arial" font-size="20" fill="#526174">'+esc(label.slice(0,42))+'</text></svg>';
    return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  }
  const originalImagePath=window.productImagePath;
  window.productImagePath=function(p){
    try{
      const src=originalImagePath(p);
      if(src && p.id<=20) return src;
    }catch(_){}
    return fallbackSvg(p);
  };
  function bindImageFallbacks(){
    document.querySelectorAll(".product-image img,.quick-product-image img").forEach(img=>{
      if(img.dataset.stabilityBound) return;
      img.dataset.stabilityBound="1";
      img.addEventListener("error",function(){
        const name=this.alt||"Product";
        const p=(window.products||[]).find(x=>x.name===name);
        if(p){this.onerror=null;this.src=fallbackSvg(p);}
      },{once:true});
    });
  }
  const originalRender=window.renderProducts;
  if(typeof originalRender==="function"){
    window.renderProducts=function(list,label){
      originalRender(list,label);
      bindImageFallbacks();
    };
  }
  const originalQuick=window.openQuickView;
  if(typeof originalQuick==="function"){
    window.openQuickView=function(id){
      originalQuick(id);
      bindImageFallbacks();
    };
  }
  const style=document.createElement("style");
  style.textContent=
    "#overlay{position:fixed;inset:0;background:rgba(7,17,31,.48);z-index:40;opacity:0;visibility:hidden;transition:.2s}#overlay.active{opacity:1;visibility:visible}"+
    "@media(max-width:700px){.cart{width:min(420px,94vw)}.product-info h3{font-size:13px}.product-info p{min-height:0}.product-bottom strong{font-size:16px}.product-image{height:210px!important}.sidebar{margin-top:8px}}"+
    ".product-badge:empty{display:none}.quick-product-image img{width:100%;height:100%;display:block}"+
    ".brand-rail button,.category-card,.brand-list button,.side-filter{touch-action:manipulation}";
  document.head.appendChild(style);
  document.addEventListener("DOMContentLoaded",()=>setTimeout(bindImageFallbacks,0));
})();