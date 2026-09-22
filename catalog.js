/*
 * SYRIATECH — الكتالوج الأساسي للمتجر
 * ====================================
 * هذه هي المنتجات الافتراضية. لا حاجة لتعديل هذا الملف:
 * كل التعديلات (الأسعار، الأوصاف، الصور، الإضافة والحذف) تتم من لوحة التحكم /admin.html
 * وتُحفظ في Vercel Blob، وتُطبَّق فوق هذه القائمة تلقائياً.
 */
(function () {
  const categories = [
    { id: "power-bank", ar: "باور بانك", en: "Power Banks", art: "assets/new-power.svg", descAr: "باور بانك أصلي من {brand} للاستخدام اليومي والشحن السريع." },
    { id: "charger", ar: "الشواحن", en: "Chargers", art: "assets/new-charger.svg", descAr: "شاحن أصلي من {brand} للشحن السريع والآمن." },
    { id: "wireless", ar: "الشحن اللاسلكي", en: "Wireless Charging", art: "assets/new-charger.svg", descAr: "حل شحن لاسلكي أصلي من {brand} للأجهزة المتوافقة." },
    { id: "cables", ar: "الكابلات", en: "Cables", art: "assets/new-cables.svg", descAr: "كابل أصلي من {brand} للشحن ونقل البيانات." },
    { id: "hubs-docks", ar: "المحطات والموزعات", en: "Hubs & Docks", art: "assets/new-dock.svg", descAr: "محطة أو موزع أصلي من {brand} لتوسيع المنافذ والاتصال." },
    { id: "power", ar: "الطاقة ومحطات الشحن", en: "Power & Charging Stations", art: "assets/new-charger.svg", descAr: "حل طاقة وشحن أصلي من {brand} للمكتب والمنزل." },
    { id: "car", ar: "شحن السيارة", en: "Car Charging", art: "assets/new-charger.svg", descAr: "ملحق شحن أصلي من {brand} للسيارة." },
    { id: "audio", ar: "الصوتيات والسماعات", en: "Audio & Headphones", art: "assets/new-audio.svg", descAr: "منتج صوتي أصلي من {brand}." },
    { id: "security", ar: "الأمان", en: "Security", art: "assets/new-security.svg", descAr: "منتج أمان ذكي أصلي من {brand}." },
    { id: "smart-home", ar: "المنزل الذكي", en: "Smart Home", art: "assets/new-security.svg", descAr: "منتج منزل ذكي أصلي من {brand}." },
    { id: "projector", ar: "أجهزة العرض", en: "Projectors", art: "assets/new-projector.svg", descAr: "جهاز عرض أصلي من {brand}." },
    { id: "solar", ar: "الطاقة المتنقلة والشمسية", en: "Portable & Solar Power", art: "assets/new-solar.svg", descAr: "حل طاقة متنقلة أصلي من {brand} للمنزل والرحلات." }
  ];

  const brands = [
    { name: "Anker", ar: "طاقة • شحن • ملحقات", en: "Power • Charging • Accessories" },
    { name: "UGREEN", ar: "شواحن • كابلات • موزعات", en: "Chargers • Cables • Hubs" },
    { name: "Baseus", ar: "شحن • سيارة • ملحقات", en: "Charging • Car • Accessories" },
    { name: "soundcore", ar: "سماعات • أذن • مكبرات صوت", en: "Headphones • Earbuds • Speakers" },
    { name: "eufy", ar: "أمان • منزل ذكي", en: "Security • Smart Home" },
    { name: "Nebula", ar: "أجهزة عرض • سينما منزلية", en: "Projectors • Home Cinema" },
    { name: "Anker SOLIX", ar: "طاقة متنقلة • طاقة شمسية", en: "Portable Energy • Solar" },
    { name: "BLUETTI", ar: "محطات طاقة متنقلة", en: "Portable Power Stations" },
    { name: "EcoFlow", ar: "طاقة احتياطية للمنزل", en: "Home Backup Power" }
  ];

  const settings = { whatsapp: "963949951985", email: "info@syriatech.store" };

  const products = [
    // power-bank
    {id:1001,category:"power-bank",brand:"Anker",name:"Anker Prime Power Bank (27,650mAh, 250W)",description:"High-capacity portable power bank with high-speed charging",oldPrice:249.99,price:174.99},
    {id:1002,category:"power-bank",brand:"Anker",name:"Anker Prime Power Bank (20,000mAh, 200W)",description:"Premium high-output portable power bank",oldPrice:179.99,price:125.99},
    {id:1003,category:"power-bank",brand:"Anker",name:"Anker Nano Power Bank (10,000mAh, 45W)",description:"Compact fast-charging power bank",oldPrice:59.99,price:41.99},
    {id:1004,category:"power-bank",brand:"Anker",name:"Anker Zolo Power Bank (20,000mAh, 30W)",description:"20,000mAh portable charger for everyday use",oldPrice:54.99,price:38.49},
    {id:1005,category:"power-bank",brand:"Anker",name:"Anker MagGo Power Bank (10,000mAh, 35W)",description:"Magnetic portable battery with fast charging",oldPrice:69.99,price:48.99},
    {id:1006,category:"power-bank",brand:"Anker",name:"Anker PowerCore III Elite 25K 87W",description:"High-capacity laptop and phone power bank",oldPrice:119.99,price:83.99},
    {id:1,category:"power-bank",brand:"UGREEN",name:"UGREEN Nexode Power Bank 20000mAh",description:"High-capacity portable charger with fast USB-C charging",oldPrice:89.99,price:62.99},
    {id:2,category:"power-bank",brand:"UGREEN",name:"UGREEN 10000mAh Magnetic Power Bank",description:"Slim magnetic power bank for everyday charging",oldPrice:59.99,price:41.99},
    {id:3,category:"power-bank",brand:"Baseus",name:"Baseus Blade Power Bank 100W",description:"Ultra-slim laptop and phone power bank",oldPrice:99.99,price:69.99},
    {id:4,category:"power-bank",brand:"Baseus",name:"Baseus Airpow 20000mAh",description:"Portable high-capacity fast charger",oldPrice:49.99,price:34.99},
    {id:5,category:"power-bank",brand:"UGREEN",name:"UGREEN 5000mAh Mini Power Bank",description:"Compact pocket-sized power bank",oldPrice:39.99,price:27.99},
    {id:6,category:"power-bank",brand:"Baseus",name:"Baseus Magnetic Mini Power Bank",description:"Compact magnetic wireless battery",oldPrice:54.99,price:38.49},
    // charger
    {id:1011,category:"charger",brand:"Anker",name:"Anker Prime Charger (150W, 4 Ports)",description:"Desktop GaN charger for multiple devices",oldPrice:119.99,price:83.99},
    {id:1012,category:"charger",brand:"Anker",name:"Anker Prime Charger (100W, 3 Ports)",description:"100W multi-device GaN charger",oldPrice:79.99,price:55.99},
    {id:1013,category:"charger",brand:"Anker",name:"Anker Nano Charger (65W, 3 Ports)",description:"Compact 65W GaN charger",oldPrice:49.99,price:34.99},
    {id:1014,category:"charger",brand:"Anker",name:"Anker Nano Charger (30W, USB-C)",description:"Compact 30W fast wall charger",oldPrice:19.99,price:13.99},
    {id:1015,category:"charger",brand:"Anker",name:"Anker 747 Charger (GaNPrime 150W)",description:"High-power four-port GaN charger",oldPrice:109.99,price:76.99},
    {id:1016,category:"charger",brand:"Anker",name:"Anker 736 Charger (Nano II 100W)",description:"100W compact charger for laptops and phones",oldPrice:79.99,price:55.99},
    {id:11,category:"charger",brand:"UGREEN",name:"UGREEN Nexode 100W GaN Charger",description:"100W multi-port GaN charger for laptops and phones",oldPrice:89.99,price:62.99},
    {id:12,category:"charger",brand:"UGREEN",name:"UGREEN Nexode 65W GaN Charger",description:"Compact fast charger with USB-C ports",oldPrice:59.99,price:41.99},
    {id:13,category:"charger",brand:"Baseus",name:"Baseus GaN5 Pro 100W Charger",description:"High-output desktop wall charger",oldPrice:79.99,price:55.99},
    {id:14,category:"charger",brand:"UGREEN",name:"UGREEN 30W USB-C Charger",description:"Compact everyday fast charger",oldPrice:24.99,price:17.49},
    {id:15,category:"charger",brand:"Baseus",name:"Baseus 65W GaN Charger",description:"Portable laptop and phone charger",oldPrice:49.99,price:34.99},
    {id:16,category:"charger",brand:"UGREEN",name:"UGREEN 140W Desktop Charger",description:"High-power charging station for multiple devices",oldPrice:129.99,price:90.99},
    // wireless
    {id:1021,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charging Station (3-in-1)",description:"Magnetic charging station for phone, watch and earbuds",oldPrice:109.99,price:76.99},
    {id:1022,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charger Pad (Qi2)",description:"Qi2 magnetic wireless charging pad",oldPrice:39.99,price:27.99},
    {id:1023,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charging Station (2-in-1)",description:"Foldable two-device magnetic charger",oldPrice:79.99,price:55.99},
    {id:1024,category:"wireless",brand:"Anker",name:"Anker 622 Magnetic Battery (MagGo)",description:"Magnetic battery with built-in stand",oldPrice:49.99,price:34.99},
    {id:1025,category:"wireless",brand:"Anker",name:"Anker 321 MagGo Battery",description:"Compact magnetic wireless battery",oldPrice:39.99,price:27.99},
    {id:1026,category:"wireless",brand:"Anker",name:"Anker 313 Wireless Charger Stand",description:"Wireless charging stand for compatible phones",oldPrice:29.99,price:20.99},
    {id:21,category:"wireless",brand:"UGREEN",name:"UGREEN MagFlow Qi2 Charger",description:"Magnetic wireless charger with Qi2 support",oldPrice:49.99,price:34.99},
    {id:22,category:"wireless",brand:"Baseus",name:"Baseus MagPro Wireless Charger",description:"Magnetic fast wireless charging stand",oldPrice:59.99,price:41.99},
    {id:23,category:"wireless",brand:"UGREEN",name:"UGREEN 3-in-1 Wireless Charging Station",description:"Charging station for phone, watch and earbuds",oldPrice:99.99,price:69.99},
    {id:24,category:"wireless",brand:"Baseus",name:"Baseus 3-in-1 Foldable Charger",description:"Foldable multi-device wireless charger",oldPrice:89.99,price:62.99},
    {id:25,category:"wireless",brand:"UGREEN",name:"UGREEN Wireless Charging Stand",description:"Adjustable desktop wireless charger",oldPrice:39.99,price:27.99},
    {id:26,category:"wireless",brand:"Baseus",name:"Baseus Magnetic Charging Pad",description:"Slim magnetic charging pad",oldPrice:34.99,price:24.49},
    // cables
    {id:1031,category:"cables",brand:"Anker",name:"Anker Prime USB-C Cable (240W)",description:"Durable high-power braided USB-C cable",oldPrice:29.99,price:20.99},
    {id:1032,category:"cables",brand:"Anker",name:"Anker Prime USB-C to Lightning Cable",description:"Premium cable for Apple devices",oldPrice:29.99,price:20.99},
    {id:1033,category:"cables",brand:"Anker",name:"Anker 333 USB-C to USB-C Cable",description:"Long-lasting braided USB-C cable",oldPrice:15.99,price:11.19},
    {id:1034,category:"cables",brand:"Anker",name:"Anker 543 USB-C to USB-C Cable",description:"Bio-based braided charging cable",oldPrice:17.99,price:12.59},
    {id:1035,category:"cables",brand:"Anker",name:"Anker 765 USB-C to USB-C Cable",description:"High-speed 240W USB-C cable",oldPrice:29.99,price:20.99},
    {id:1036,category:"cables",brand:"Anker",name:"Anker 331 USB-C to Lightning Cable",description:"Reliable USB-C to Lightning cable",oldPrice:15.99,price:11.19},
    {id:31,category:"cables",brand:"UGREEN",name:"UGREEN USB-C 240W Braided Cable",description:"Premium high-power braided USB-C cable",oldPrice:24.99,price:17.49},
    {id:32,category:"cables",brand:"Baseus",name:"Baseus USB-C 100W Braided Cable",description:"Durable fast charging cable",oldPrice:19.99,price:13.99},
    {id:33,category:"cables",brand:"UGREEN",name:"UGREEN USB-C to Lightning Cable",description:"Fast charging and data cable",oldPrice:21.99,price:15.39},
    {id:34,category:"cables",brand:"Baseus",name:"Baseus USB-C to USB-C Cable",description:"High-speed charging and data cable",oldPrice:14.99,price:10.49},
    {id:35,category:"cables",brand:"UGREEN",name:"UGREEN Nylon USB-A to USB-C Cable",description:"Reinforced nylon charging cable",oldPrice:12.99,price:9.09},
    {id:36,category:"cables",brand:"Baseus",name:"Baseus DisplayPort 1.4 Cable",description:"High-resolution display cable",oldPrice:29.99,price:20.99},
    // hubs-docks
    {id:1041,category:"hubs-docks",brand:"Anker",name:"Anker Prime TB4 Docking Station",description:"Professional Thunderbolt docking station",oldPrice:299.99,price:209.99},
    {id:1042,category:"hubs-docks",brand:"Anker",name:"Anker 777 Thunderbolt Docking Station",description:"High-performance Thunderbolt dock",oldPrice:279.99,price:195.99},
    {id:1043,category:"hubs-docks",brand:"Anker",name:"Anker 778 Thunderbolt Docking Station",description:"Multi-display Thunderbolt dock",oldPrice:299.99,price:209.99},
    {id:1044,category:"hubs-docks",brand:"Anker",name:"Anker 565 USB-C Hub",description:"11-in-1 USB-C connectivity hub",oldPrice:89.99,price:62.99},
    {id:1045,category:"hubs-docks",brand:"Anker",name:"Anker 556 USB-C Hub",description:"8-in-1 USB-C hub",oldPrice:69.99,price:48.99},
    {id:1046,category:"hubs-docks",brand:"Anker",name:"Anker 332 USB-C Hub",description:"Compact 5-in-1 USB-C hub",oldPrice:39.99,price:27.99},
    {id:41,category:"hubs-docks",brand:"UGREEN",name:"UGREEN Revodok Pro 13-in-1 Hub",description:"Professional USB-C hub with multiple display and data ports",oldPrice:149.99,price:104.99},
    {id:42,category:"hubs-docks",brand:"Baseus",name:"Baseus Metal Gleam 9-in-1 Hub",description:"Premium aluminum USB-C hub",oldPrice:89.99,price:62.99},
    {id:43,category:"hubs-docks",brand:"UGREEN",name:"UGREEN 6-in-1 USB-C Hub",description:"Compact connectivity hub",oldPrice:59.99,price:41.99},
    {id:44,category:"hubs-docks",brand:"Baseus",name:"Baseus 8-in-1 USB-C Dock",description:"Multi-port laptop docking solution",oldPrice:79.99,price:55.99},
    {id:45,category:"hubs-docks",brand:"UGREEN",name:"UGREEN 9-in-1 Docking Station",description:"Desktop connectivity station",oldPrice:109.99,price:76.99},
    {id:46,category:"hubs-docks",brand:"Baseus",name:"Baseus 6-in-1 Metal Hub",description:"Compact aluminum multi-port hub",oldPrice:54.99,price:38.49},
    // power
    {id:1051,category:"power",brand:"Anker",name:"Anker Prime Charging Station (6 Ports)",description:"Desktop charging station for multiple devices",oldPrice:89.99,price:62.99},
    {id:1052,category:"power",brand:"Anker",name:"Anker Charging Station (GaNPrime 100W)",description:"Desktop charging solution with fast USB-C ports",oldPrice:99.99,price:69.99},
    {id:1053,category:"power",brand:"Anker",name:"Anker 525 Charging Station",description:"Multi-device desktop charging station",oldPrice:59.99,price:41.99},
    {id:1054,category:"power",brand:"Anker",name:"Anker 521 Power Strip",description:"Compact power strip with USB charging",oldPrice:39.99,price:27.99},
    {id:1055,category:"power",brand:"Anker",name:"Anker 727 Charging Station",description:"Ultra-slim desktop charging station",oldPrice:109.99,price:76.99},
    {id:1056,category:"power",brand:"Anker",name:"Anker Nano Charging Station",description:"Compact multi-port charging station",oldPrice:69.99,price:48.99},
    {id:51,category:"power",brand:"UGREEN",name:"UGREEN Desktop Charging Station",description:"Multi-device desktop charging solution",oldPrice:89.99,price:62.99},
    {id:52,category:"power",brand:"Baseus",name:"Baseus PowerCombo Station",description:"Compact desktop power and charging station",oldPrice:69.99,price:48.99},
    {id:53,category:"power",brand:"UGREEN",name:"UGREEN 100W Charging Station",description:"High-speed multi-port desktop charger",oldPrice:99.99,price:69.99},
    {id:54,category:"power",brand:"Baseus",name:"Baseus 65W Desktop Charger",description:"Compact multi-device charging station",oldPrice:64.99,price:45.49},
    {id:55,category:"power",brand:"UGREEN",name:"UGREEN Power Strip with USB-C",description:"Modern power strip with fast USB charging",oldPrice:59.99,price:41.99},
    {id:56,category:"power",brand:"Baseus",name:"Baseus Power Strip",description:"Desktop power and charging strip",oldPrice:49.99,price:34.99},
    // car
    {id:1061,category:"car",brand:"Anker",name:"Anker MagGo Wireless Car Charger",description:"Magnetic wireless charging mount for cars",oldPrice:69.99,price:48.99},
    {id:1062,category:"car",brand:"Anker",name:"Anker 323 Car Charger",description:"Dual-port fast car charger",oldPrice:19.99,price:13.99},
    {id:1063,category:"car",brand:"Anker",name:"Anker 535 Car Charger",description:"High-output multi-port car charger",oldPrice:39.99,price:27.99},
    {id:1064,category:"car",brand:"Anker",name:"Anker 40W USB-C Car Charger",description:"Dual USB-C car charging adapter",oldPrice:29.99,price:20.99},
    {id:1065,category:"car",brand:"Anker",name:"Anker PowerDrive III Duo",description:"Compact dual-port car charger",oldPrice:29.99,price:20.99},
    {id:1066,category:"car",brand:"Anker",name:"Anker Roav SmartCharge Bluetooth FM Transmitter",description:"Bluetooth car audio and charging accessory",oldPrice:39.99,price:27.99},
    {id:61,category:"car",brand:"UGREEN",name:"UGREEN 69W Car Charger",description:"Fast dual-port USB-C car charger",oldPrice:34.99,price:24.49},
    {id:62,category:"car",brand:"Baseus",name:"Baseus 65W Car Charger",description:"High-power multi-port car charger",oldPrice:39.99,price:27.99},
    {id:63,category:"car",brand:"UGREEN",name:"UGREEN Magnetic Car Mount",description:"Magnetic phone mount for vehicles",oldPrice:29.99,price:20.99},
    {id:64,category:"car",brand:"Baseus",name:"Baseus Wireless Car Charger Mount",description:"Wireless charging car holder",oldPrice:59.99,price:41.99},
    {id:65,category:"car",brand:"UGREEN",name:"UGREEN USB-C Car Charger",description:"Compact fast car charger",oldPrice:24.99,price:17.49},
    {id:66,category:"car",brand:"Baseus",name:"Baseus Bluetooth FM Transmitter",description:"Bluetooth audio adapter for cars",oldPrice:29.99,price:20.99},
    // audio
    {id:71,category:"audio",brand:"soundcore",name:"soundcore Liberty 5",description:"True wireless earbuds with active noise cancellation",oldPrice:129.99,price:90.99},
    {id:72,category:"audio",brand:"soundcore",name:"soundcore Space Q45",description:"Wireless headphones with adaptive noise cancellation",oldPrice:149.99,price:104.99},
    {id:73,category:"audio",brand:"soundcore",name:"soundcore Boom 2",description:"Portable Bluetooth speaker",oldPrice:129.99,price:90.99},
    {id:74,category:"audio",brand:"soundcore",name:"soundcore Q20i",description:"Wireless headphones with hybrid ANC",oldPrice:69.99,price:48.99},
    {id:75,category:"audio",brand:"soundcore",name:"soundcore Motion X600",description:"Premium portable spatial audio speaker",oldPrice:199.99,price:139.99},
    {id:76,category:"audio",brand:"soundcore",name:"soundcore AeroFit 2",description:"Open-ear wireless headphones",oldPrice:129.99,price:90.99},
    // security
    {id:81,category:"security",brand:"eufy",name:"eufyCam S330 4K",description:"4K wireless home security camera",oldPrice:349.99,price:244.99},
    {id:82,category:"security",brand:"eufy",name:"eufy SoloCam S340",description:"Dual-camera wireless security system",oldPrice:129.99,price:90.99},
    {id:83,category:"security",brand:"eufy",name:"eufy Indoor Cam S350",description:"High-resolution indoor security camera",oldPrice:129.99,price:90.99},
    {id:84,category:"security",brand:"eufy",name:"eufy Video Doorbell E340",description:"Dual-camera smart video doorbell",oldPrice:179.99,price:125.99},
    {id:85,category:"security",brand:"eufy",name:"eufy Floodlight Cam E340",description:"Outdoor floodlight security camera",oldPrice:199.99,price:139.99},
    {id:86,category:"security",brand:"eufy",name:"eufy HomeBase S380",description:"Smart security central hub",oldPrice:139.99,price:97.99},
    // smart-home
    {id:91,category:"smart-home",brand:"eufy",name:"eufy X10 Pro Omni",description:"Robot vacuum and mop with smart station",oldPrice:799.99,price:559.99},
    {id:92,category:"smart-home",brand:"eufy",name:"eufy Omni C20",description:"All-in-one robot vacuum and mop",oldPrice:599.99,price:419.99},
    {id:93,category:"smart-home",brand:"eufy",name:"eufy Smart Lock C220",description:"Keypad smart door lock",oldPrice:119.99,price:83.99},
    {id:94,category:"smart-home",brand:"eufy",name:"eufy Smart Lock E30",description:"Modern smart access control",oldPrice:179.99,price:125.99},
    {id:95,category:"smart-home",brand:"eufy",name:"eufy Baby Monitor E110",description:"Smart baby monitoring system",oldPrice:99.99,price:69.99},
    {id:96,category:"smart-home",brand:"eufy",name:"eufy Smart Scale P2 Pro",description:"Smart connected body scale",oldPrice:69.99,price:48.99},
    // projector
    {id:101,category:"projector",brand:"Nebula",name:"Nebula Capsule 3 Laser",description:"Portable laser smart projector",oldPrice:799.99,price:559.99},
    {id:102,category:"projector",brand:"Nebula",name:"Nebula Mars 3 Air",description:"Portable Full HD smart projector",oldPrice:599.99,price:419.99},
    {id:103,category:"projector",brand:"Nebula",name:"Nebula Cosmos 4K SE",description:"4K home cinema projector",oldPrice:1299.99,price:909.99},
    {id:104,category:"projector",brand:"Nebula",name:"Nebula Capsule Air",description:"Ultra-portable smart projector",oldPrice:399.99,price:279.99},
    {id:105,category:"projector",brand:"Nebula",name:"Nebula Mars 3",description:"Outdoor portable cinema projector",oldPrice:1099.99,price:769.99},
    {id:106,category:"projector",brand:"Nebula",name:"Nebula Cosmos Laser 4K",description:"Premium laser home cinema projector",oldPrice:1599.99,price:1119.99},
    // solar
    {id:1111,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C800",description:"Portable power station for home and travel",oldPrice:799.99,price:559.99},
    {id:1112,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C1000",description:"High-capacity portable power station",oldPrice:999.99,price:699.99},
    {id:1113,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C1000 Gen 2",description:"Next-generation portable power station",oldPrice:1199.99,price:839.99},
    {id:1114,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C2000 Gen 2",description:"Large-capacity home backup power station",oldPrice:1699.99,price:1189.99},
    {id:1115,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX F3800",description:"Expandable home energy storage system",oldPrice:3999.99,price:2799.99},
    {id:1116,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX PS100 Portable Solar Panel",description:"Portable solar charging panel",oldPrice:249.99,price:174.99},
    {id:111,category:"solar",brand:"UGREEN",name:"UGREEN PowerRoam 1200",description:"Portable power station for home and travel",oldPrice:899.99,price:629.99},
    {id:112,category:"solar",brand:"UGREEN",name:"UGREEN PowerRoam 600",description:"Compact portable power station",oldPrice:499.99,price:349.99},
    {id:113,category:"solar",brand:"BLUETTI",name:"BLUETTI AC70P",description:"Portable solar power station",oldPrice:699.99,price:489.99},
    {id:114,category:"solar",brand:"BLUETTI",name:"BLUETTI AC180",description:"High-capacity portable power station",oldPrice:999.99,price:699.99},
    {id:115,category:"solar",brand:"EcoFlow",name:"EcoFlow RIVER 2 Pro",description:"Portable backup power station",oldPrice:749.99,price:524.99},
    {id:116,category:"solar",brand:"EcoFlow",name:"EcoFlow DELTA 2",description:"Expandable home backup power station",oldPrice:999.99,price:699.99}
  ];

  const PLACEHOLDER = "assets/product-accessories.svg";
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function round2(value) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : 0;
  }

  function normalize(p, flags) {
    const price = round2(p.price);
    const old = round2(p.oldPrice);
    const oldPrice = old > price ? old : price;
    return {
      ...p,
      ...flags,
      id: Number(p.id),
      name: String(p.name || ""),
      brand: String(p.brand || ""),
      category: String(p.category || ""),
      description: String(p.description || ""),
      descriptionAr: String(p.descriptionAr || ""),
      badge: String(p.badge || ""),
      image: String(p.image || ""),
      price,
      oldPrice,
      discount: oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : 0
    };
  }

  // Applies the admin changes saved in Vercel Blob on top of the default catalog.
  // Newest admin-added products come first, then the default catalog order.
  function merge(state) {
    const s = state || {};
    const overrides = s.overrides && typeof s.overrides === "object" ? s.overrides : {};
    const deleted = new Set((Array.isArray(s.deleted) ? s.deleted : []).map(Number));
    const builtIn = new Set(products.map(p => p.id));

    const added = new Map();
    (Array.isArray(s.additions) ? s.additions : []).forEach(p => { if (p && p.id) added.set(Number(p.id), p); });
    // Older admin versions saved edits of added products as overrides; the override is the newer copy.
    Object.values(overrides).forEach(o => {
      const id = Number(o && o.id);
      if (id && !builtIn.has(id)) added.set(id, { ...(added.get(id) || {}), ...o });
    });

    const additions = [...added.values()]
      .filter(p => !deleted.has(Number(p.id)) && p.name)
      .sort((a, b) => Number(b.id) - Number(a.id))
      .map(p => normalize(p, { added: true }));

    const base = products
      .filter(p => !deleted.has(p.id))
      .map(p => {
        const o = overrides[String(p.id)];
        return o ? normalize({ ...p, ...o, id: p.id }, { edited: true }) : normalize(p);
      });

    return additions.concat(base);
  }

  // Products hidden from the store (restorable from the admin page).
  function deletedProducts(state) {
    const s = state || {};
    const deleted = new Set((Array.isArray(s.deleted) ? s.deleted : []).map(Number));
    const overrides = s.overrides || {};
    const found = new Map();
    products.forEach(p => { if (deleted.has(p.id)) found.set(p.id, { ...p, ...(overrides[String(p.id)] || {}), id: p.id }); });
    (Array.isArray(s.additions) ? s.additions : []).forEach(p => {
      const id = Number(p && p.id);
      if (deleted.has(id)) found.set(id, { ...p, ...(overrides[String(id)] || {}), id });
    });
    return [...found.values()].map(p => normalize(p));
  }

  function mergeSettings(state) {
    const saved = (state && state.settings) || {};
    return {
      whatsapp: String(saved.whatsapp || "").replace(/\D/g, "") || settings.whatsapp,
      email: typeof saved.email === "string" ? saved.email : settings.email
    };
  }

  function fallbackFor(p) {
    const c = categoryMap[p && p.category];
    return (c && c.art) || PLACEHOLDER;
  }

  function imageFor(p) {
    if (p && typeof p.image === "string" && p.image.trim()) return p.image.trim();
    const custom = window.PRODUCT_IMAGES && window.PRODUCT_IMAGES[String(p && p.id)];
    if (custom) return custom;
    const art = typeof window.STORE_ARTWORK === "function" ? window.STORE_ARTWORK(p) : "";
    return art || fallbackFor(p);
  }

  function descFor(p, lang) {
    if (lang === "en") return p.description || p.descriptionAr || "";
    if (p.descriptionAr) return p.descriptionAr;
    // Text the admin typed wins over the generic line — older admin versions
    // stored it in the single "description" field, often in Arabic.
    if ((p.added || p.edited) && p.description) return p.description;
    if (/[\u0600-\u06FF]/.test(p.description || "")) return p.description;
    const c = categoryMap[p.category];
    return c ? c.descAr.replace("{brand}", p.brand || "") : p.description || "";
  }

  function categoryLabel(id, lang) {
    const c = categoryMap[id];
    return c ? c[lang === "en" ? "en" : "ar"] : String(id || "");
  }

  // Broken image → category artwork → generic placeholder (never loops).
  window.storeImageFallback = function (img) {
    const next = img.dataset.fallback;
    img.dataset.fallback = "";
    if (next && img.getAttribute("src") !== next) { img.src = next; return; }
    img.onerror = null;
    if (img.getAttribute("src") !== PLACEHOLDER) img.src = PLACEHOLDER;
  };

  window.STORE = { categories, brands, products, settings, PLACEHOLDER, esc, merge, deletedProducts, mergeSettings, imageFor, fallbackFor, descFor, categoryLabel };
})();
