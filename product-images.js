/*
 * SYRIATECH - PRODUCT IMAGE CONTROL
 * ==================================
 * غيّر الصور من هذا الملف فقط.
 *
 * 1) ارفع صور المنتجات داخل:
 *    assets/products/
 *
 * 2) سمِّ كل صورة برقم المنتج:
 *    1.webp
 *    2.webp
 *    3.webp
 *    ...
 *
 * 3) إذا أردت اسم ملف مختلف، غيّر القيمة أمام رقم المنتج مباشرة.
 *
 * الصيغ المفضلة: WEBP أو JPG أو PNG.
 * الأفضل للمتجر: WEBP، مقاس 1000x1000 تقريباً، خلفية شفافة إن أمكن.
 */

window.PRODUCT_IMAGES = {
  // Power Banks
  "1": "assets/products/1.webp",
  "2": "assets/products/2.webp",
  "3": "assets/products/3.webp",
  "4": "assets/products/4.webp",
  "5": "assets/products/5.webp",
  "6": "assets/products/6.webp",

  // Chargers
  "11": "assets/products/11.webp",
  "12": "assets/products/12.webp",
  "13": "assets/products/13.webp",
  "14": "assets/products/14.webp",
  "15": "assets/products/15.webp",
  "16": "assets/products/16.webp",

  // Wireless
  "21": "assets/products/21.webp",
  "22": "assets/products/22.webp",
  "23": "assets/products/23.webp",
  "24": "assets/products/24.webp",
  "25": "assets/products/25.webp",
  "26": "assets/products/26.webp",

  // Cables
  "31": "assets/products/31.webp",
  "32": "assets/products/32.webp",
  "33": "assets/products/33.webp",
  "34": "assets/products/34.webp",
  "35": "assets/products/35.webp",
  "36": "assets/products/36.webp",

  // Hubs & Docks
  "41": "assets/products/41.webp",
  "42": "assets/products/42.webp",
  "43": "assets/products/43.webp",
  "44": "assets/products/44.webp",
  "45": "assets/products/45.webp",
  "46": "assets/products/46.webp",

  // Power / Charging Stations
  "51": "assets/products/51.webp",
  "52": "assets/products/52.webp",
  "53": "assets/products/53.webp",
  "54": "assets/products/54.webp",
  "55": "assets/products/55.webp",
  "56": "assets/products/56.webp",

  // Car
  "61": "assets/products/61.webp",
  "62": "assets/products/62.webp",
  "63": "assets/products/63.webp",
  "64": "assets/products/64.webp",
  "65": "assets/products/65.webp",
  "66": "assets/products/66.webp",

  // Audio
  "71": "assets/products/71.webp",
  "72": "assets/products/72.webp",
  "73": "assets/products/73.webp",
  "74": "assets/products/74.webp",
  "75": "assets/products/75.webp",
  "76": "assets/products/76.webp",

  // Security
  "81": "assets/products/81.webp",
  "82": "assets/products/82.webp",
  "83": "assets/products/83.webp",
  "84": "assets/products/84.webp",
  "85": "assets/products/85.webp",
  "86": "assets/products/86.webp",

  // Smart Home
  "91": "assets/products/91.webp",
  "92": "assets/products/92.webp",
  "93": "assets/products/93.webp",
  "94": "assets/products/94.webp",
  "95": "assets/products/95.webp",
  "96": "assets/products/96.webp",

  // Projectors
  "101": "assets/products/101.webp",
  "102": "assets/products/102.webp",
  "103": "assets/products/103.webp",
  "104": "assets/products/104.webp",
  "105": "assets/products/105.webp",
  "106": "assets/products/106.webp",

  // Solar / Portable Energy
  "111": "assets/products/111.webp",
  "112": "assets/products/112.webp",
  "113": "assets/products/113.webp",
  "114": "assets/products/114.webp",
  "115": "assets/products/115.webp",
  "116": "assets/products/116.webp"
};

window.PRODUCT_IMAGE_FALLBACKS = {
  "power-bank": "assets/new-power.svg",
  "charger": "assets/new-charger.svg",
  "wireless": "assets/new-charger.svg",
  "cables": "assets/new-cables.svg",
  "hubs-docks": "assets/new-dock.svg",
  "power": "assets/new-charger.svg",
  "car": "assets/new-charger.svg",
  "audio": "assets/new-audio.svg",
  "security": "assets/new-security.svg",
  "smart-home": "assets/new-security.svg",
  "projector": "assets/new-projector.svg",
  "solar": "assets/new-solar.svg"
};

// Prevent endless broken-image loops.
window.PRODUCT_IMAGE_PLACEHOLDER = "assets/product-accessories.svg";
