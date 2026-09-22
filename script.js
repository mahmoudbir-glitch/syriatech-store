const products = [
{id:1,category:"power-bank",brand:"Anker",name:"Anker Prime Power Bank (26K, 300W)",description:"26,000mAh power bank with up to 300W output",oldPrice:229.99,price:199.99,badge:"New"},
{id:2,category:"power-bank",brand:"Anker",name:"Anker Prime 20,000mAh Power Bank (200W)",description:"High-power 20,000mAh portable charger",oldPrice:179.99,price:147.99,badge:"New"},
{id:3,category:"power-bank",brand:"Anker",name:"Anker Laptop Power Bank (25K, 165W)",description:"25,000mAh with built-in retractable cables",oldPrice:119.99,price:104.99,badge:"Hot"},
{id:4,category:"power-bank",brand:"Anker",name:"Anker MagGo Power Bank (10K, Slim)",description:"Slim magnetic 10,000mAh power bank",oldPrice:89.99,price:79.99,badge:"Hot"},
{id:5,category:"power-bank",brand:"Anker",name:"Anker Nano Power Bank (5K, MagGo, Slim)",description:"Compact 5,000mAh magnetic power bank",oldPrice:54.99,price:54.99,badge:"New"},
{id:6,category:"power-bank",brand:"Anker",name:"Anker 737 Power Bank (PowerCore 24K)",description:"24,000mAh high-output power bank",oldPrice:109.99,price:109.99,badge:""},
{id:7,category:"power-bank",brand:"Anker",name:"Anker 633 Magnetic Battery",description:"Magnetic battery pack",oldPrice:59.99,price:59.99,badge:""},
{id:8,category:"power-bank",brand:"Anker",name:"Anker Nano Power Bank (30W, Built-In USB-C Cable)",description:"30W power bank with built-in USB-C cable",oldPrice:54.99,price:54.99,badge:"New"},
{id:9,category:"power-bank",brand:"Anker",name:"Anker Nano Power Bank (22.5W, Built-In USB-C Connector)",description:"Compact power bank with built-in USB-C connector",oldPrice:26.99,price:26.99,badge:""},
{id:10,category:"power-bank",brand:"Anker",name:"Anker Power Bank (10K, Fusion, Built-In Cable)",description:"10,000mAh hybrid charger and power bank",oldPrice:52.99,price:52.99,badge:""},
{id:11,category:"charger",brand:"Anker",name:"Anker Prime Charger (250W, 6 Ports, GaNPrime)",description:"250W desktop GaN charger",oldPrice:149.99,price:149.99,badge:"Hot"},
{id:12,category:"charger",brand:"Anker",name:"Anker Prime Charger (200W, 6 Ports, GaN)",description:"200W multi-port GaN charger",oldPrice:69.99,price:69.99,badge:"Hot"},
{id:13,category:"charger",brand:"Anker",name:"Anker Prime Charger (160W, 3 Ports, Smart Display)",description:"160W charger with smart display",oldPrice:149.99,price:115.99,badge:"New"},
{id:14,category:"charger",brand:"Anker",name:"Anker Prime Charger (100W, 3 Ports, GaN)",description:"100W three-port GaN charger",oldPrice:69.99,price:47.99,badge:"Hot"},
{id:15,category:"charger",brand:"Anker",name:"Anker Nano Charger (70W, 3 Ports)",description:"Compact 70W three-port charger",oldPrice:39.99,price:39.99,badge:"New"},
{id:16,category:"charger",brand:"Anker",name:"Anker Nano Charger (45W, Smart Display, 180° Foldable)",description:"45W foldable smart-display charger",oldPrice:39.99,price:29.99,badge:"New"},
{id:17,category:"charger",brand:"Anker",name:"Anker Nano Charger (35W, Built-In Retractable USB-C Cable)",description:"35W compact charger",oldPrice:29.99,price:29.99,badge:"New"},
{id:18,category:"charger",brand:"Anker",name:"Anker Nano Charger (30W)",description:"Compact 30W USB-C charger",oldPrice:15.99,price:15.99,badge:"Hot"},
{id:19,category:"charger",brand:"Anker",name:"Anker Charger (140W, 4-Port, PD 3.1)",description:"140W four-port PD 3.1 charger",oldPrice:89.99,price:79.99,badge:"New"},
{id:20,category:"charger",brand:"Anker",name:"Anker 735 Charger (Nano II 65W)",description:"65W compact GaN charger",oldPrice:29.99,price:29.99,badge:""},
{id:21,category:"charger",brand:"Anker",name:"Anker 715 Charger (Nano II 65W)",description:"Compact 65W wall charger",oldPrice:29.99,price:29.99,badge:""},
{id:22,category:"charger",brand:"Anker",name:"Anker Nano Travel Adapter (5-in-1, 20W)",description:"Compact 5-in-1 travel adapter",oldPrice:25.99,price:25.99,badge:""},
{id:23,category:"wireless",brand:"Anker",name:"Anker Prime Wireless Charging Station (3-in-1, MagGo)",description:"Foldable 3-in-1 wireless charging station",oldPrice:149.99,price:119.99,badge:"New"},
{id:24,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charging Station (Foldable 3-in-1)",description:"Foldable 3-in-1 MagGo station",oldPrice:109.99,price:79.98,badge:"Hot"},
{id:25,category:"wireless",brand:"Anker",name:"Anker 3-in-1 Cube with Qi2",description:"Qi2 charging cube for multiple devices",oldPrice:109.99,price:109.99,badge:""},
{id:26,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charger (2-in-1)",description:"2-in-1 magnetic wireless charger",oldPrice:69.99,price:51.99,badge:""},
{id:27,category:"wireless",brand:"Anker",name:"Anker MagGo Stand (Qi2 15W)",description:"Qi2 15W magnetic charging stand",oldPrice:45.99,price:41.99,badge:"New"},
{id:28,category:"wireless",brand:"Anker",name:"Anker 313 Wireless Charger (Pad)",description:"Wireless charging pad",oldPrice:23.99,price:18.99,badge:""},
{id:29,category:"cables",brand:"Anker",name:"Anker Prime USB-C to USB-C Cable (240W, Upcycled-Braided)",description:"Premium 240W braided USB-C cable",oldPrice:29.99,price:22.49,badge:"Hot"},
{id:30,category:"cables",brand:"Anker",name:"Anker USB-C to USB-C Cable (240W, Upcycled-Braided)",description:"240W USB-C charging cable",oldPrice:19.99,price:19.99,badge:""},
{id:31,category:"cables",brand:"Anker",name:"Anker Prime Thunderbolt 5 Cable (80Gbps, 240W)",description:"Thunderbolt 5 high-speed cable",oldPrice:45.99,price:37.99,badge:"New"},
{id:32,category:"cables",brand:"Anker",name:"Anker 643 USB-C to USB-C Cable (Flow, Silicone)",description:"Flexible silicone USB-C cable",oldPrice:13.99,price:13.99,badge:""},
{id:33,category:"cables",brand:"Anker",name:"Anker USB-A to USB-C Cable (Upcycled-Braided)",description:"Durable braided USB-C cable",oldPrice:14.99,price:14.99,badge:"New"},
{id:34,category:"cables",brand:"Anker",name:"Anker 331 USB-C to Lightning Cable",description:"USB-C to Lightning cable",oldPrice:15.99,price:15.99,badge:""},
{id:35,category:"cables",brand:"Anker",name:"Anker 331 USB-A to Lightning Cable (Nylon)",description:"Nylon USB-A to Lightning cable",oldPrice:20.99,price:20.99,badge:""},
{id:36,category:"hubs-docks",brand:"Anker",name:"Anker Prime TB5 Docking Station (14-in-1, 8K)",description:"Thunderbolt 5 professional dock",oldPrice:399.99,price:399.99,badge:"New"},
{id:37,category:"hubs-docks",brand:"Anker",name:"Anker Prime DL7400 Docking Station (14-in-1)",description:"14-in-1 triple-display docking station",oldPrice:299.99,price:259.99,badge:""},
{id:38,category:"hubs-docks",brand:"Anker",name:"Anker Nano Docking Station (13-in-1)",description:"13-in-1 triple-display dock",oldPrice:149.99,price:119.99,badge:"New"},
{id:39,category:"hubs-docks",brand:"Anker",name:"Anker 543 USB-C Hub",description:"USB-C connectivity hub",oldPrice:39.99,price:39.99,badge:""},
{id:40,category:"hubs-docks",brand:"Anker",name:"Anker Nano Charging Station (7-in-1, 100W)",description:"7-in-1 charging station",oldPrice:79.99,price:59.98,badge:"New"},
{id:41,category:"power",brand:"Anker",name:"Anker Nano Power Strip (10-in-1, 70W, Clamp)",description:"10-in-1 desktop power strip",oldPrice:69.99,price:69.99,badge:"New"},
{id:42,category:"power",brand:"Anker",name:"Anker Prime Charging Base (150W, 3 Ports)",description:"150W desktop charging base",oldPrice:99.99,price:79.99,badge:"New"},
{id:43,category:"car",brand:"Anker",name:"Anker Prime Wireless Car Charger (MagGo, AirCool)",description:"Magnetic wireless car charger",oldPrice:89.99,price:89.99,badge:"New"},
{id:44,category:"car",brand:"Anker",name:"Anker 323 Car Charger (52.5W)",description:"52.5W dual-port car charger",oldPrice:19.99,price:14.24,badge:""},
{id:45,category:"audio",brand:"soundcore",name:"soundcore Liberty 5",description:"True wireless earbuds with noise cancellation",oldPrice:129.99,price:129.99,badge:"New"},
{id:46,category:"audio",brand:"soundcore",name:"soundcore Liberty 4 NC",description:"True wireless earbuds with ANC",oldPrice:99.99,price:99.99,badge:""},
{id:47,category:"audio",brand:"soundcore",name:"soundcore Space Q45",description:"Wireless headphones with adaptive noise cancelling",oldPrice:149.99,price:149.99,badge:""},
{id:48,category:"audio",brand:"soundcore",name:"soundcore Boom 2",description:"Portable Bluetooth speaker",oldPrice:129.99,price:129.99,badge:""},
{id:49,category:"security",brand:"eufy",name:"eufyCam S3 Pro",description:"Advanced wireless security camera system",oldPrice:699.99,price:699.99,badge:"New"},
{id:50,category:"security",brand:"eufy",name:"eufyCam S330 (eufyCam 3)",description:"4K security camera system",oldPrice:349.99,price:349.99,badge:""},
{id:51,category:"security",brand:"eufy",name:"eufy SoloCam S340",description:"Dual-camera security system",oldPrice:129.99,price:129.99,badge:""},
{id:52,category:"security",brand:"eufy",name:"eufy Video Doorbell S330",description:"Smart video doorbell",oldPrice:199.99,price:199.99,badge:""},
{id:53,category:"smart-home",brand:"eufy",name:"eufy X10 Pro Omni",description:"All-in-one robot vacuum and mop",oldPrice:799.99,price:799.99,badge:""},
{id:54,category:"smart-home",brand:"eufy",name:"eufy Smart Lock C220",description:"Smart door lock",oldPrice:119.99,price:119.99,badge:""},
{id:55,category:"smart-home",brand:"eufy",name:"eufy HomeBase S380 (HomeBase 3)",description:"Central hub for eufy security devices",oldPrice:139.99,price:139.99,badge:""},
{id:56,category:"projector",brand:"Nebula",name:"Nebula Capsule 3 Laser",description:"Portable laser smart projector",oldPrice:799.99,price:799.99,badge:""},
{id:57,category:"projector",brand:"Nebula",name:"Nebula Mars 3 Air",description:"Portable projector",oldPrice:599.99,price:599.99,badge:""},
{id:58,category:"projector",brand:"Nebula",name:"Nebula Cosmos 4K SE",description:"4K home projector",oldPrice:1299.99,price:1299.99,badge:""},
{id:59,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C1000 Gen 2",description:"Portable power station",oldPrice:1199.99,price:1199.99,badge:""},
{id:60,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C2000 Gen 2",description:"High-capacity portable power station",oldPrice:1699.99,price:1699.99,badge:""},
{id:61,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX F3800",description:"High-power home backup energy system",oldPrice:3999.99,price:3999.99,badge:""},
{id:62,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX PS100 Portable Solar Panel",description:"Portable solar panel",oldPrice:249.99,price:249.99,badge:""}
];

// Six additional products for every storefront category, using the matching Anker ecosystem brand.
products.push(
{id:1001,category:"power-bank",brand:"Anker",name:"Anker Prime Power Bank (27,650mAh, 250W)",description:"High-capacity portable power bank with high-speed charging",oldPrice:249.99,price:249.99,badge:"New"},
{id:1002,category:"power-bank",brand:"Anker",name:"Anker Prime Power Bank (20,000mAh, 200W)",description:"Premium high-output portable power bank",oldPrice:179.99,price:179.99,badge:"New"},
{id:1003,category:"power-bank",brand:"Anker",name:"Anker Nano Power Bank (10,000mAh, 45W)",description:"Compact fast-charging power bank",oldPrice:59.99,price:59.99,badge:"New"},
{id:1004,category:"power-bank",brand:"Anker",name:"Anker Zolo Power Bank (20,000mAh, 30W)",description:"20,000mAh portable charger for everyday use",oldPrice:54.99,price:54.99,badge:"New"},
{id:1005,category:"power-bank",brand:"Anker",name:"Anker MagGo Power Bank (10,000mAh, 35W)",description:"Magnetic portable battery with fast charging",oldPrice:69.99,price:69.99,badge:"New"},
{id:1006,category:"power-bank",brand:"Anker",name:"Anker PowerCore III Elite 25K 87W",description:"High-capacity laptop and phone power bank",oldPrice:119.99,price:119.99,badge:"New"},
{id:1011,category:"charger",brand:"Anker",name:"Anker Prime Charger (150W, 4 Ports)",description:"Desktop GaN charger for multiple devices",oldPrice:119.99,price:119.99,badge:"New"},
{id:1012,category:"charger",brand:"Anker",name:"Anker Prime Charger (100W, 3 Ports)",description:"100W multi-device GaN charger",oldPrice:79.99,price:79.99,badge:"New"},
{id:1013,category:"charger",brand:"Anker",name:"Anker Nano Charger (65W, 3 Ports)",description:"Compact 65W GaN charger",oldPrice:49.99,price:49.99,badge:"New"},
{id:1014,category:"charger",brand:"Anker",name:"Anker Nano Charger (30W, USB-C)",description:"Compact 30W fast wall charger",oldPrice:19.99,price:19.99,badge:"New"},
{id:1015,category:"charger",brand:"Anker",name:"Anker 747 Charger (GaNPrime 150W)",description:"High-power four-port GaN charger",oldPrice:109.99,price:109.99,badge:"New"},
{id:1016,category:"charger",brand:"Anker",name:"Anker 736 Charger (Nano II 100W)",description:"100W compact charger for laptops and phones",oldPrice:79.99,price:79.99,badge:"New"},
{id:1021,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charging Station (3-in-1)",description:"Magnetic charging station for phone, watch and earbuds",oldPrice:109.99,price:109.99,badge:"New"},
{id:1022,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charger Pad (Qi2)",description:"Qi2 magnetic wireless charging pad",oldPrice:39.99,price:39.99,badge:"New"},
{id:1023,category:"wireless",brand:"Anker",name:"Anker MagGo Wireless Charging Station (2-in-1)",description:"Foldable two-device magnetic charger",oldPrice:79.99,price:79.99,badge:"New"},
{id:1024,category:"wireless",brand:"Anker",name:"Anker 622 Magnetic Battery (MagGo)",description:"Magnetic battery with built-in stand",oldPrice:49.99,price:49.99,badge:"New"},
{id:1025,category:"wireless",brand:"Anker",name:"Anker 321 MagGo Battery",description:"Compact magnetic wireless battery",oldPrice:39.99,price:39.99,badge:"New"},
{id:1026,category:"wireless",brand:"Anker",name:"Anker 313 Wireless Charger Stand",description:"Wireless charging stand for compatible phones",oldPrice:29.99,price:29.99,badge:"New"},
{id:1031,category:"cables",brand:"Anker",name:"Anker Prime USB-C Cable (240W)",description:"Durable high-power braided USB-C cable",oldPrice:29.99,price:29.99,badge:"New"},
{id:1032,category:"cables",brand:"Anker",name:"Anker Prime USB-C to Lightning Cable",description:"Premium cable for Apple devices",oldPrice:29.99,price:29.99,badge:"New"},
{id:1033,category:"cables",brand:"Anker",name:"Anker 333 USB-C to USB-C Cable",description:"Long-lasting braided USB-C cable",oldPrice:15.99,price:15.99,badge:"New"},
{id:1034,category:"cables",brand:"Anker",name:"Anker 543 USB-C to USB-C Cable",description:"Bio-based braided charging cable",oldPrice:17.99,price:17.99,badge:"New"},
{id:1035,category:"cables",brand:"Anker",name:"Anker 765 USB-C to USB-C Cable",description:"High-speed 240W USB-C cable",oldPrice:29.99,price:29.99,badge:"New"},
{id:1036,category:"cables",brand:"Anker",name:"Anker 331 USB-C to Lightning Cable",description:"Reliable USB-C to Lightning cable",oldPrice:15.99,price:15.99,badge:"New"},
{id:1041,category:"hubs-docks",brand:"Anker",name:"Anker Prime TB4 Docking Station",description:"Professional Thunderbolt docking station",oldPrice:299.99,price:299.99,badge:"New"},
{id:1042,category:"hubs-docks",brand:"Anker",name:"Anker 777 Thunderbolt Docking Station",description:"High-performance Thunderbolt dock",oldPrice:279.99,price:279.99,badge:"New"},
{id:1043,category:"hubs-docks",brand:"Anker",name:"Anker 778 Thunderbolt Docking Station",description:"Multi-display Thunderbolt dock",oldPrice:299.99,price:299.99,badge:"New"},
{id:1044,category:"hubs-docks",brand:"Anker",name:"Anker 565 USB-C Hub",description:"11-in-1 USB-C connectivity hub",oldPrice:89.99,price:89.99,badge:"New"},
{id:1045,category:"hubs-docks",brand:"Anker",name:"Anker 556 USB-C Hub",description:"8-in-1 USB-C hub",oldPrice:69.99,price:69.99,badge:"New"},
{id:1046,category:"hubs-docks",brand:"Anker",name:"Anker 332 USB-C Hub",description:"Compact 5-in-1 USB-C hub",oldPrice:39.99,price:39.99,badge:"New"},
{id:1051,category:"power",brand:"Anker",name:"Anker Prime Charging Station (6 Ports)",description:"Desktop charging station for multiple devices",oldPrice:89.99,price:89.99,badge:"New"},
{id:1052,category:"power",brand:"Anker",name:"Anker Charging Station (GaNPrime 100W)",description:"Desktop charging solution with fast USB-C ports",oldPrice:99.99,price:99.99,badge:"New"},
{id:1053,category:"power",brand:"Anker",name:"Anker 525 Charging Station",description:"Multi-device desktop charging station",oldPrice:59.99,price:59.99,badge:"New"},
{id:1054,category:"power",brand:"Anker",name:"Anker 521 Power Strip",description:"Compact power strip with USB charging",oldPrice:39.99,price:39.99,badge:"New"},
{id:1055,category:"power",brand:"Anker",name:"Anker 727 Charging Station",description:"Ultra-slim desktop charging station",oldPrice:109.99,price:109.99,badge:"New"},
{id:1056,category:"power",brand:"Anker",name:"Anker Nano Charging Station",description:"Compact multi-port charging station",oldPrice:69.99,price:69.99,badge:"New"},
{id:1061,category:"car",brand:"Anker",name:"Anker MagGo Wireless Car Charger",description:"Magnetic wireless charging mount for cars",oldPrice:69.99,price:69.99,badge:"New"},
{id:1062,category:"car",brand:"Anker",name:"Anker 323 Car Charger",description:"Dual-port fast car charger",oldPrice:19.99,price:19.99,badge:"New"},
{id:1063,category:"car",brand:"Anker",name:"Anker 535 Car Charger",description:"High-output multi-port car charger",oldPrice:39.99,price:39.99,badge:"New"},
{id:1064,category:"car",brand:"Anker",name:"Anker 40W USB-C Car Charger",description:"Dual USB-C car charging adapter",oldPrice:29.99,price:29.99,badge:"New"},
{id:1065,category:"car",brand:"Anker",name:"Anker PowerDrive III Duo",description:"Compact dual-port car charger",oldPrice:29.99,price:29.99,badge:"New"},
{id:1066,category:"car",brand:"Anker",name:"Anker Roav SmartCharge Bluetooth FM Transmitter",description:"Bluetooth car audio and charging accessory",oldPrice:39.99,price:39.99,badge:"New"},
{id:1071,category:"audio",brand:"soundcore",name:"soundcore Liberty 4 Pro",description:"Premium true wireless earbuds with advanced noise cancelling",oldPrice:149.99,price:149.99,badge:"New"},
{id:1072,category:"audio",brand:"soundcore",name:"soundcore AeroFit 2",description:"Open-ear wireless headphones",oldPrice:129.99,price:129.99,badge:"New"},
{id:1073,category:"audio",brand:"soundcore",name:"soundcore Space One Pro",description:"Foldable wireless headphones with adaptive ANC",oldPrice:199.99,price:199.99,badge:"New"},
{id:1074,category:"audio",brand:"soundcore",name:"soundcore Q20i",description:"Hybrid active noise cancelling headphones",oldPrice:59.99,price:59.99,badge:"New"},
{id:1075,category:"audio",brand:"soundcore",name:"soundcore Motion X600",description:"Portable spatial audio Bluetooth speaker",oldPrice:199.99,price:199.99,badge:"New"},
{id:1076,category:"audio",brand:"soundcore",name:"soundcore Boom 2 Plus",description:"High-power portable Bluetooth speaker",oldPrice:249.99,price:249.99,badge:"New"},
{id:1081,category:"security",brand:"eufy",name:"eufyCam S4",description:"Advanced wireless security camera system",oldPrice:299.99,price:299.99,badge:"New"},
{id:1082,category:"security",brand:"eufy",name:"eufy Indoor Cam S350",description:"Indoor security camera with high-resolution imaging",oldPrice:129.99,price:129.99,badge:"New"},
{id:1083,category:"security",brand:"eufy",name:"eufy SoloCam C210",description:"Wireless outdoor security camera",oldPrice:79.99,price:79.99,badge:"New"},
{id:1084,category:"security",brand:"eufy",name:"eufy Floodlight Cam E340",description:"Outdoor floodlight security camera",oldPrice:199.99,price:199.99,badge:"New"},
{id:1085,category:"security",brand:"eufy",name:"eufy Video Smart Lock S330",description:"Smart lock with integrated video doorbell",oldPrice:399.99,price:399.99,badge:"New"},
{id:1086,category:"security",brand:"eufy",name:"eufy Security Video Doorbell E340",description:"Dual-camera smart video doorbell",oldPrice:179.99,price:179.99,badge:"New"},
{id:1091,category:"smart-home",brand:"eufy",name:"eufy Omni C20",description:"Robot vacuum and mop with all-in-one station",oldPrice:599.99,price:599.99,badge:"New"},
{id:1092,category:"smart-home",brand:"eufy",name:"eufy X10 Pro Omni",description:"Premium robot vacuum and mop",oldPrice:799.99,price:799.99,badge:"New"},
{id:1093,category:"smart-home",brand:"eufy",name:"eufy Smart Lock C210",description:"Keypad smart door lock",oldPrice:99.99,price:99.99,badge:"New"},
{id:1094,category:"smart-home",brand:"eufy",name:"eufy Smart Lock E30",description:"Smart lock with modern access control",oldPrice:179.99,price:179.99,badge:"New"},
{id:1095,category:"smart-home",brand:"eufy",name:"eufy HomeBase S380",description:"Central smart security hub",oldPrice:139.99,price:139.99,badge:"New"},
{id:1096,category:"smart-home",brand:"eufy",name:"eufy Baby Monitor E110",description:"Smart baby monitoring system",oldPrice:99.99,price:99.99,badge:"New"},
{id:1101,category:"projector",brand:"Nebula",name:"Nebula Capsule 3",description:"Portable 1080p smart projector",oldPrice:599.99,price:599.99,badge:"New"},
{id:1102,category:"projector",brand:"Nebula",name:"Nebula Capsule Air",description:"Ultra-portable smart projector",oldPrice:399.99,price:399.99,badge:"New"},
{id:1103,category:"projector",brand:"Nebula",name:"Nebula Mars 3",description:"Portable outdoor smart projector",oldPrice:1099.99,price:1099.99,badge:"New"},
{id:1104,category:"projector",brand:"Nebula",name:"Nebula Mars 3 Air",description:"Portable Full HD smart projector",oldPrice:599.99,price:599.99,badge:"New"},
{id:1105,category:"projector",brand:"Nebula",name:"Nebula Cosmos Laser 4K",description:"4K laser home cinema projector",oldPrice:1599.99,price:1599.99,badge:"New"},
{id:1106,category:"projector",brand:"Nebula",name:"Nebula Cosmos 4K SE",description:"4K smart home cinema projector",oldPrice:1299.99,price:1299.99,badge:"New"},
{id:1111,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C800",description:"Portable power station for home and travel",oldPrice:799.99,price:799.99,badge:"New"},
{id:1112,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C1000",description:"High-capacity portable power station",oldPrice:999.99,price:999.99,badge:"New"},
{id:1113,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C1000 Gen 2",description:"Next-generation portable power station",oldPrice:1199.99,price:1199.99,badge:"New"},
{id:1114,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX C2000 Gen 2",description:"Large-capacity home backup power station",oldPrice:1699.99,price:1699.99,badge:"New"},
{id:1115,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX F3800",description:"Expandable home energy storage system",oldPrice:3999.99,price:3999.99,badge:"New"},
{id:1116,category:"solar",brand:"Anker SOLIX",name:"Anker SOLIX PS100 Portable Solar Panel",description:"Portable solar charging panel",oldPrice:249.99,price:249.99,badge:"New"}
);

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
  const map={"power-bank":"assets/product-power.svg","charger":"assets/product-charger.svg","wireless":"assets/product-accessories.svg","cables":"assets/product-accessories.svg","hubs-docks":"assets/product-accessories.svg","power":"assets/product-accessories.svg","car":"assets/product-charger.svg","audio":"assets/product-audio.svg","security":"assets/product-security.svg","smart-home":"assets/product-smart.svg","projector":"assets/product-projector.svg","solar":"assets/product-solar.svg"};
  return map[p.category]||"assets/product-accessories.svg";
}
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

function productImagePath(p){
  if(p && p.image) return p.image;
  const map={"power-bank":"assets/product-power.svg","charger":"assets/product-charger.svg","wireless":"assets/product-accessories.svg","cables":"assets/product-accessories.svg","hubs-docks":"assets/product-accessories.svg","power":"assets/product-accessories.svg","car":"assets/product-charger.svg","audio":"assets/product-audio.svg","security":"assets/product-security.svg","smart-home":"assets/product-smart.svg","projector":"assets/product-projector.svg","solar":"assets/product-solar.svg"};
  return map[p?.category]||"assets/product-accessories.svg";
}

document.addEventListener("DOMContentLoaded",()=>{setTimeout(syncAdminCatalog,150);});
