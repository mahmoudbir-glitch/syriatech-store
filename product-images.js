/*
 * SYRIATECH - AUTOMATIC PRODUCT ARTWORK
 * كل منتج يحصل على صورة مختلفة تلقائياً حسب رقم المنتج ونوعه.
 * لا تحتاج إلى تعديل script.js.
 */
(function(){
  const items = {
    1:["UGREEN","Nexode Power Bank 20000mAh"],2:["UGREEN","Magnetic Power Bank 10000mAh"],3:["Baseus","Blade Power Bank 100W"],4:["Baseus","Airpow 20000mAh"],5:["UGREEN","Mini Power Bank 5000mAh"],6:["Baseus","Magnetic Mini Power Bank"],
    11:["UGREEN","Nexode 100W GaN Charger"],12:["UGREEN","Nexode 65W GaN Charger"],13:["Baseus","GaN5 Pro 100W Charger"],14:["UGREEN","30W USB-C Charger"],15:["Baseus","65W GaN Charger"],16:["UGREEN","140W Desktop Charger"],
    21:["UGREEN","MagFlow Qi2 Charger"],22:["Baseus","MagPro Wireless Charger"],23:["UGREEN","3-in-1 Wireless Station"],24:["Baseus","3-in-1 Foldable Charger"],25:["UGREEN","Wireless Charging Stand"],26:["Baseus","Magnetic Charging Pad"],
    31:["UGREEN","USB-C 240W Braided Cable"],32:["Baseus","USB-C 100W Braided Cable"],33:["UGREEN","USB-C to Lightning Cable"],34:["Baseus","USB-C to USB-C Cable"],35:["UGREEN","Nylon USB-A to USB-C"],36:["Baseus","DisplayPort 1.4 Cable"],
    41:["UGREEN","Revodok Pro 13-in-1 Hub"],42:["Baseus","Metal Gleam 9-in-1 Hub"],43:["UGREEN","6-in-1 USB-C Hub"],44:["Baseus","8-in-1 USB-C Dock"],45:["UGREEN","9-in-1 Docking Station"],46:["Baseus","6-in-1 Metal Hub"],
    51:["UGREEN","Desktop Charging Station"],52:["Baseus","PowerCombo Station"],53:["UGREEN","100W Charging Station"],54:["Baseus","65W Desktop Charger"],55:["UGREEN","Power Strip USB-C"],56:["Baseus","Power Strip"],
    61:["UGREEN","69W Car Charger"],62:["Baseus","65W Car Charger"],63:["UGREEN","Magnetic Car Mount"],64:["Baseus","Wireless Car Charger Mount"],65:["UGREEN","USB-C Car Charger"],66:["Baseus","Bluetooth FM Transmitter"],
    71:["soundcore","Liberty 5"],72:["soundcore","Space Q45"],73:["soundcore","Boom 2"],74:["soundcore","Q20i"],75:["soundcore","Motion X600"],76:["soundcore","AeroFit 2"],
    81:["eufy","eufyCam S330 4K"],82:["eufy","SoloCam S340"],83:["eufy","Indoor Cam S350"],84:["eufy","Video Doorbell E340"],85:["eufy","Floodlight Cam E340"],86:["eufy","HomeBase S380"],
    91:["eufy","X10 Pro Omni"],92:["eufy","Omni C20"],93:["eufy","Smart Lock C220"],94:["eufy","Smart Lock E30"],95:["eufy","Baby Monitor E110"],96:["eufy","Smart Scale P2 Pro"],
    101:["Nebula","Capsule 3 Laser"],102:["Nebula","Mars 3 Air"],103:["Nebula","Cosmos 4K SE"],104:["Nebula","Capsule Air"],105:["Nebula","Mars 3"],106:["Nebula","Cosmos Laser 4K"],
    111:["UGREEN","PowerRoam 1200"],112:["UGREEN","PowerRoam 600"],113:["BLUETTI","AC70P"],114:["BLUETTI","AC180"],115:["EcoFlow","RIVER 2 Pro"],116:["EcoFlow","DELTA 2"]
  };
  const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const data={};
  Object.keys(items).forEach(k=>{
    const id=Number(k), brand=items[k][0], name=items[k][1], hue=(id*41)%360;
    const type=id>=70&&id<80?"audio":id>=80&&id<100?"security":id>=100&&id<110?"projector":id>=110?"energy":id%10<3?"power":"tech";
    let shape;
    if(type==="audio") shape='<rect x="180" y="245" width="340" height="210" rx="72"/><circle cx="225" cy="350" r="58"/><circle cx="475" cy="350" r="58"/>';
    else if(type==="security") shape='<rect x="190" y="215" width="320" height="290" rx="65"/><circle cx="350" cy="355" r="78"/><circle cx="350" cy="355" r="34"/>';
    else if(type==="projector") shape='<rect x="155" y="245" width="390" height="225" rx="52"/><circle cx="350" cy="355" r="76"/><circle cx="350" cy="355" r="38"/>';
    else if(type==="energy") shape='<rect x="145" y="245" width="410" height="230" rx="35"/><rect x="555" y="315" width="24" height="90" rx="10"/><path d="M315 280l-60 90h72l-42 90 110-120h-75z"/>';
    else if(type==="power") shape='<rect x="195" y="165" width="310" height="365" rx="48"/><rect x="250" y="215" width="200" height="72" rx="18"/><circle cx="350" cy="410" r="62"/>';
    else shape='<rect x="165" y="235" width="370" height="245" rx="45"/><rect x="235" y="295" width="230" height="80" rx="18"/>';
    const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="hsl('+hue+',85%,62%)"/><stop offset="1" stop-color="hsl('+((hue+75)%360)+',85%,45%)"/></linearGradient></defs><rect width="700" height="700" rx="52" fill="#f7f5f0"/><circle cx="570" cy="125" r="155" fill="url(#g)" opacity=".13"/><circle cx="110" cy="585" r="190" fill="url(#g)" opacity=".09"/><g fill="url(#g)" stroke="#111827" stroke-width="10">'+shape+'</g><text x="350" y="82" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#111827">'+esc(brand)+'</text><text x="350" y="610" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" fill="#374151">'+esc(name)+'</text><text x="350" y="650" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" letter-spacing="4" fill="#6b7280">SYRIATECH • '+id+'</text></svg>';
    data[k]="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  });
  window.PRODUCT_IMAGES=data;
  window.PRODUCT_IMAGE_FALLBACKS={"power-bank":"assets/new-power.svg","charger":"assets/new-charger.svg","wireless":"assets/new-charger.svg","cables":"assets/new-cables.svg","hubs-docks":"assets/new-dock.svg","power":"assets/new-charger.svg","car":"assets/new-charger.svg","audio":"assets/new-audio.svg","security":"assets/new-security.svg","smart-home":"assets/new-security.svg","projector":"assets/new-projector.svg","solar":"assets/new-solar.svg"};
  window.PRODUCT_IMAGE_PLACEHOLDER="assets/product-accessories.svg";
})();