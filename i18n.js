/*
 * SYRIATECH — كل نصوص الموقع
 * ============================
 * هذا هو الملف الوحيد الذي يحتوي نصوصاً ظاهرة للزائر.
 * لإضافة لغة جديدة: أضفها إلى languages ثم أضف قاموساً لها بنفس المفاتيح.
 * الترجمة هنا تسويقية وليست حرفية: كل لغة مكتوبة بأسلوب سوقها.
 */
(function () {
  const languages = [
    { code: "ar", native: "العربية", dir: "rtl" },
    { code: "en", native: "English", dir: "ltr" },
    { code: "tr", native: "Türkçe", dir: "ltr" }
  ];

  const dict = {
    ar: {
      brandName: "Syriatech",
      pageTitle: "Syriatech | إلكترونيات وشواحن أصلية",
      metaDescription: "متجر Syriatech للإلكترونيات الأصلية: Anker وUGREEN وBaseus وsoundcore وeufy وNebula. أسعار واضحة وطلب مباشر عبر واتساب.",
      adminPageTitle: "Syriatech | لوحة التحكم",

      noticeMain: "توصيل سريع لكل المحافظات · اطلب مباشرة عبر واتساب",
      noticeSide: "منتجات أصلية 100% · ضمان الوكيل",

      navHome: "الرئيسية",
      navShop: "المتجر",
      navBrands: "العلامات التجارية",
      navCategories: "الأقسام",
      navOffers: "العروض",
      navContact: "تواصل معنا",
      navFavorites: "المفضلة",

      searchLabel: "بحث",
      searchPlaceholder: "ابحث عن منتج أو موديل...",
      searchClear: "مسح البحث",
      languageLabel: "اللغة",
      cartLabel: "السلة",
      favoritesLabel: "المفضلة",

      heroTagBrand: "SYRIATECH",
      heroTagOriginal: "وكلاء معتمدون",
      heroTagYear: "تشكيلة 2026",
      heroTitle: "تقنية أصلية<br><em>بأسعار واضحة.</em>",
      heroSubtitle: "شواحن وباور بانك وسماعات وأنظمة أمان من Anker وUGREEN وBaseus وsoundcore وeufy وNebula — اطلبها بضغطة واحدة عبر واتساب.",
      heroShop: "تسوّق الآن",
      heroOffers: "شاهد العروض",
      heroBadgeTitle: "أصلي ومضمون",
      heroBadgeText: "منتجات وكلاء بضمان حقيقي",
      heroImageAlt: "منتجات Syriatech",

      benefitOriginalTitle: "أصلي 100%",
      benefitOriginalText: "بضاعة وكلاء لا تقليد",
      benefitShippingTitle: "توصيل سريع",
      benefitShippingText: "لكل المحافظات",
      benefitSupportTitle: "دعم على واتساب",
      benefitSupportText: "نرد عليك مباشرة",
      benefitPriceTitle: "سعر واضح",
      benefitPriceText: "بدون رسوم خفية",

      brandsEyebrow: "علاماتنا التجارية",
      brandsTitle: "تسوّق حسب العلامة التجارية",
      brandProducts: "{n} منتج",

      productsEyebrow: "تشكيلتنا",
      productsTitle: "الأكثر طلباً هذا الموسم",
      productsLabel: "المنتجات",
      showAll: "كل المنتجات",
      resultCount: "{n} منتج",
      resultCountFiltered: "{n} من {total} منتج",
      emptyProducts: "لا يوجد منتج مطابق. جرّب كلمة أخرى أو امسح عوامل التصفية.",
      emptyFavorites: "لم تضف أي منتج إلى المفضلة بعد.",
      loadMore: "عرض {n} منتج إضافي",
      clearFilters: "مسح التصفية",
      filtersTitle: "تصفية",
      filterBrand: "العلامة التجارية",
      filterPrice: "السعر",
      priceFrom: "من",
      priceTo: "إلى",
      sortLabel: "ترتيب",
      sortFeatured: "الأكثر طلباً",
      sortLow: "الأرخص أولاً",
      sortHigh: "الأغلى أولاً",
      sortName: "حسب الاسم",
      searchResults: "نتائج البحث عن “{q}”",
      favoritesTitle: "المفضلة",

      addToCart: "أضف إلى السلة",
      addedToCart: "تمت الإضافة إلى السلة ✓",
      addFavorite: "أضف إلى المفضلة",
      removeFavorite: "إزالة من المفضلة",
      discountBadge: "خصم {n}%",
      inStock: "متوفر",
      outOfStock: "غير متوفر حالياً",
      outOfStockNote: "غير متوفر حالياً — راسلنا على واتساب لمعرفة موعد توفره.",
      askAboutProduct: "اسأل عنه على واتساب",
      shareProduct: "مشاركة المنتج",
      shareCopied: "تم نسخ رابط المنتج ✓",
      orderThisProduct: "اطلب هذا المنتج عبر واتساب",
      backToProducts: "رجوع إلى المنتجات",
      productCode: "رمز المنتج",
      relatedTitle: "منتجات مشابهة",
      closeLabel: "إغلاق",
      imagePreview: "معاينة صورة المنتج",

      offersEyebrow: "عروض هذا الشهر",
      offersTitle: "خصومات حقيقية على تشكيلة مختارة",
      offersText: "نعرض السعر قبل الخصم وبعده بوضوح، بدون رسوم أو ضرائب مخفية.",
      orderWhatsApp: "اطلب عبر واتساب",

      contactEyebrow: "خدمة الزبائن",
      contactTitle: "اطلب أو استفسر مباشرة",
      contactText: "فريقنا يرد على واتساب خلال دقائق خلال ساعات العمل.",

      cartEyebrow: "طلبك",
      cartTitle: "سلة المشتريات",
      cartEmpty: "سلتك فارغة. أضف منتجاً لتبدأ الطلب.",
      cartEmptyAlert: "أضف منتجاً إلى السلة أولاً.",
      cartTotal: "الإجمالي",
      cartCheckout: "إتمام الطلب عبر واتساب",
      cartItemRemove: "حذف المنتج",
      cartIncrease: "زيادة الكمية",
      cartDecrease: "إنقاص الكمية",
      cartNote: "تؤكد الطلب والتوصيل عبر واتساب.",

      orderIntro: "مرحباً Syriatech، أريد طلب:",
      orderSingleIntro: "مرحباً Syriatech، أريد الاستفسار عن هذا المنتج:",
      orderTotal: "الإجمالي:",
      orderLink: "رابط المنتج:",

      footerAbout: "متجر سوري مستقل لمنتجات التقنية الأصلية من وكلاء معتمدين.",
      footerProducts: "أقسام مختارة",
      footerHelp: "روابط سريعة",
      footerBrands: "العلامات التجارية",
      footerAdmin: "لوحة تحكم المتجر",
      footerNote: "جميع الأسماء والعلامات التجارية ملك لأصحابها.",
      footerRights: "© {year} Syriatech Store",


      admin: {
        title: "لوحة تحكم المتجر",
        loginHint: "أدخل كلمة مرور المدير للدخول",
        password: "كلمة المرور",
        login: "دخول",
        loggingIn: "جارٍ الدخول...",
        logout: "خروج",
        viewStore: "عرض المتجر",
        tabProducts: "المنتجات",
        tabSettings: "الإعدادات",
        tabHelp: "طريقة الاستخدام",
        searchPlaceholder: "ابحث باسم المنتج أو العلامة التجارية...",
        allCategories: "كل الأقسام",
        allBrands: "كل العلامات",
        addProduct: "إضافة منتج جديد",
        listInfo: "{n} منتج — اضغط على أي منتج لتعديله",
        listInfoFiltered: "{n} من {total} منتج — اضغط على أي منتج لتعديله",
        noResults: "لا توجد منتجات مطابقة للبحث.",
        tagAdded: "مضاف",
        tagEdited: "معدّل",
        tagAutoImage: "صورة تلقائية",
        tagOutOfStock: "غير متوفر",
        deletedTitle: "المنتجات المحذوفة ({n}) — يمكنك استعادتها",
        restore: "استعادة",
        editTitle: "تعديل المنتج",
        newTitle: "إضافة منتج جديد",
        fieldName: "اسم المنتج",
        fieldBrand: "العلامة التجارية",
        fieldCategory: "القسم",
        fieldPrice: "السعر الحالي ($)",
        fieldOldPrice: "السعر قبل الخصم ($)",
        optional: "اختياري",
        fieldBadge: "شارة على الصورة",
        badgeHint: "مثل: جديد أو الأكثر مبيعاً. اتركها فارغة لعرض نسبة الخصم تلقائياً",
        fieldDescAr: "الوصف بالعربية",
        fieldDescEn: "الوصف بالإنجليزية",
        fieldDescTr: "الوصف بالتركية",
        descHint: "اتركه فارغاً ليظهر وصف عام حسب القسم",
        fieldStock: "المنتج متوفر للبيع",
        stockHint: "عند إلغاء التحديد يظهر المنتج في المتجر بعلامة غير متوفر ولا يمكن إضافته إلى السلة",
        pickImage: "اختيار صورة من الجهاز",
        removeImage: "إزالة الصورة",
        imageUrl: "أو ضع رابط صورة من الإنترنت",
        preparingImage: "جارٍ تجهيز الصورة...",
        uploadingImage: "جارٍ رفع الصورة...",
        imageUploaded: "تم رفع الصورة ✓ اضغط حفظ لتثبيتها على المنتج.",
        imageRemoved: "تمت إزالة الصورة. اضغط حفظ لتثبيت التغيير.",
        uploadFailed: "لم يتم رفع الصورة: {error}",
        unsupportedFile: "صيغة الصورة غير مدعومة. استخدم صورة JPG أو PNG",
        imageTooBig: "الصورة كبيرة جداً (أكثر من 10 ميغابايت)",
        save: "حفظ",
        saving: "جارٍ الحفظ...",
        cancel: "إلغاء",
        working: "لحظة...",
        revert: "استرجاع البيانات الأصلية",
        deleteProduct: "حذف المنتج",
        saved: "تم الحفظ ✓ التغيير ظاهر الآن في المتجر",
        deleted: "تم حذف المنتج من المتجر",
        restored: "تمت استعادة المنتج إلى المتجر",
        reverted: "تم استرجاع البيانات الأصلية",
        settingsSaved: "تم حفظ الإعدادات ✓",
        discountHint: "سيظهر خصم {n}% مع السعر القديم مشطوباً",
        discountWarn: "السعر قبل الخصم يجب أن يكون أكبر من السعر الحالي",
        confirmDelete: "حذف \"{name}\" من المتجر؟ يمكنك استعادته لاحقاً من قائمة المنتجات المحذوفة.",
        confirmRevert: "إرجاع هذا المنتج إلى بياناته الأصلية؟",
        confirmLeave: "لديك تغييرات غير محفوظة. هل تريد الخروج بدون حفظ؟",
        needName: "اكتب اسم المنتج",
        needBrand: "اكتب العلامة التجارية",
        needPrice: "اكتب السعر الحالي",
        waitUpload: "انتظر حتى ينتهي رفع الصورة",
        settingsTitle: "معلومات التواصل",
        settingsHint: "تظهر في المتجر وتصل إليها طلبات الزبائن عبر واتساب.",
        fieldWhatsapp: "رقم واتساب",
        whatsappHint: "مع رمز الدولة، أرقام فقط — مثال: 963949951985",
        fieldEmail: "البريد الإلكتروني",
        saveSettings: "حفظ الإعدادات",
        helpTitle: "طريقة الاستخدام",
        help1: "تعديل منتج: اضغط على المنتج من القائمة، غيّر ما تريد ثم اضغط حفظ.",
        help2: "تغيير الصورة: افتح المنتج، اضغط اختيار صورة من الجهاز، انتظر رسالة تم رفع الصورة، ثم اضغط حفظ.",
        help3: "الخصم: اكتب السعر الجديد في السعر الحالي والسعر القديم في السعر قبل الخصم، وتُحسب النسبة تلقائياً.",
        help4: "نفاد الكمية: ألغِ تحديد المنتج متوفر للبيع، فيظهر للزبون أنه غير متوفر مع زر سؤال على واتساب.",
        help5: "إضافة منتج: اضغط إضافة منتج جديد واملأ البيانات.",
        help6: "الحذف والاستعادة: الحذف لا يلغي المنتج نهائياً، تجده في قائمة المنتجات المحذوفة أسفل الصفحة.",
        helpNote: "كل تغيير يظهر في المتجر مباشرة بعد الحفظ.",
        sessionExpired: "انتهت الجلسة، سجّل الدخول مرة أخرى",
        connectionError: "تعذّر الاتصال بالخادم، تحقق من الإنترنت وحاول مرة أخرى",
        genericError: "حدث خطأ، حاول مرة أخرى"
      },
      error: {
        missing_env: "لم يتم ضبط ADMIN_PASSWORD و ADMIN_SECRET في إعدادات Vercel",
        invalid_password: "كلمة المرور غير صحيحة",
        unauthorized: "يجب تسجيل الدخول",
        product_required: "بيانات المنتج ناقصة",
        name_required: "اسم المنتج مطلوب",
        invalid_price: "السعر غير صالح",
        invalid_category: "القسم غير صالح",
        invalid_image: "رابط الصورة غير صالح",
        invalid_id: "رقم المنتج غير صالح",
        invalid_whatsapp: "رقم واتساب غير صالح — اكتبه مع رمز الدولة، مثال: 963949951985",
        invalid_email: "البريد الإلكتروني غير صالح",
        unsupported_image: "صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP",
        image_too_large: "حجم الصورة يجب أن يكون أقل من 10 ميغابايت",
        corrupt_state: "ملف بيانات المتجر تالف، لم يتم حفظ أي تغيير",
        unknown_action: "عملية غير معروفة",
        server_error: "خطأ في الخادم، حاول مرة أخرى"
      },
      category: {
        "power-bank": "باور بانك", charger: "شواحن", wireless: "شحن لاسلكي", cables: "كابلات",
        "hubs-docks": "موزعات ومحطات", power: "محطات شحن مكتبية", car: "شحن السيارة",
        audio: "سماعات وصوتيات", security: "كاميرات وأمان", "smart-home": "المنزل الذكي",
        projector: "أجهزة عرض", solar: "طاقة متنقلة وشمسية"
      },
      categoryDesc: {
        "power-bank": "باور بانك أصلي من {brand} لشحن سريع يدوم معك طوال اليوم.",
        charger: "شاحن {brand} أصلي يشحن أجهزتك بسرعة وأمان.",
        wireless: "شاحن لاسلكي من {brand} لتجربة شحن مريحة بدون كابلات.",
        cables: "كابل {brand} أصلي متين لشحن ونقل بيانات بأعلى سرعة.",
        "hubs-docks": "موزع منافذ من {brand} يوسّع إمكانيات لابتوبك.",
        power: "محطة شحن من {brand} تشحن كل أجهزتك من مكان واحد.",
        car: "ملحق شحن من {brand} مصمم للاستخدام داخل السيارة.",
        audio: "صوت نقي من {brand} مع عزل ضجيج وبطارية طويلة.",
        security: "كاميرا أمان من {brand} تحمي بيتك ومحلك على مدار الساعة.",
        "smart-home": "جهاز منزل ذكي من {brand} يوفّر عليك الوقت والجهد.",
        projector: "جهاز عرض من {brand} يحوّل بيتك إلى سينما.",
        solar: "محطة طاقة من {brand} تبقيك متصلاً وقت انقطاع الكهرباء."
      },
      brandTagline: {
        Anker: "شحن وطاقة · الأكثر مبيعاً عالمياً",
        UGREEN: "كابلات وموزعات لكل جهاز",
        Baseus: "ملحقات عملية بسعر منافس",
        soundcore: "سماعات ومكبرات صوت",
        eufy: "كاميرات ومنزل ذكي",
        Nebula: "أجهزة عرض وسينما منزلية",
        "Anker SOLIX": "طاقة متنقلة وألواح شمسية",
        BLUETTI: "محطات طاقة للمنزل والعمل",
        EcoFlow: "طاقة احتياطية سريعة الشحن"
      }
    },

    en: {
      brandName: "Syriatech",
      pageTitle: "Syriatech | Genuine Tech & Charging Gear",
      metaDescription: "Syriatech stocks genuine Anker, UGREEN, Baseus, soundcore, eufy and Nebula gear. Clear prices, fast delivery, order on WhatsApp.",
      adminPageTitle: "Syriatech | Store admin",

      noticeMain: "Fast delivery nationwide · Order straight from WhatsApp",
      noticeSide: "100% genuine stock · Official warranty",

      navHome: "Home",
      navShop: "Shop",
      navBrands: "Brands",
      navCategories: "Categories",
      navOffers: "Deals",
      navContact: "Contact",
      navFavorites: "Saved",

      searchLabel: "Search",
      searchPlaceholder: "Search a product or model...",
      searchClear: "Clear search",
      languageLabel: "Language",
      cartLabel: "Cart",
      favoritesLabel: "Saved items",

      heroTagBrand: "SYRIATECH",
      heroTagOriginal: "AUTHORISED DEALER",
      heroTagYear: "2026 LINEUP",
      heroTitle: "Genuine tech,<br><em>honest pricing.</em>",
      heroSubtitle: "Chargers, power banks, audio and security from Anker, UGREEN, Baseus, soundcore, eufy and Nebula — one tap to order on WhatsApp.",
      heroShop: "Shop now",
      heroOffers: "See deals",
      heroBadgeTitle: "Genuine & covered",
      heroBadgeText: "Dealer stock with real warranty",
      heroImageAlt: "Syriatech products",

      benefitOriginalTitle: "100% genuine",
      benefitOriginalText: "Dealer stock, never copies",
      benefitShippingTitle: "Fast delivery",
      benefitShippingText: "To every governorate",
      benefitSupportTitle: "WhatsApp support",
      benefitSupportText: "A real person replies",
      benefitPriceTitle: "Clear pricing",
      benefitPriceText: "No hidden fees or VAT surprises",

      brandsEyebrow: "OUR BRANDS",
      brandsTitle: "Shop by brand",
      brandProducts: "{n} products",

      productsEyebrow: "THE LINEUP",
      productsTitle: "Best sellers this season",
      productsLabel: "Products",
      showAll: "All products",
      resultCount: "{n} products",
      resultCountFiltered: "{n} of {total} products",
      emptyProducts: "Nothing matches yet. Try another word or clear the filters.",
      emptyFavorites: "You have not saved any product yet.",
      loadMore: "Show {n} more",
      clearFilters: "Clear filters",
      filtersTitle: "Filter",
      filterBrand: "Brand",
      filterPrice: "Price",
      priceFrom: "From",
      priceTo: "To",
      sortLabel: "Sort",
      sortFeatured: "Best sellers",
      sortLow: "Lowest price",
      sortHigh: "Highest price",
      sortName: "By name",
      searchResults: "Results for “{q}”",
      favoritesTitle: "Saved items",

      addToCart: "Add to cart",
      addedToCart: "Added to your cart ✓",
      addFavorite: "Save for later",
      removeFavorite: "Remove from saved",
      discountBadge: "{n}% off",
      inStock: "In stock",
      outOfStock: "Out of stock",
      outOfStockNote: "Out of stock right now — message us on WhatsApp and we will tell you when it lands.",
      askAboutProduct: "Ask about it on WhatsApp",
      shareProduct: "Share product",
      shareCopied: "Product link copied ✓",
      orderThisProduct: "Order this on WhatsApp",
      backToProducts: "Back to products",
      productCode: "Product code",
      relatedTitle: "You may also like",
      closeLabel: "Close",
      imagePreview: "Product image preview",

      offersEyebrow: "THIS MONTH",
      offersTitle: "Real discounts on selected gear",
      offersText: "We show the price before and after the discount, with no hidden fees or VAT surprises.",
      orderWhatsApp: "Order on WhatsApp",

      contactEyebrow: "CUSTOMER CARE",
      contactTitle: "Order or ask us directly",
      contactText: "Our team answers on WhatsApp within minutes during working hours.",

      cartEyebrow: "YOUR ORDER",
      cartTitle: "Shopping cart",
      cartEmpty: "Your cart is empty. Add a product to start your order.",
      cartEmptyAlert: "Add a product to the cart first.",
      cartTotal: "Total",
      cartCheckout: "Checkout on WhatsApp",
      cartItemRemove: "Remove item",
      cartIncrease: "Increase quantity",
      cartDecrease: "Decrease quantity",
      cartNote: "You confirm the order and delivery on WhatsApp.",

      orderIntro: "Hello Syriatech, I would like to order:",
      orderSingleIntro: "Hello Syriatech, I have a question about this product:",
      orderTotal: "Total:",
      orderLink: "Product link:",

      footerAbout: "An independent Syrian store for genuine tech from authorised dealers.",
      footerProducts: "Popular categories",
      footerHelp: "Quick links",
      footerBrands: "Brands",
      footerAdmin: "Store admin",
      footerNote: "All product names and trademarks belong to their owners.",
      footerRights: "© {year} Syriatech Store",


      admin: {
        title: "Store admin",
        loginHint: "Enter the admin password to continue",
        password: "Password",
        login: "Sign in",
        loggingIn: "Signing in...",
        logout: "Sign out",
        viewStore: "View store",
        tabProducts: "Products",
        tabSettings: "Settings",
        tabHelp: "How to use",
        searchPlaceholder: "Search by product name or brand...",
        allCategories: "All categories",
        allBrands: "All brands",
        addProduct: "Add new product",
        listInfo: "{n} products — tap any product to edit it",
        listInfoFiltered: "{n} of {total} products — tap any product to edit it",
        noResults: "No product matches your search.",
        tagAdded: "Added",
        tagEdited: "Edited",
        tagAutoImage: "Auto artwork",
        tagOutOfStock: "Out of stock",
        deletedTitle: "Deleted products ({n}) — you can restore them",
        restore: "Restore",
        editTitle: "Edit product",
        newTitle: "Add new product",
        fieldName: "Product name",
        fieldBrand: "Brand",
        fieldCategory: "Category",
        fieldPrice: "Current price ($)",
        fieldOldPrice: "Price before discount ($)",
        optional: "optional",
        fieldBadge: "Badge on the image",
        badgeHint: "Such as New or Best seller. Leave it empty to show the discount automatically",
        fieldDescAr: "Description in Arabic",
        fieldDescEn: "Description in English",
        fieldDescTr: "Description in Turkish",
        descHint: "Leave empty to show a generic category description",
        fieldStock: "Product is in stock",
        stockHint: "When unchecked the product shows as out of stock and cannot be added to the cart",
        pickImage: "Choose a photo from this device",
        removeImage: "Remove photo",
        imageUrl: "Or paste an image link",
        preparingImage: "Preparing the photo...",
        uploadingImage: "Uploading the photo...",
        imageUploaded: "Photo uploaded ✓ press Save to attach it to the product.",
        imageRemoved: "Photo removed. Press Save to apply the change.",
        uploadFailed: "Photo was not uploaded: {error}",
        unsupportedFile: "This image format is not supported. Use JPG or PNG",
        imageTooBig: "The photo is too large (over 10MB)",
        save: "Save",
        saving: "Saving...",
        cancel: "Cancel",
        working: "One moment...",
        revert: "Restore original data",
        deleteProduct: "Delete product",
        saved: "Saved ✓ the change is live in the store",
        deleted: "Product removed from the store",
        restored: "Product restored to the store",
        reverted: "Original data restored",
        settingsSaved: "Settings saved ✓",
        discountHint: "A {n}% discount will show with the old price crossed out",
        discountWarn: "The price before discount must be higher than the current price",
        confirmDelete: "Delete \"{name}\" from the store? You can restore it later from the deleted list.",
        confirmRevert: "Restore this product to its original data?",
        confirmLeave: "You have unsaved changes. Leave without saving?",
        needName: "Enter the product name",
        needBrand: "Enter the brand",
        needPrice: "Enter the current price",
        waitUpload: "Wait until the photo finishes uploading",
        settingsTitle: "Contact details",
        settingsHint: "Shown in the store — customer orders arrive here on WhatsApp.",
        fieldWhatsapp: "WhatsApp number",
        whatsappHint: "With country code, digits only — for example 963949951985",
        fieldEmail: "Email address",
        saveSettings: "Save settings",
        helpTitle: "How to use",
        help1: "Edit a product: tap it in the list, change what you need, then press Save.",
        help2: "Change the photo: open the product, press Choose a photo, wait for the uploaded message, then press Save.",
        help3: "Discounts: put the new price in Current price and the old one in Price before discount; the percentage is calculated for you.",
        help4: "Sold out: uncheck Product is in stock and customers see it as unavailable with a WhatsApp question button.",
        help5: "Add a product: press Add new product and fill in the details.",
        help6: "Delete and restore: deleting is not permanent — find it in the deleted list at the bottom of the page.",
        helpNote: "Every change is live in the store right after you save.",
        sessionExpired: "Session expired, please sign in again",
        connectionError: "Could not reach the server, check your connection and try again",
        genericError: "Something went wrong, please try again"
      },
      error: {
        missing_env: "ADMIN_PASSWORD and ADMIN_SECRET are not set in the Vercel settings",
        invalid_password: "Wrong password",
        unauthorized: "Please sign in",
        product_required: "Product data is missing",
        name_required: "Product name is required",
        invalid_price: "Price is not valid",
        invalid_category: "Category is not valid",
        invalid_image: "Image link is not valid",
        invalid_id: "Product id is not valid",
        invalid_whatsapp: "WhatsApp number is not valid — include the country code, e.g. 963949951985",
        invalid_email: "Email address is not valid",
        unsupported_image: "Image format not supported. Use JPG, PNG or WEBP",
        image_too_large: "The image must be smaller than 10MB",
        corrupt_state: "The store data file is corrupt, nothing was saved",
        unknown_action: "Unknown action",
        server_error: "Server error, please try again"
      },
      category: {
        "power-bank": "Power banks", charger: "Chargers", wireless: "Wireless charging", cables: "Cables",
        "hubs-docks": "Hubs & docks", power: "Desktop charging", car: "Car charging",
        audio: "Audio & headphones", security: "Cameras & security", "smart-home": "Smart home",
        projector: "Projectors", solar: "Portable & solar power"
      },
      categoryDesc: {
        "power-bank": "A genuine {brand} power bank that keeps you charged all day.",
        charger: "A genuine {brand} charger that fills your devices fast and safely.",
        wireless: "Wireless charging from {brand} — drop it down and it charges.",
        cables: "A tough genuine {brand} cable for full-speed charging and data.",
        "hubs-docks": "A {brand} hub that gives your laptop every port it is missing.",
        power: "A {brand} charging station that powers your whole desk from one plug.",
        car: "A {brand} charging accessory built for the car.",
        audio: "Clean sound from {brand} with noise cancelling and long battery life.",
        security: "A {brand} security camera that watches your home around the clock.",
        "smart-home": "A {brand} smart home device that saves you time every day.",
        projector: "A {brand} projector that turns any wall into a cinema.",
        solar: "A {brand} power station that keeps you running when the grid stops."
      },
      brandTagline: {
        Anker: "Charging & power · world best seller",
        UGREEN: "Cables and hubs for every device",
        Baseus: "Smart accessories, sharp prices",
        soundcore: "Headphones, earbuds & speakers",
        eufy: "Security cameras & smart home",
        Nebula: "Projectors & home cinema",
        "Anker SOLIX": "Portable power & solar panels",
        BLUETTI: "Power stations for home and work",
        EcoFlow: "Backup power that recharges fast"
      }
    },

    tr: {
      brandName: "Syriatech",
      pageTitle: "Syriatech | Orijinal Teknoloji ve Şarj Ürünleri",
      metaDescription: "Syriatech'te orijinal Anker, UGREEN, Baseus, soundcore, eufy ve Nebula ürünleri. Net fiyat, hızlı teslimat, WhatsApp'tan sipariş.",
      adminPageTitle: "Syriatech | Yönetim paneli",

      noticeMain: "Tüm bölgelere hızlı teslimat · WhatsApp'tan hemen sipariş",
      noticeSide: "%100 orijinal ürün · Distribütör garantili",

      navHome: "Ana sayfa",
      navShop: "Mağaza",
      navBrands: "Markalar",
      navCategories: "Kategoriler",
      navOffers: "Fırsatlar",
      navContact: "İletişim",
      navFavorites: "Favoriler",

      searchLabel: "Ara",
      searchPlaceholder: "Ürün veya model ara...",
      searchClear: "Aramayı temizle",
      languageLabel: "Dil",
      cartLabel: "Sepet",
      favoritesLabel: "Favoriler",

      heroTagBrand: "SYRIATECH",
      heroTagOriginal: "YETKİLİ SATICI",
      heroTagYear: "2026 KOLEKSİYONU",
      heroTitle: "Orijinal teknoloji,<br><em>net fiyat.</em>",
      heroSubtitle: "Anker, UGREEN, Baseus, soundcore, eufy ve Nebula şarj, ses ve güvenlik ürünleri — tek dokunuşla WhatsApp'tan sipariş.",
      heroShop: "Hemen alışverişe başla",
      heroOffers: "Fırsatları gör",
      heroBadgeTitle: "Orijinal ve garantili",
      heroBadgeText: "Distribütör ürünü, gerçek garanti",
      heroImageAlt: "Syriatech ürünleri",

      benefitOriginalTitle: "%100 orijinal",
      benefitOriginalText: "Distribütör ürünü, taklit değil",
      benefitShippingTitle: "Hızlı teslimat",
      benefitShippingText: "Tüm bölgelere",
      benefitSupportTitle: "WhatsApp desteği",
      benefitSupportText: "Size gerçek bir kişi yanıt verir",
      benefitPriceTitle: "Net fiyat",
      benefitPriceText: "Gizli ücret veya KDV sürprizi yok",

      brandsEyebrow: "MARKALARIMIZ",
      brandsTitle: "Markaya göre alışveriş",
      brandProducts: "{n} ürün",

      productsEyebrow: "ÜRÜN GAMI",
      productsTitle: "Bu sezonun çok satanları",
      productsLabel: "Ürünler",
      showAll: "Tüm ürünler",
      resultCount: "{n} ürün",
      resultCountFiltered: "{total} üründen {n} tanesi",
      emptyProducts: "Eşleşen ürün yok. Başka bir kelime deneyin veya filtreleri temizleyin.",
      emptyFavorites: "Henüz favorilerinize ürün eklemediniz.",
      loadMore: "{n} ürün daha göster",
      clearFilters: "Filtreleri temizle",
      filtersTitle: "Filtrele",
      filterBrand: "Marka",
      filterPrice: "Fiyat",
      priceFrom: "En az",
      priceTo: "En çok",
      sortLabel: "Sırala",
      sortFeatured: "Çok satanlar",
      sortLow: "Önce en ucuz",
      sortHigh: "Önce en pahalı",
      sortName: "İsme göre",
      searchResults: "“{q}” için sonuçlar",
      favoritesTitle: "Favoriler",

      addToCart: "Sepete ekle",
      addedToCart: "Sepete eklendi ✓",
      addFavorite: "Favorilere ekle",
      removeFavorite: "Favorilerden çıkar",
      discountBadge: "%{n} indirim",
      inStock: "Stokta var",
      outOfStock: "Tükendi",
      outOfStockNote: "Şu anda stokta yok — ne zaman geleceğini WhatsApp'tan sorabilirsiniz.",
      askAboutProduct: "WhatsApp'tan sor",
      shareProduct: "Ürünü paylaş",
      shareCopied: "Ürün bağlantısı kopyalandı ✓",
      orderThisProduct: "Bu ürünü WhatsApp'tan sipariş et",
      backToProducts: "Ürünlere dön",
      productCode: "Ürün kodu",
      relatedTitle: "Bunlar da ilginizi çekebilir",
      closeLabel: "Kapat",
      imagePreview: "Ürün görseli önizleme",

      offersEyebrow: "BU AY",
      offersTitle: "Seçili ürünlerde gerçek indirim",
      offersText: "İndirimli ve indirimsiz fiyatı açıkça gösteriyoruz; gizli ücret veya KDV sürprizi yok.",
      orderWhatsApp: "WhatsApp'tan sipariş ver",

      contactEyebrow: "MÜŞTERİ HİZMETLERİ",
      contactTitle: "Doğrudan sipariş verin veya sorun",
      contactText: "Ekibimiz çalışma saatlerinde WhatsApp'tan dakikalar içinde yanıt verir.",

      cartEyebrow: "SİPARİŞİNİZ",
      cartTitle: "Sepetim",
      cartEmpty: "Sepetiniz boş. Siparişe başlamak için bir ürün ekleyin.",
      cartEmptyAlert: "Önce sepete bir ürün ekleyin.",
      cartTotal: "Toplam",
      cartCheckout: "WhatsApp'tan siparişi tamamla",
      cartItemRemove: "Ürünü kaldır",
      cartIncrease: "Adedi artır",
      cartDecrease: "Adedi azalt",
      cartNote: "Siparişi ve teslimatı WhatsApp üzerinden onaylarsınız.",

      orderIntro: "Merhaba Syriatech, sipariş vermek istiyorum:",
      orderSingleIntro: "Merhaba Syriatech, bu ürün hakkında bilgi almak istiyorum:",
      orderTotal: "Toplam:",
      orderLink: "Ürün bağlantısı:",

      footerAbout: "Yetkili distribütörlerden orijinal teknoloji ürünleri sunan bağımsız Suriye mağazası.",
      footerProducts: "Popüler kategoriler",
      footerHelp: "Hızlı bağlantılar",
      footerBrands: "Markalar",
      footerAdmin: "Mağaza yönetimi",
      footerNote: "Tüm ürün adları ve markalar sahiplerine aittir.",
      footerRights: "© {year} Syriatech Store",


      admin: {
        title: "Mağaza yönetimi",
        loginHint: "Devam etmek için yönetici şifresini girin",
        password: "Şifre",
        login: "Giriş yap",
        loggingIn: "Giriş yapılıyor...",
        logout: "Çıkış",
        viewStore: "Mağazayı gör",
        tabProducts: "Ürünler",
        tabSettings: "Ayarlar",
        tabHelp: "Nasıl kullanılır",
        searchPlaceholder: "Ürün adı veya markaya göre ara...",
        allCategories: "Tüm kategoriler",
        allBrands: "Tüm markalar",
        addProduct: "Yeni ürün ekle",
        listInfo: "{n} ürün — düzenlemek için ürüne dokunun",
        listInfoFiltered: "{total} üründen {n} tanesi — düzenlemek için ürüne dokunun",
        noResults: "Aramanıza uygun ürün yok.",
        tagAdded: "Eklendi",
        tagEdited: "Düzenlendi",
        tagAutoImage: "Otomatik görsel",
        tagOutOfStock: "Tükendi",
        deletedTitle: "Silinen ürünler ({n}) — geri alabilirsiniz",
        restore: "Geri al",
        editTitle: "Ürünü düzenle",
        newTitle: "Yeni ürün ekle",
        fieldName: "Ürün adı",
        fieldBrand: "Marka",
        fieldCategory: "Kategori",
        fieldPrice: "Güncel fiyat ($)",
        fieldOldPrice: "İndirimsiz fiyat ($)",
        optional: "isteğe bağlı",
        fieldBadge: "Görsel üzerindeki etiket",
        badgeHint: "Örneğin Yeni veya Çok satan. Boş bırakırsanız indirim oranı otomatik görünür",
        fieldDescAr: "Arapça açıklama",
        fieldDescEn: "İngilizce açıklama",
        fieldDescTr: "Türkçe açıklama",
        descHint: "Boş bırakırsanız kategoriye göre genel bir açıklama görünür",
        fieldStock: "Ürün stokta var",
        stockHint: "İşareti kaldırırsanız ürün tükendi olarak görünür ve sepete eklenemez",
        pickImage: "Bu cihazdan fotoğraf seç",
        removeImage: "Fotoğrafı kaldır",
        imageUrl: "Veya bir görsel bağlantısı yapıştırın",
        preparingImage: "Fotoğraf hazırlanıyor...",
        uploadingImage: "Fotoğraf yükleniyor...",
        imageUploaded: "Fotoğraf yüklendi ✓ ürüne işlemek için Kaydet'e basın.",
        imageRemoved: "Fotoğraf kaldırıldı. Değişikliği uygulamak için Kaydet'e basın.",
        uploadFailed: "Fotoğraf yüklenemedi: {error}",
        unsupportedFile: "Bu görsel biçimi desteklenmiyor. JPG veya PNG kullanın",
        imageTooBig: "Fotoğraf çok büyük (10MB üzeri)",
        save: "Kaydet",
        saving: "Kaydediliyor...",
        cancel: "Vazgeç",
        working: "Bir saniye...",
        revert: "Orijinal bilgileri geri yükle",
        deleteProduct: "Ürünü sil",
        saved: "Kaydedildi ✓ değişiklik mağazada yayında",
        deleted: "Ürün mağazadan kaldırıldı",
        restored: "Ürün mağazaya geri alındı",
        reverted: "Orijinal bilgiler geri yüklendi",
        settingsSaved: "Ayarlar kaydedildi ✓",
        discountHint: "%{n} indirim, eski fiyat üstü çizili olarak görünecek",
        discountWarn: "İndirimsiz fiyat, güncel fiyattan yüksek olmalı",
        confirmDelete: "\"{name}\" mağazadan silinsin mi? Silinenler listesinden geri alabilirsiniz.",
        confirmRevert: "Bu ürün orijinal bilgilerine döndürülsün mü?",
        confirmLeave: "Kaydedilmemiş değişiklikleriniz var. Kaydetmeden çıkılsın mı?",
        needName: "Ürün adını yazın",
        needBrand: "Markayı yazın",
        needPrice: "Güncel fiyatı yazın",
        waitUpload: "Fotoğraf yüklenene kadar bekleyin",
        settingsTitle: "İletişim bilgileri",
        settingsHint: "Mağazada görünür; müşteri siparişleri buraya WhatsApp'tan gelir.",
        fieldWhatsapp: "WhatsApp numarası",
        whatsappHint: "Ülke koduyla, sadece rakam — örnek: 963949951985",
        fieldEmail: "E-posta adresi",
        saveSettings: "Ayarları kaydet",
        helpTitle: "Nasıl kullanılır",
        help1: "Ürün düzenleme: listeden ürüne dokunun, değiştirmek istediğinizi değiştirin ve Kaydet'e basın.",
        help2: "Fotoğraf değiştirme: ürünü açın, Bu cihazdan fotoğraf seç'e basın, yüklendi mesajını bekleyin ve Kaydet'e basın.",
        help3: "İndirim: yeni fiyatı Güncel fiyat, eskisini İndirimsiz fiyat alanına yazın; oran otomatik hesaplanır.",
        help4: "Stok bitti: Ürün stokta var işaretini kaldırın; müşteri ürünü tükendi olarak görür ve WhatsApp'tan sorabilir.",
        help5: "Ürün ekleme: Yeni ürün ekle'ye basın ve bilgileri doldurun.",
        help6: "Silme ve geri alma: silmek kalıcı değildir, sayfanın altındaki silinenler listesinde bulursunuz.",
        helpNote: "Her değişiklik kaydettikten hemen sonra mağazada yayına girer.",
        sessionExpired: "Oturum sona erdi, lütfen tekrar giriş yapın",
        connectionError: "Sunucuya ulaşılamadı, bağlantınızı kontrol edip tekrar deneyin",
        genericError: "Bir hata oluştu, lütfen tekrar deneyin"
      },
      error: {
        missing_env: "Vercel ayarlarında ADMIN_PASSWORD ve ADMIN_SECRET tanımlı değil",
        invalid_password: "Şifre yanlış",
        unauthorized: "Lütfen giriş yapın",
        product_required: "Ürün bilgileri eksik",
        name_required: "Ürün adı zorunlu",
        invalid_price: "Fiyat geçerli değil",
        invalid_category: "Kategori geçerli değil",
        invalid_image: "Görsel bağlantısı geçerli değil",
        invalid_id: "Ürün numarası geçerli değil",
        invalid_whatsapp: "WhatsApp numarası geçersiz — ülke koduyla yazın, örnek: 963949951985",
        invalid_email: "E-posta adresi geçerli değil",
        unsupported_image: "Görsel biçimi desteklenmiyor. JPG, PNG veya WEBP kullanın",
        image_too_large: "Görsel 10MB'tan küçük olmalı",
        corrupt_state: "Mağaza veri dosyası bozuk, hiçbir değişiklik kaydedilmedi",
        unknown_action: "Bilinmeyen işlem",
        server_error: "Sunucu hatası, lütfen tekrar deneyin"
      },
      category: {
        "power-bank": "Powerbank", charger: "Şarj cihazları", wireless: "Kablosuz şarj", cables: "Kablolar",
        "hubs-docks": "Hub ve dock", power: "Masaüstü şarj istasyonu", car: "Araç şarjı",
        audio: "Ses ve kulaklık", security: "Kamera ve güvenlik", "smart-home": "Akıllı ev",
        projector: "Projeksiyon", solar: "Taşınabilir ve solar enerji"
      },
      categoryDesc: {
        "power-bank": "Gün boyu şarjda kalmanızı sağlayan orijinal {brand} powerbank.",
        charger: "Cihazlarınızı hızlı ve güvenle dolduran orijinal {brand} şarj cihazı.",
        wireless: "{brand} kablosuz şarj: bırakın, kablosuz dolsun.",
        cables: "Tam hızda şarj ve veri aktarımı için dayanıklı orijinal {brand} kablo.",
        "hubs-docks": "Dizüstünüze eksik portları kazandıran {brand} hub.",
        power: "Tüm masanızı tek prizden besleyen {brand} şarj istasyonu.",
        car: "Araç içi kullanım için tasarlanmış {brand} şarj aksesuarı.",
        audio: "Gürültü engelleme ve uzun pil ömrüyle {brand} ses deneyimi.",
        security: "Evinizi 7/24 izleyen {brand} güvenlik kamerası.",
        "smart-home": "Her gün zaman kazandıran {brand} akıllı ev cihazı.",
        projector: "Duvarınızı sinemaya çeviren {brand} projeksiyon cihazı.",
        solar: "Elektrik kesildiğinde sizi ayakta tutan {brand} enerji istasyonu."
      },
      brandTagline: {
        Anker: "Şarj ve enerji · dünyanın çok satanı",
        UGREEN: "Her cihaz için kablo ve hub",
        Baseus: "Akıllı aksesuar, uygun fiyat",
        soundcore: "Kulaklık ve hoparlörler",
        eufy: "Güvenlik kamerası ve akıllı ev",
        Nebula: "Projeksiyon ve ev sineması",
        "Anker SOLIX": "Taşınabilir enerji ve solar panel",
        BLUETTI: "Ev ve iş için enerji istasyonları",
        EcoFlow: "Hızlı dolan yedek enerji"
      }
    }
  };

  const STORAGE_KEY = "syriatech_lang";
  const codes = languages.map(l => l.code);
  const fallback = codes[0];

  function normalize(code) {
    const value = String(code || "").toLowerCase();
    return codes.find(c => value === c || value.startsWith(c + "-")) || "";
  }
  function stored() {
    try { return normalize(localStorage.getItem(STORAGE_KEY)); } catch (e) { return ""; }
  }
  function detect() {
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]) || [];
    for (const item of list) { const code = normalize(item); if (code) return code; }
    return fallback;
  }
  let current = stored() || detect();

  function meta(code) { return languages.find(l => l.code === (code || current)) || languages[0]; }

  function lookup(code, key) {
    const parts = String(key).split(".");
    let node = dict[code];
    for (const part of parts) {
      if (!node || typeof node !== "object" || !(part in node)) return undefined;
      node = node[part];
    }
    return typeof node === "string" ? node : undefined;
  }

  // Missing keys render visibly so the language test catches them.
  function t(key, vars, code) {
    const lang = code || current;
    let value = lookup(lang, key);
    if (value === undefined) value = lookup(fallback, key);
    if (value === undefined) return "⟦" + key + "⟧";
    if (vars) {
      Object.keys(vars).forEach(name => {
        value = value.split("{" + name + "}").join(String(vars[name]));
      });
    }
    return value;
  }

  function set(code) {
    const next = normalize(code);
    if (!next) return current;
    current = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    return current;
  }

  // Fills every element marked with data-i18n / data-i18n-html / data-i18n-attr.
  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    scope.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    scope.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const [attr, key] = pair.split(":").map(s => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    if (scope === document) {
      const info = meta();
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir;
      const titleKey = document.documentElement.dataset.titleKey || "pageTitle";
      document.title = t(titleKey);
      const description = document.querySelector('meta[name="description"]');
      if (description) description.setAttribute("content", t("metaDescription"));
    }
  }

  window.I18N = {
    languages, dict, t, apply, set, normalize,
    get current() { return current; },
    meta, STORAGE_KEY
  };
})();
