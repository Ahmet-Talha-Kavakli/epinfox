import type { Dict } from "./core";

// Bayi API dokümanı (/api-docs) — TOC, başlıklar, paragraflar, açıklamalar.
// Kod örnekleri (CodeBlock curl/JSON/HTTP) çevrilmez. Prefix: apidocs.*
// t() interpolasyon desteklemez → kullanan yerde .replace("{name}", val).

export const tr: Dict = {
  // Hero
  "apidocs.hero.title": "{name} API",
  "apidocs.hero.desc":
    "Bayiler için REST API. Otomatik sipariş oluştur, bakiye sorgula, ürün fiyatlarını çek ve webhook'larla anlık bildirim al. Tüm istekler {base} üzerinden.",
  "apidocs.hero.cta": "API anahtarını yönet",

  // TOC
  "apidocs.toc.title": "İçindekiler",
  "apidocs.toc.intro": "Giriş",
  "apidocs.toc.auth": "Kimlik Doğrulama",
  "apidocs.toc.rate": "Rate Limit",
  "apidocs.toc.balance": "Bakiye",
  "apidocs.toc.products": "Ürünler",
  "apidocs.toc.ordersCreate": "Sipariş Oluştur",
  "apidocs.toc.ordersGet": "Sipariş Sorgula",
  "apidocs.toc.webhooks": "Webhook'lar",
  "apidocs.toc.errors": "Hata Kodları",

  // Giriş
  "apidocs.intro.title": "Giriş",
  "apidocs.intro.body":
    "{name} API'si, bayilerin kendi sistemlerinden otomatik sipariş vermesini sağlar. JSON tabanlı, REST mimarisindedir. Erişim için aktif bayilik ve bir API anahtarı gerekir.",
  "apidocs.intro.f1.t": "Güvenli",
  "apidocs.intro.f1.d": "Bearer token + IP whitelist",
  "apidocs.intro.f2.t": "Hızlı",
  "apidocs.intro.f2.d": "Anında teslim, düşük gecikme",
  "apidocs.intro.f3.t": "Webhook",
  "apidocs.intro.f3.d": "Sipariş durumunda anlık bildirim",

  // Kimlik Doğrulama
  "apidocs.auth.title": "Kimlik Doğrulama",
  "apidocs.auth.body1": "Her isteği",
  "apidocs.auth.body2": "başlığında API anahtarınla imzala. Anahtarı",
  "apidocs.auth.link": "API Ayarları",
  "apidocs.auth.body3":
    "sayfasından üretebilirsin. Anahtar yalnızca üretildiği anda tam görünür — güvenli sakla.",
  "apidocs.auth.alt1": "Alternatif olarak",
  "apidocs.auth.alt2": "başlığını da kullanabilirsin.",

  // Rate Limit
  "apidocs.rate.title": "Rate Limit",
  "apidocs.rate.body1": "Limit dakikada",
  "apidocs.rate.body1b": "60 istek",
  "apidocs.rate.body2": ". Aşılırsa",
  "apidocs.rate.body3": "döner ve yanıtta ne kadar bekleyeceğini söyleyen",
  "apidocs.rate.body4": "başlığı bulunur:",

  // Bakiye
  "apidocs.balance.title": "Bakiye Sorgula",
  "apidocs.balance.body":
    "Cüzdan bakiyeni, bayilik kademeni ve o kademeye karşılık gelen indirim yüzdesini döndürür.",

  // Ürünler
  "apidocs.products.title": "Ürünler",
  "apidocs.products.body1": "Satışa açık ürünleri varyantlarıyla birlikte listeler. Her varyantın",
  "apidocs.products.body2": "alanı, sipariş oluştururken kullanacağın",
  "apidocs.products.body3":
    "değeridir. Fiyatlara bayilik indirimin uygulanmış olarak gelir",

  // Sipariş Oluştur
  "apidocs.ordersCreate.title": "Sipariş Oluştur",
  "apidocs.ordersCreate.body1":
    "Yeni sipariş oluşturur; bakiyenden düşülür ve kod anında teslim edilir. Gövdede ürün varyantının",
  "apidocs.ordersCreate.body2": "(UUID) zorunludur — varyant kimliklerini",
  "apidocs.ordersCreate.link": "Ürünler",
  "apidocs.ordersCreate.body3": "uç noktasından alırsın. Opsiyonel",
  "apidocs.ordersCreate.body4": "kendi takip numarandır ve",
  "apidocs.ordersCreate.body4b": "idempotency",
  "apidocs.ordersCreate.body5":
    "sağlar: aynı ref ile gönderilen ikinci istek yeni sipariş açmaz, mevcut siparişi döndürür.",
  "apidocs.ordersCreate.warnLabel": "Önemli:",
  "apidocs.ordersCreate.warn1": "Bayi API yalnızca",
  "apidocs.ordersCreate.warnEm": "kod-teslim",
  "apidocs.ordersCreate.warn2":
    "(DB stoğundan satılan) ürünleri destekler. Hesaba yükleme (topup) veya dış sağlayıcı API'siyle teslim edilen ürünler",
  "apidocs.ordersCreate.warn3": "döner.",
  "apidocs.ordersCreate.idem1": "Aynı",
  "apidocs.ordersCreate.idem2": "tekrar gönderilirse yanıt",
  "apidocs.ordersCreate.idem3": "olur ve gövdeye",
  "apidocs.ordersCreate.idem4": "eklenir.",

  // Sipariş Sorgula
  "apidocs.ordersGet.title": "Sipariş Sorgula",
  "apidocs.ordersGet.body1":
    "Tek bir siparişin güncel durumunu ve teslim kodunu döndürür. Yalnız kendi (API ile oluşturduğun) siparişlerine erişebilirsin.",
  "apidocs.ordersGet.body2a":
    "API ile oluşturduğun siparişleri en yeniden eskiye listeler.",
  "apidocs.ordersGet.body2b": "(1–100, varsayılan 50) ve",
  "apidocs.ordersGet.body2c":
    "sorgu parametreleriyle sayfalama yapabilirsin. Liste yanıtında güvenlik gereği teslim kodu yer almaz — kodu görmek için detay uç noktasını kullan.",

  // Webhook'lar
  "apidocs.webhooks.title": "Webhook'lar",
  "apidocs.webhooks.body1a": "Sipariş kod-teslimle tamamlandığında, kayıtlı webhook adresine",
  "apidocs.webhooks.body1b": "isteği göndeririz. Adresini",
  "apidocs.webhooks.link": "API Ayarları",
  "apidocs.webhooks.body1c": "'ndan yönetebilir, test gönderimi yapabilirsin.",
  "apidocs.webhooks.body2": "Gönderdiğimiz başlıklar ve örnek gövde:",
  "apidocs.webhooks.note1": "İsteği",
  "apidocs.webhooks.note2": "ile yanıtla; aksi halde belirli aralıklarla yeniden deneriz.",

  // Hata Kodları
  "apidocs.errors.title": "Hata Kodları",
  "apidocs.errors.body1": "Hatalar standart HTTP kodları ve bir",
  "apidocs.errors.body2": "alanı ile döner.",
  "apidocs.errors.th.code": "Kod",
  "apidocs.errors.th.type": "Tip",
  "apidocs.errors.th.desc": "Açıklama",
  "apidocs.errors.e400": "Geçersiz JSON gövdesi veya sipariş kimliği.",
  "apidocs.errors.e401": "API anahtarı eksik veya geçersiz.",
  "apidocs.errors.e403": "İstek izin verilmeyen bir IP'den geldi.",
  "apidocs.errors.e402": "Cüzdan bakiyesi yetersiz (INSUFFICIENT_BALANCE).",
  "apidocs.errors.e404": "Kaynak (varyant/sipariş) bulunamadı.",
  "apidocs.errors.e409": "Ürün satışta değil ya da stok tükendi.",
  "apidocs.errors.e422": "İstek gövdesi geçersiz ya da ürün API'den satılamıyor.",
  "apidocs.errors.e429": "Çok fazla istek — rate limit aşıldı.",
  "apidocs.errors.e500": "Sunucu hatası, daha sonra tekrar dene.",
};

export const en: Dict = {
  "apidocs.hero.title": "{name} API",
  "apidocs.hero.desc":
    "REST API for resellers. Create orders automatically, query your balance, fetch product prices and get instant notifications via webhooks. All requests go through {base}.",
  "apidocs.hero.cta": "Manage API key",

  "apidocs.toc.title": "Contents",
  "apidocs.toc.intro": "Introduction",
  "apidocs.toc.auth": "Authentication",
  "apidocs.toc.rate": "Rate Limit",
  "apidocs.toc.balance": "Balance",
  "apidocs.toc.products": "Products",
  "apidocs.toc.ordersCreate": "Create Order",
  "apidocs.toc.ordersGet": "Query Order",
  "apidocs.toc.webhooks": "Webhooks",
  "apidocs.toc.errors": "Error Codes",

  "apidocs.intro.title": "Introduction",
  "apidocs.intro.body":
    "The {name} API lets resellers place orders automatically from their own systems. It is JSON-based and follows REST conventions. Access requires an active reseller account and an API key.",
  "apidocs.intro.f1.t": "Secure",
  "apidocs.intro.f1.d": "Bearer token + IP whitelist",
  "apidocs.intro.f2.t": "Fast",
  "apidocs.intro.f2.d": "Instant delivery, low latency",
  "apidocs.intro.f3.t": "Webhook",
  "apidocs.intro.f3.d": "Instant notification on order status",

  "apidocs.auth.title": "Authentication",
  "apidocs.auth.body1": "Sign every request with your API key in the",
  "apidocs.auth.body2": "header. You can generate the key from the",
  "apidocs.auth.link": "API Settings",
  "apidocs.auth.body3":
    "page. The key is only shown in full at the moment it is generated — store it securely.",
  "apidocs.auth.alt1": "Alternatively you can use the",
  "apidocs.auth.alt2": "header.",

  "apidocs.rate.title": "Rate Limit",
  "apidocs.rate.body1": "The limit is",
  "apidocs.rate.body1b": "60 requests",
  "apidocs.rate.body2": "per minute. When exceeded,",
  "apidocs.rate.body3": "is returned, and the response includes a",
  "apidocs.rate.body4": "header telling you how long to wait:",

  "apidocs.balance.title": "Query Balance",
  "apidocs.balance.body":
    "Returns your wallet balance, reseller tier and the discount percentage that corresponds to that tier.",

  "apidocs.products.title": "Products",
  "apidocs.products.body1":
    "Lists products available for sale together with their variants. Each variant's",
  "apidocs.products.body2": "field is the",
  "apidocs.products.body3":
    "value you use when creating an order. Prices already include your reseller discount",

  "apidocs.ordersCreate.title": "Create Order",
  "apidocs.ordersCreate.body1":
    "Creates a new order; it is charged to your balance and the code is delivered instantly. The product variant's",
  "apidocs.ordersCreate.body2": "(UUID) is required in the body — you get variant IDs from the",
  "apidocs.ordersCreate.link": "Products",
  "apidocs.ordersCreate.body3": "endpoint. The optional",
  "apidocs.ordersCreate.body4": "is your own tracking number and provides",
  "apidocs.ordersCreate.body4b": "idempotency",
  "apidocs.ordersCreate.body5":
    ": a second request sent with the same ref does not open a new order, it returns the existing one.",
  "apidocs.ordersCreate.warnLabel": "Important:",
  "apidocs.ordersCreate.warn1": "The reseller API only supports",
  "apidocs.ordersCreate.warnEm": "code-delivery",
  "apidocs.ordersCreate.warn2":
    "products (sold from DB stock). Products delivered via account top-up (topup) or an external provider API return",
  "apidocs.ordersCreate.warn3": ".",
  "apidocs.ordersCreate.idem1": "If the same",
  "apidocs.ordersCreate.idem2": "is sent again, the response is",
  "apidocs.ordersCreate.idem3": "and the body includes",
  "apidocs.ordersCreate.idem4": ".",

  "apidocs.ordersGet.title": "Query Order",
  "apidocs.ordersGet.body1":
    "Returns the current status and delivery code of a single order. You can only access your own orders (those you created via the API).",
  "apidocs.ordersGet.body2a":
    "Lists the orders you created via the API, newest first.",
  "apidocs.ordersGet.body2b": "(1–100, default 50) and",
  "apidocs.ordersGet.body2c":
    "query parameters let you paginate. For security, the list response does not include the delivery code — use the detail endpoint to see the code.",

  "apidocs.webhooks.title": "Webhooks",
  "apidocs.webhooks.body1a": "When an order is completed with code delivery, we send a",
  "apidocs.webhooks.body1b": "request to your registered webhook address. You can manage the address from",
  "apidocs.webhooks.link": "API Settings",
  "apidocs.webhooks.body1c": "and send a test request.",
  "apidocs.webhooks.body2": "The headers we send and a sample body:",
  "apidocs.webhooks.note1": "Respond to the request with",
  "apidocs.webhooks.note2": "; otherwise we retry at regular intervals.",

  "apidocs.errors.title": "Error Codes",
  "apidocs.errors.body1": "Errors are returned with standard HTTP codes and an",
  "apidocs.errors.body2": "field.",
  "apidocs.errors.th.code": "Code",
  "apidocs.errors.th.type": "Type",
  "apidocs.errors.th.desc": "Description",
  "apidocs.errors.e400": "Invalid JSON body or order ID.",
  "apidocs.errors.e401": "API key missing or invalid.",
  "apidocs.errors.e403": "Request came from a disallowed IP.",
  "apidocs.errors.e402": "Insufficient wallet balance (INSUFFICIENT_BALANCE).",
  "apidocs.errors.e404": "Resource (variant/order) not found.",
  "apidocs.errors.e409": "Product is not on sale or out of stock.",
  "apidocs.errors.e422": "Invalid request body or product cannot be sold via the API.",
  "apidocs.errors.e429": "Too many requests — rate limit exceeded.",
  "apidocs.errors.e500": "Server error, try again later.",
};

export const de: Dict = {
  "apidocs.hero.title": "{name} API",
  "apidocs.hero.desc":
    "REST-API für Reseller. Erstelle Bestellungen automatisch, frage dein Guthaben ab, rufe Produktpreise ab und erhalte sofortige Benachrichtigungen über Webhooks. Alle Anfragen laufen über {base}.",
  "apidocs.hero.cta": "API-Schlüssel verwalten",

  "apidocs.toc.title": "Inhalt",
  "apidocs.toc.intro": "Einführung",
  "apidocs.toc.auth": "Authentifizierung",
  "apidocs.toc.rate": "Rate Limit",
  "apidocs.toc.balance": "Guthaben",
  "apidocs.toc.products": "Produkte",
  "apidocs.toc.ordersCreate": "Bestellung erstellen",
  "apidocs.toc.ordersGet": "Bestellung abfragen",
  "apidocs.toc.webhooks": "Webhooks",
  "apidocs.toc.errors": "Fehlercodes",

  "apidocs.intro.title": "Einführung",
  "apidocs.intro.body":
    "Die {name} API ermöglicht es Resellern, Bestellungen automatisch aus ihren eigenen Systemen aufzugeben. Sie ist JSON-basiert und folgt der REST-Architektur. Für den Zugriff sind ein aktives Reseller-Konto und ein API-Schlüssel erforderlich.",
  "apidocs.intro.f1.t": "Sicher",
  "apidocs.intro.f1.d": "Bearer-Token + IP-Whitelist",
  "apidocs.intro.f2.t": "Schnell",
  "apidocs.intro.f2.d": "Sofortige Lieferung, geringe Latenz",
  "apidocs.intro.f3.t": "Webhook",
  "apidocs.intro.f3.d": "Sofortige Benachrichtigung bei Bestellstatus",

  "apidocs.auth.title": "Authentifizierung",
  "apidocs.auth.body1": "Signiere jede Anfrage mit deinem API-Schlüssel im",
  "apidocs.auth.body2": "-Header. Den Schlüssel kannst du auf der Seite",
  "apidocs.auth.link": "API-Einstellungen",
  "apidocs.auth.body3":
    "erstellen. Der Schlüssel wird nur im Moment der Erstellung vollständig angezeigt — bewahre ihn sicher auf.",
  "apidocs.auth.alt1": "Alternativ kannst du auch den Header",
  "apidocs.auth.alt2": "verwenden.",

  "apidocs.rate.title": "Rate Limit",
  "apidocs.rate.body1": "Das Limit beträgt",
  "apidocs.rate.body1b": "60 Anfragen",
  "apidocs.rate.body2": "pro Minute. Bei Überschreitung wird",
  "apidocs.rate.body3": "zurückgegeben, und die Antwort enthält einen",
  "apidocs.rate.body4": "-Header, der dir sagt, wie lange du warten musst:",

  "apidocs.balance.title": "Guthaben abfragen",
  "apidocs.balance.body":
    "Gibt dein Wallet-Guthaben, deine Reseller-Stufe und den dieser Stufe entsprechenden Rabattprozentsatz zurück.",

  "apidocs.products.title": "Produkte",
  "apidocs.products.body1":
    "Listet die zum Verkauf stehenden Produkte mit ihren Varianten auf. Das",
  "apidocs.products.body2": "-Feld jeder Variante ist der",
  "apidocs.products.body3":
    "-Wert, den du beim Erstellen einer Bestellung verwendest. Die Preise enthalten bereits deinen Reseller-Rabatt",

  "apidocs.ordersCreate.title": "Bestellung erstellen",
  "apidocs.ordersCreate.body1":
    "Erstellt eine neue Bestellung; sie wird von deinem Guthaben abgezogen und der Code wird sofort geliefert. Im Body ist",
  "apidocs.ordersCreate.body2": "(UUID) der Produktvariante erforderlich — die Varianten-IDs erhältst du über den Endpunkt",
  "apidocs.ordersCreate.link": "Produkte",
  "apidocs.ordersCreate.body3": ". Die optionale",
  "apidocs.ordersCreate.body4": "ist deine eigene Tracking-Nummer und sorgt für",
  "apidocs.ordersCreate.body4b": "Idempotenz",
  "apidocs.ordersCreate.body5":
    ": Eine zweite Anfrage mit derselben Ref erstellt keine neue Bestellung, sondern gibt die bestehende zurück.",
  "apidocs.ordersCreate.warnLabel": "Wichtig:",
  "apidocs.ordersCreate.warn1": "Die Reseller-API unterstützt nur",
  "apidocs.ordersCreate.warnEm": "Code-Lieferung",
  "apidocs.ordersCreate.warn2":
    "-Produkte (aus DB-Bestand verkauft). Produkte, die per Konto-Aufladung (Topup) oder über eine externe Anbieter-API geliefert werden, geben",
  "apidocs.ordersCreate.warn3": "zurück.",
  "apidocs.ordersCreate.idem1": "Wird dieselbe",
  "apidocs.ordersCreate.idem2": "erneut gesendet, lautet die Antwort",
  "apidocs.ordersCreate.idem3": "und dem Body wird",
  "apidocs.ordersCreate.idem4": "hinzugefügt.",

  "apidocs.ordersGet.title": "Bestellung abfragen",
  "apidocs.ordersGet.body1":
    "Gibt den aktuellen Status und den Liefercode einer einzelnen Bestellung zurück. Du kannst nur auf deine eigenen (über die API erstellten) Bestellungen zugreifen.",
  "apidocs.ordersGet.body2a":
    "Listet die über die API erstellten Bestellungen, neueste zuerst.",
  "apidocs.ordersGet.body2b": "(1–100, Standard 50) und",
  "apidocs.ordersGet.body2c":
    "Abfrageparameter ermöglichen die Paginierung. Aus Sicherheitsgründen enthält die Listenantwort keinen Liefercode — verwende den Detail-Endpunkt, um den Code zu sehen.",

  "apidocs.webhooks.title": "Webhooks",
  "apidocs.webhooks.body1a": "Wenn eine Bestellung mit Code-Lieferung abgeschlossen wird, senden wir eine",
  "apidocs.webhooks.body1b": "-Anfrage an deine registrierte Webhook-Adresse. Die Adresse kannst du unter",
  "apidocs.webhooks.link": "API-Einstellungen",
  "apidocs.webhooks.body1c": "verwalten und eine Testsendung durchführen.",
  "apidocs.webhooks.body2": "Die von uns gesendeten Header und ein Beispiel-Body:",
  "apidocs.webhooks.note1": "Beantworte die Anfrage mit",
  "apidocs.webhooks.note2": "; andernfalls versuchen wir es in regelmäßigen Abständen erneut.",

  "apidocs.errors.title": "Fehlercodes",
  "apidocs.errors.body1": "Fehler werden mit Standard-HTTP-Codes und einem",
  "apidocs.errors.body2": "-Feld zurückgegeben.",
  "apidocs.errors.th.code": "Code",
  "apidocs.errors.th.type": "Typ",
  "apidocs.errors.th.desc": "Beschreibung",
  "apidocs.errors.e400": "Ungültiger JSON-Body oder Bestell-ID.",
  "apidocs.errors.e401": "API-Schlüssel fehlt oder ungültig.",
  "apidocs.errors.e403": "Anfrage kam von einer nicht erlaubten IP.",
  "apidocs.errors.e402": "Unzureichendes Wallet-Guthaben (INSUFFICIENT_BALANCE).",
  "apidocs.errors.e404": "Ressource (Variante/Bestellung) nicht gefunden.",
  "apidocs.errors.e409": "Produkt ist nicht im Verkauf oder ausverkauft.",
  "apidocs.errors.e422": "Ungültiger Anfrage-Body oder Produkt kann nicht über die API verkauft werden.",
  "apidocs.errors.e429": "Zu viele Anfragen — Rate Limit überschritten.",
  "apidocs.errors.e500": "Serverfehler, versuche es später erneut.",
};

export const ar: Dict = {
  "apidocs.hero.title": "{name} API",
  "apidocs.hero.desc":
    "واجهة برمجة تطبيقات REST للموزّعين. أنشئ الطلبات تلقائياً، واستعلم عن رصيدك، واجلب أسعار المنتجات، واحصل على إشعارات فورية عبر الـ webhooks. جميع الطلبات تمر عبر {base}.",
  "apidocs.hero.cta": "إدارة مفتاح API",

  "apidocs.toc.title": "المحتويات",
  "apidocs.toc.intro": "مقدمة",
  "apidocs.toc.auth": "المصادقة",
  "apidocs.toc.rate": "حد المعدّل",
  "apidocs.toc.balance": "الرصيد",
  "apidocs.toc.products": "المنتجات",
  "apidocs.toc.ordersCreate": "إنشاء طلب",
  "apidocs.toc.ordersGet": "الاستعلام عن طلب",
  "apidocs.toc.webhooks": "Webhooks",
  "apidocs.toc.errors": "رموز الأخطاء",

  "apidocs.intro.title": "مقدمة",
  "apidocs.intro.body":
    "تتيح واجهة {name} API للموزّعين تقديم الطلبات تلقائياً من أنظمتهم الخاصة. وهي قائمة على JSON وتتبع بنية REST. يتطلب الوصول حساب موزّع نشطاً ومفتاح API.",
  "apidocs.intro.f1.t": "آمن",
  "apidocs.intro.f1.d": "Bearer token + قائمة IP المسموح بها",
  "apidocs.intro.f2.t": "سريع",
  "apidocs.intro.f2.d": "تسليم فوري، زمن استجابة منخفض",
  "apidocs.intro.f3.t": "Webhook",
  "apidocs.intro.f3.d": "إشعار فوري عند تغيّر حالة الطلب",

  "apidocs.auth.title": "المصادقة",
  "apidocs.auth.body1": "وقّع كل طلب بمفتاح API الخاص بك في ترويسة",
  "apidocs.auth.body2": ". يمكنك إنشاء المفتاح من صفحة",
  "apidocs.auth.link": "إعدادات API",
  "apidocs.auth.body3":
    ". يظهر المفتاح كاملاً فقط لحظة إنشائه — احتفظ به بأمان.",
  "apidocs.auth.alt1": "بدلاً من ذلك يمكنك استخدام ترويسة",
  "apidocs.auth.alt2": "أيضاً.",

  "apidocs.rate.title": "حد المعدّل",
  "apidocs.rate.body1": "الحد هو",
  "apidocs.rate.body1b": "60 طلباً",
  "apidocs.rate.body2": "في الدقيقة. عند تجاوزه يُعاد",
  "apidocs.rate.body3": "وتتضمن الاستجابة ترويسة",
  "apidocs.rate.body4": "تخبرك بالمدة التي يجب الانتظار فيها:",

  "apidocs.balance.title": "الاستعلام عن الرصيد",
  "apidocs.balance.body":
    "يعيد رصيد محفظتك ومستوى الموزّع الخاص بك ونسبة الخصم المقابلة لذلك المستوى.",

  "apidocs.products.title": "المنتجات",
  "apidocs.products.body1":
    "يسرد المنتجات المتاحة للبيع مع متغيّراتها. حقل",
  "apidocs.products.body2": "لكل متغيّر هو قيمة",
  "apidocs.products.body3":
    "التي تستخدمها عند إنشاء طلب. الأسعار تتضمن خصم الموزّع الخاص بك مسبقاً",

  "apidocs.ordersCreate.title": "إنشاء طلب",
  "apidocs.ordersCreate.body1":
    "ينشئ طلباً جديداً؛ يُخصم من رصيدك ويُسلَّم الرمز فوراً. حقل",
  "apidocs.ordersCreate.body2": "(UUID) لمتغيّر المنتج مطلوب في الجسم — تحصل على معرّفات المتغيّرات من نقطة النهاية",
  "apidocs.ordersCreate.link": "المنتجات",
  "apidocs.ordersCreate.body3": ". الحقل الاختياري",
  "apidocs.ordersCreate.body4": "هو رقم التتبّع الخاص بك ويوفّر",
  "apidocs.ordersCreate.body4b": "الحَيدة (idempotency)",
  "apidocs.ordersCreate.body5":
    ": الطلب الثاني المُرسَل بنفس الـ ref لا ينشئ طلباً جديداً، بل يعيد الطلب الموجود.",
  "apidocs.ordersCreate.warnLabel": "مهم:",
  "apidocs.ordersCreate.warn1": "واجهة الموزّع تدعم فقط منتجات",
  "apidocs.ordersCreate.warnEm": "التسليم بالرمز",
  "apidocs.ordersCreate.warn2":
    "(المباعة من مخزون قاعدة البيانات). المنتجات المُسلَّمة عبر الشحن إلى الحساب (topup) أو عبر واجهة مزوّد خارجي تُعيد",
  "apidocs.ordersCreate.warn3": ".",
  "apidocs.ordersCreate.idem1": "إذا أُرسِلت نفس",
  "apidocs.ordersCreate.idem2": "مرة أخرى، تكون الاستجابة",
  "apidocs.ordersCreate.idem3": "ويُضاف إلى الجسم",
  "apidocs.ordersCreate.idem4": ".",

  "apidocs.ordersGet.title": "الاستعلام عن طلب",
  "apidocs.ordersGet.body1":
    "يعيد الحالة الحالية ورمز التسليم لطلب واحد. يمكنك الوصول فقط إلى طلباتك (التي أنشأتها عبر API).",
  "apidocs.ordersGet.body2a":
    "يسرد الطلبات التي أنشأتها عبر API، من الأحدث إلى الأقدم.",
  "apidocs.ordersGet.body2b": "(1–100، الافتراضي 50) و",
  "apidocs.ordersGet.body2c":
    "معاملات الاستعلام تتيح لك التقسيم إلى صفحات. لأسباب أمنية، لا تتضمن استجابة القائمة رمز التسليم — استخدم نقطة نهاية التفاصيل لرؤية الرمز.",

  "apidocs.webhooks.title": "Webhooks",
  "apidocs.webhooks.body1a": "عند اكتمال طلب بالتسليم بالرمز، نرسل طلب",
  "apidocs.webhooks.body1b": "إلى عنوان الـ webhook المسجَّل لديك. يمكنك إدارة العنوان من",
  "apidocs.webhooks.link": "إعدادات API",
  "apidocs.webhooks.body1c": "وإجراء إرسال تجريبي.",
  "apidocs.webhooks.body2": "الترويسات التي نرسلها وجسم نموذجي:",
  "apidocs.webhooks.note1": "أجب على الطلب بـ",
  "apidocs.webhooks.note2": "؛ وإلا فسنعيد المحاولة على فترات منتظمة.",

  "apidocs.errors.title": "رموز الأخطاء",
  "apidocs.errors.body1": "تُعاد الأخطاء برموز HTTP القياسية وحقل",
  "apidocs.errors.body2": ".",
  "apidocs.errors.th.code": "الرمز",
  "apidocs.errors.th.type": "النوع",
  "apidocs.errors.th.desc": "الوصف",
  "apidocs.errors.e400": "جسم JSON غير صالح أو معرّف طلب غير صالح.",
  "apidocs.errors.e401": "مفتاح API مفقود أو غير صالح.",
  "apidocs.errors.e403": "وصل الطلب من عنوان IP غير مسموح به.",
  "apidocs.errors.e402": "رصيد المحفظة غير كافٍ (INSUFFICIENT_BALANCE).",
  "apidocs.errors.e404": "المورد (المتغيّر/الطلب) غير موجود.",
  "apidocs.errors.e409": "المنتج ليس معروضاً للبيع أو نفد من المخزون.",
  "apidocs.errors.e422": "جسم الطلب غير صالح أو لا يمكن بيع المنتج عبر API.",
  "apidocs.errors.e429": "طلبات كثيرة جداً — تم تجاوز حد المعدّل.",
  "apidocs.errors.e500": "خطأ في الخادم، حاول مرة أخرى لاحقاً.",
};

export const ru: Dict = {
  "apidocs.hero.title": "{name} API",
  "apidocs.hero.desc":
    "REST API для реселлеров. Создавайте заказы автоматически, запрашивайте баланс, получайте цены товаров и мгновенные уведомления через webhooks. Все запросы идут через {base}.",
  "apidocs.hero.cta": "Управление API-ключом",

  "apidocs.toc.title": "Содержание",
  "apidocs.toc.intro": "Введение",
  "apidocs.toc.auth": "Аутентификация",
  "apidocs.toc.rate": "Ограничение запросов",
  "apidocs.toc.balance": "Баланс",
  "apidocs.toc.products": "Товары",
  "apidocs.toc.ordersCreate": "Создать заказ",
  "apidocs.toc.ordersGet": "Запрос заказа",
  "apidocs.toc.webhooks": "Webhooks",
  "apidocs.toc.errors": "Коды ошибок",

  "apidocs.intro.title": "Введение",
  "apidocs.intro.body":
    "API {name} позволяет реселлерам создавать заказы автоматически из собственных систем. Он основан на JSON и следует архитектуре REST. Для доступа требуется активный реселлерский аккаунт и API-ключ.",
  "apidocs.intro.f1.t": "Безопасно",
  "apidocs.intro.f1.d": "Bearer token + белый список IP",
  "apidocs.intro.f2.t": "Быстро",
  "apidocs.intro.f2.d": "Мгновенная доставка, низкая задержка",
  "apidocs.intro.f3.t": "Webhook",
  "apidocs.intro.f3.d": "Мгновенное уведомление о статусе заказа",

  "apidocs.auth.title": "Аутентификация",
  "apidocs.auth.body1": "Подписывайте каждый запрос своим API-ключом в заголовке",
  "apidocs.auth.body2": ". Ключ можно сгенерировать на странице",
  "apidocs.auth.link": "Настройки API",
  "apidocs.auth.body3":
    ". Ключ полностью отображается только в момент создания — храните его в безопасности.",
  "apidocs.auth.alt1": "В качестве альтернативы можно использовать заголовок",
  "apidocs.auth.alt2": ".",

  "apidocs.rate.title": "Ограничение запросов",
  "apidocs.rate.body1": "Лимит —",
  "apidocs.rate.body1b": "60 запросов",
  "apidocs.rate.body2": "в минуту. При превышении возвращается",
  "apidocs.rate.body3": ", и в ответе есть заголовок",
  "apidocs.rate.body4": ", сообщающий, сколько нужно подождать:",

  "apidocs.balance.title": "Запрос баланса",
  "apidocs.balance.body":
    "Возвращает баланс вашего кошелька, реселлерский уровень и процент скидки, соответствующий этому уровню.",

  "apidocs.products.title": "Товары",
  "apidocs.products.body1":
    "Перечисляет доступные для продажи товары вместе с их вариантами. Поле",
  "apidocs.products.body2": "каждого варианта — это значение",
  "apidocs.products.body3":
    ", которое вы используете при создании заказа. Цены уже включают вашу реселлерскую скидку",

  "apidocs.ordersCreate.title": "Создать заказ",
  "apidocs.ordersCreate.body1":
    "Создаёт новый заказ; он списывается с баланса, а код доставляется мгновенно. В теле обязательно",
  "apidocs.ordersCreate.body2": "(UUID) варианта товара — идентификаторы вариантов вы получаете из эндпоинта",
  "apidocs.ordersCreate.link": "Товары",
  "apidocs.ordersCreate.body3": ". Необязательный",
  "apidocs.ordersCreate.body4": "— это ваш собственный номер отслеживания, обеспечивающий",
  "apidocs.ordersCreate.body4b": "идемпотентность",
  "apidocs.ordersCreate.body5":
    ": второй запрос с тем же ref не создаёт новый заказ, а возвращает существующий.",
  "apidocs.ordersCreate.warnLabel": "Важно:",
  "apidocs.ordersCreate.warn1": "Реселлерский API поддерживает только товары с",
  "apidocs.ordersCreate.warnEm": "доставкой кодом",
  "apidocs.ordersCreate.warn2":
    "(продаваемые со склада БД). Товары, доставляемые через пополнение аккаунта (topup) или API внешнего поставщика, возвращают",
  "apidocs.ordersCreate.warn3": ".",
  "apidocs.ordersCreate.idem1": "Если тот же",
  "apidocs.ordersCreate.idem2": "отправлен снова, ответ будет",
  "apidocs.ordersCreate.idem3": ", а в тело добавляется",
  "apidocs.ordersCreate.idem4": ".",

  "apidocs.ordersGet.title": "Запрос заказа",
  "apidocs.ordersGet.body1":
    "Возвращает текущий статус и код доставки одного заказа. Вы можете получить доступ только к своим заказам (созданным через API).",
  "apidocs.ordersGet.body2a":
    "Перечисляет созданные вами через API заказы, от новых к старым.",
  "apidocs.ordersGet.body2b": "(1–100, по умолчанию 50) и",
  "apidocs.ordersGet.body2c":
    "параметры запроса позволяют выполнять постраничную навигацию. В целях безопасности ответ списка не содержит код доставки — используйте эндпоинт деталей, чтобы увидеть код.",

  "apidocs.webhooks.title": "Webhooks",
  "apidocs.webhooks.body1a": "Когда заказ завершается доставкой кода, мы отправляем",
  "apidocs.webhooks.body1b": "запрос на ваш зарегистрированный адрес webhook. Адрес можно настроить в",
  "apidocs.webhooks.link": "Настройки API",
  "apidocs.webhooks.body1c": "и отправить тестовый запрос.",
  "apidocs.webhooks.body2": "Заголовки, которые мы отправляем, и пример тела:",
  "apidocs.webhooks.note1": "Ответьте на запрос кодом",
  "apidocs.webhooks.note2": "; иначе мы повторим попытку через определённые интервалы.",

  "apidocs.errors.title": "Коды ошибок",
  "apidocs.errors.body1": "Ошибки возвращаются со стандартными кодами HTTP и полем",
  "apidocs.errors.body2": ".",
  "apidocs.errors.th.code": "Код",
  "apidocs.errors.th.type": "Тип",
  "apidocs.errors.th.desc": "Описание",
  "apidocs.errors.e400": "Недопустимое тело JSON или идентификатор заказа.",
  "apidocs.errors.e401": "API-ключ отсутствует или недействителен.",
  "apidocs.errors.e403": "Запрос пришёл с недопустимого IP.",
  "apidocs.errors.e402": "Недостаточно средств на кошельке (INSUFFICIENT_BALANCE).",
  "apidocs.errors.e404": "Ресурс (вариант/заказ) не найден.",
  "apidocs.errors.e409": "Товар не в продаже или нет в наличии.",
  "apidocs.errors.e422": "Недопустимое тело запроса или товар нельзя продать через API.",
  "apidocs.errors.e429": "Слишком много запросов — превышен лимит.",
  "apidocs.errors.e500": "Ошибка сервера, повторите попытку позже.",
};
