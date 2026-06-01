// Statik içerik — Yardım Merkezi, Haberler, Etkinlikler.
// Hepsi soru-cevap / başlık-açıklama formatında. Değiştirmek için bu dosya düzenlenir.
//
// LOCALE: Bu dosya SAF VERİ kalır (server-only / next/headers ASLA import edilmez).
// Çeviriler aşağıdaki *_I18N overlay sözlüklerinde tutulur; getter'lar locale parametresi
// alır ve TR kaynağın üzerine ilgili dilin alanlarını biner (çeviri yoksa TR fallback).

import { type Locale, DEFAULT_LOCALE } from "@/lib/i18n/config";

export interface QA {
  q: string;
  a: string;
}

/** Overlay yardımcıları — boş/null çeviri TR kaynağı EZMEZ. */
function pick<T>(base: T, over: T | undefined | null): T {
  return over === undefined || over === null || over === ("" as unknown as T)
    ? base
    : over;
}

/** Ürün/marka sayfası: "Nasıl Kullanılır" adımları (ortak). */
export const HOW_TO_STEPS: string[] = [
  "Satın alma sonrası kodun anında “Siparişlerim” sayfasında görünür.",
  "Kodu kopyala (tek tıkla kopyalama mevcuttur).",
  "İlgili oyun/platformun resmi yükleme ekranına git.",
  "Kodu ilgili alana yapıştırıp onayla — bakiyen anında tanımlanır.",
];

/** Ürün/marka sayfası: genel SSS (ortak). */
export const PRODUCT_FAQ: QA[] = [
  {
    q: "Kodu ne zaman alırım?",
    a: "Ödeme bakiyenden düşüldüğü anda kod otomatik olarak hesabına tanımlanır. Genellikle birkaç saniye içinde “Siparişlerim” sayfasında görünür hâle gelir.",
  },
  {
    q: "Kodum çalışmazsa ne olur?",
    a: "Çok nadir görülse de bir kod kullanılamazsa 7/24 destek ekibimize ulaş. Sipariş numaranla birlikte ilet, inceleyip en kısa sürede yenisiyle değiştirelim.",
  },
  {
    q: "Hangi bölge için geçerli?",
    a: "Bu ürünler Türkiye bölgesi hesapları için satılır. Satın almadan önce oyun/platform hesabının bölgesini kontrol etmeni öneririz.",
  },
  {
    q: "İade alabilir miyim?",
    a: "Dijital kodlar teslim edilip görüntülendikten sonra, mesafeli satış mevzuatı gereği cayma hakkı kapsamı dışındadır. Görüntülenmemiş siparişler için destek ile iletişime geçebilirsin.",
  },
];

/** HOW_TO_STEPS çevirileri — index anahtarlı. */
const HOW_TO_STEPS_I18N: Partial<Record<Locale, Record<number, string>>> = {
  en: {
    0: "Right after purchase your code appears on the “My Orders” page instantly.",
    1: "Copy the code (one-click copy is available).",
    2: "Go to the official redemption screen of the relevant game/platform.",
    3: "Paste the code into the field and confirm — your balance is credited instantly.",
  },
  de: {
    0: "Direkt nach dem Kauf erscheint dein Code sofort auf der Seite „Meine Bestellungen“.",
    1: "Kopiere den Code (Kopieren mit einem Klick verfügbar).",
    2: "Gehe zum offiziellen Einlösebildschirm des jeweiligen Spiels/der Plattform.",
    3: "Füge den Code in das entsprechende Feld ein und bestätige — dein Guthaben wird sofort gutgeschrieben.",
  },
  ar: {
    0: "بعد الشراء مباشرةً يظهر الكود فورًا في صفحة «طلباتي».",
    1: "انسخ الكود (النسخ بنقرة واحدة متاح).",
    2: "انتقل إلى شاشة الاستبدال الرسمية للعبة/المنصة المعنية.",
    3: "الصق الكود في الحقل المخصص وأكّد — يُضاف رصيدك على الفور.",
  },
  ru: {
    0: "Сразу после покупки код мгновенно появляется на странице «Мои заказы».",
    1: "Скопируйте код (доступно копирование в один клик).",
    2: "Перейдите на официальный экран активации соответствующей игры/платформы.",
    3: "Вставьте код в нужное поле и подтвердите — баланс зачисляется мгновенно.",
  },
};

/** HOW_TO_STEPS'i locale'e göre döner (çeviri yoksa TR). */
export function getHowToSteps(locale: Locale = DEFAULT_LOCALE): string[] {
  const over = HOW_TO_STEPS_I18N[locale];
  if (!over) return HOW_TO_STEPS;
  return HOW_TO_STEPS.map((step, i) => pick(step, over[i]));
}

/** PRODUCT_FAQ çevirileri — index anahtarlı. */
const PRODUCT_FAQ_I18N: Partial<Record<Locale, Record<number, Partial<QA>>>> = {
  en: {
    0: {
      q: "When do I receive the code?",
      a: "The moment the payment is deducted from your balance, the code is automatically credited to your account. It usually appears on the “My Orders” page within a few seconds.",
    },
    1: {
      q: "What if my code doesn’t work?",
      a: "Although very rare, if a code can’t be used, reach out to our 24/7 support team. Send it along with your order number and we’ll review it and replace it as soon as possible.",
    },
    2: {
      q: "Which region is it valid for?",
      a: "These products are sold for Turkey-region accounts. We recommend checking your game/platform account region before purchasing.",
    },
    3: {
      q: "Can I get a refund?",
      a: "Once digital codes are delivered and viewed, they fall outside the right of withdrawal under distance-selling regulations. For orders that haven’t been viewed, you can contact support.",
    },
  },
  de: {
    0: {
      q: "Wann erhalte ich den Code?",
      a: "Sobald die Zahlung von deinem Guthaben abgebucht wird, wird der Code automatisch deinem Konto gutgeschrieben. Er erscheint in der Regel innerhalb weniger Sekunden auf der Seite „Meine Bestellungen“.",
    },
    1: {
      q: "Was, wenn mein Code nicht funktioniert?",
      a: "Sehr selten, aber falls ein Code nicht nutzbar ist, wende dich an unser 24/7-Support-Team. Sende ihn zusammen mit deiner Bestellnummer; wir prüfen ihn und ersetzen ihn schnellstmöglich.",
    },
    2: {
      q: "Für welche Region ist er gültig?",
      a: "Diese Produkte werden für Konten der Region Türkei verkauft. Wir empfehlen, vor dem Kauf die Region deines Spiel-/Plattformkontos zu prüfen.",
    },
    3: {
      q: "Kann ich eine Rückerstattung erhalten?",
      a: "Nach Lieferung und Ansicht digitaler Codes fallen diese gemäß den Fernabsatzvorschriften nicht unter das Widerrufsrecht. Für nicht angesehene Bestellungen kannst du den Support kontaktieren.",
    },
  },
  ar: {
    0: {
      q: "متى أستلم الكود؟",
      a: "بمجرد خصم المبلغ من رصيدك، يُضاف الكود تلقائيًا إلى حسابك. ويظهر عادةً خلال ثوانٍ في صفحة «طلباتي».",
    },
    1: {
      q: "ماذا لو لم يعمل الكود؟",
      a: "نادرًا جدًا، لكن إذا تعذّر استخدام الكود، تواصل مع فريق الدعم على مدار الساعة. أرسله مع رقم طلبك وسنراجعه ونستبدله في أسرع وقت ممكن.",
    },
    2: {
      q: "ما المنطقة الصالح لها؟",
      a: "تُباع هذه المنتجات لحسابات منطقة تركيا. ننصح بالتحقق من منطقة حساب اللعبة/المنصة قبل الشراء.",
    },
    3: {
      q: "هل يمكنني استرداد المبلغ؟",
      a: "بعد تسليم الأكواد الرقمية وعرضها، تخرج عن نطاق حق الانسحاب وفقًا لأنظمة البيع عن بُعد. للطلبات التي لم تُعرض بعد، يمكنك التواصل مع الدعم.",
    },
  },
  ru: {
    0: {
      q: "Когда я получу код?",
      a: "Как только оплата списывается с вашего баланса, код автоматически зачисляется на ваш аккаунт. Обычно он появляется на странице «Мои заказы» в течение нескольких секунд.",
    },
    1: {
      q: "Что если код не работает?",
      a: "Хотя это бывает крайне редко, если код не удаётся использовать, обратитесь в нашу круглосуточную поддержку. Отправьте его вместе с номером заказа — мы проверим и заменим его как можно скорее.",
    },
    2: {
      q: "Для какого региона он действителен?",
      a: "Эти товары продаются для аккаунтов региона Турция. Рекомендуем проверить регион вашего игрового/платформенного аккаунта перед покупкой.",
    },
    3: {
      q: "Могу ли я вернуть деньги?",
      a: "После доставки и просмотра цифровые коды не подпадают под право на отказ согласно правилам дистанционной продажи. По заказам, которые не были просмотрены, можно обратиться в поддержку.",
    },
  },
};

/** PRODUCT_FAQ'u locale'e göre döner (çeviri yoksa TR). */
export function getProductFaq(locale: Locale = DEFAULT_LOCALE): QA[] {
  const over = PRODUCT_FAQ_I18N[locale];
  if (!over) return PRODUCT_FAQ;
  return PRODUCT_FAQ.map((qa, i) => ({
    q: pick(qa.q, over[i]?.q),
    a: pick(qa.a, over[i]?.a),
  }));
}

export interface HelpSection {
  slug: string;
  title: string;
  icon: string; // phosphor ikon adı (sayfada eşlenir)
  /** Kategori görseli — public/help/ içindeki flat 3D illüstrasyon. Yoksa tone gradyan kullanılır. */
  image?: string;
  /** Görsel yoksa başlık bandı için renk tonu. */
  tone?: "brand" | "accent" | "success" | "danger" | "info" | "neutral";
  items: QA[];
}

/** Yardım Merkezi — konuya göre gruplanmış soru-cevaplar. */
export const HELP_SECTIONS: HelpSection[] = [
  {
    slug: "siparis-kod",
    title: "Sipariş & Kod Teslimi",
    icon: "Receipt",
    image: "/help/help-orders.png",
    items: [
      {
        q: "Satın aldığım kodu nereden görürüm?",
        a: "Ödeme tamamlandığı anda kodun “Siparişlerim” sayfasında görünür. Sipariş kartındaki “Kodu Göster” butonuna basarak kodu açabilir, kopyalayabilir veya .txt olarak indirebilirsin.",
      },
      {
        q: "Kod ne kadar sürede teslim edilir?",
        a: "Tüm kodlar otomatik ve anında teslim edilir. Bakiyenden ödeme düşüldüğü an kod hesabına tanımlanır; genellikle birkaç saniye sürer.",
      },
      {
        q: "Kodumu kaybedersem ne olur?",
        a: "Kodların hesabında şifreli olarak saklanır. “Siparişlerim” sayfasından istediğin zaman tekrar görüntüleyebilirsin; kaybolmaz.",
      },
      {
        q: "Kodum çalışmıyor, ne yapmalıyım?",
        a: "Önce bölgenin (Türkiye) ve platformun doğru olduğundan emin ol. Sorun devam ederse “Destek Taleplerim” üzerinden sipariş numaranla bize ulaş; inceleyip en kısa sürede çözüm sunarız.",
      },
      {
        q: "Geçmiş siparişlerimi nereden görürüm?",
        a: "Tüm siparişlerin “Siparişlerim” sayfasında tarih sırasıyla listelenir. Her sipariş kartından kodu yeniden görüntüleyebilir, ürün ve tutar detaylarını inceleyebilirsin.",
      },
      {
        q: "Fatura alabilir miyim?",
        a: "Evet. Yüklemelerine ve siparişlerine dair belgelerini “Faturalarım” sayfasından görüntüleyebilirsin. Kurumsal fatura için bilgilerini destek üzerinden iletebilirsin.",
      },
    ],
  },
  {
    slug: "cuzdan-odeme",
    title: "Cüzdan & Ödeme",
    icon: "Wallet",
    image: "/help/help-wallet.png",
    items: [
      {
        q: "Nasıl bakiye yüklerim?",
        a: "“Cüzdan” sayfasından bir tutar seç (veya özel tutar gir), ödeme yöntemini belirle ve “Yükle”ye bas. Yüklenen tutar anında bakiyene eklenir.",
      },
      {
        q: "Yükleme bonusu nedir?",
        a: "Belirli tutarların üzerinde yükleme yaptığında ekstra bakiye kazanırsın: 100₺ → +%2, 250₺ → +%4, 500₺ ve üzeri → +%6. Bonus, yükleme anında otomatik eklenir.",
      },
      {
        q: "Neden cüzdan kullanıyoruz?",
        a: "Cüzdan modeli sayesinde her alışverişte tekrar ödeme bilgisi girmene gerek kalmaz; bakiyenle tek tıkla, saniyeler içinde satın alırsın.",
      },
      {
        q: "Bakiyemi geri çekebilir miyim?",
        a: "Mağaza bakiyesi alışveriş içindir. Nakit iade talepleri ilgili mevzuat ve koşullar çerçevesinde destek ekibimizce değerlendirilir.",
      },
      {
        q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        a: "Bakiye yüklemelerinde yaygın kart ve dijital ödeme yöntemleri desteklenir. Kullanılabilir seçenekleri “Cüzdan” sayfasındaki yükleme ekranında görebilirsin.",
      },
      {
        q: "Ödemem güvenli mi?",
        a: "Tüm ödemeler SSL şifrelemesi ve 3D Secure ile korunur. Kart bilgilerin bizde saklanmaz; ödeme adımı güvenli altyapı üzerinden yürütülür.",
      },
    ],
  },
  {
    slug: "guvenlik",
    title: "Hesap & Güvenlik",
    icon: "ShieldCheck",
    image: "/help/help-security.png",
    items: [
      {
        q: "Hesabımı nasıl güvende tutarım?",
        a: "Güçlü ve benzersiz bir şifre kullan, şifreni kimseyle paylaşma. “Güvenlik” sayfasından şifreni dilediğin zaman değiştirebilirsin.",
      },
      {
        q: "E-posta adresimi değiştirebilir miyim?",
        a: "Evet. “Güvenlik” sayfasından yeni e-postanı ekleyip doğrulama kodunu girerek birincil e-postanı güncelleyebilirsin.",
      },
      {
        q: "Kodlarım güvende mi?",
        a: "Tüm kodlar veritabanında şifrelenmiş olarak saklanır ve yalnızca sen görüntüleyebilirsin. Ödeme altyapımız 3D Secure ve SSL ile korunur.",
      },
    ],
  },
  {
    slug: "referans",
    title: "Referans & Kampanyalar",
    icon: "Gift",
    image: "/help/help-referral.png",
    items: [
      {
        q: "Arkadaşımı nasıl davet ederim?",
        a: "“Referans” sayfasındaki davet kodunu veya linkini arkadaşınla paylaş. Arkadaşın bu linkle kayıt olup ilk yüklemesini yaptığında ikiniz de bonus bakiye kazanırsınız.",
      },
      {
        q: "Referans bonusu ne zaman yatar?",
        a: "Davet ettiğin kişi kayıt olup ilk bakiye yüklemesini tamamladığı anda bonus otomatik olarak iki tarafın da cüzdanına eklenir.",
      },
      {
        q: "Kaç kişiyi davet edebilirim?",
        a: "Davet sayısında bir üst sınır yoktur. Davet ettiğin her geçerli kullanıcı için bonus kazanmaya devam edersin; kademeli sistemde daha çok davet = daha yüksek ödül.",
      },
      {
        q: "Kampanya ve indirimleri nereden takip ederim?",
        a: "Aktif kampanyaları “Haberler” sayfasında ve ana sayfadaki kampanya alanında duyururuz. Önemli fırsatlar için bildirimlerini açık tutmanı öneririz.",
      },
    ],
  },
  {
    slug: "iade-cayma",
    title: "İade & Cayma Hakkı",
    icon: "ArrowUUpLeft",
    image: "/help/help-refund.webp",
    items: [
      {
        q: "Dijital kodlarda iade var mı?",
        a: "Dijital kodlar, teslim edilip görüntülendikten sonra mesafeli satış mevzuatı gereği cayma hakkı kapsamı dışındadır. Bu, kötüye kullanımı önlemek için sektör standardıdır.",
      },
      {
        q: "Henüz görüntülemediğim siparişi iade edebilir miyim?",
        a: "Kodu hiç görüntülemediysen, “Destek Taleplerim” üzerinden sipariş numaranla bize ulaş. Görüntülenmemiş ve kullanılmamış siparişler için durumu değerlendirip çözüm sunarız.",
      },
      {
        q: "Çalışmayan bir kod aldım, ne olur?",
        a: "Çok nadir olsa da bir kod kullanılamazsa, sipariş numaranla destek talebi aç. İnceleyip kodu doğrularız; sorun bizden kaynaklıysa yenisiyle değiştirir veya bakiye iadesi yaparız.",
      },
      {
        q: "İade onaylanırsa para nereye yatar?",
        a: "Onaylanan iadeler, aksi belirtilmedikçe mağaza cüzdanına bakiye olarak iade edilir; böylece bir sonraki alışverişinde anında kullanabilirsin.",
      },
    ],
  },
  {
    slug: "hesap-uyelik",
    title: "Hesap & Üyelik",
    icon: "UserCircle",
    image: "/help/help-account.webp",
    items: [
      {
        q: "Nasıl üye olurum?",
        a: "Sağ üstteki “Kayıt Ol” ile e-posta veya Google hesabınla saniyeler içinde üye olabilirsin. E-posta ile kayıtta doğrulama kodunu girdikten sonra hesabın hazır olur.",
      },
      {
        q: "Şifremi unuttum, ne yapmalıyım?",
        a: "Giriş ekranındaki “Şifremi unuttum” bağlantısına tıkla, e-posta adresini gir. Sana gönderdiğimiz bağlantı/koddan yeni şifreni belirleyebilirsin.",
      },
      {
        q: "İki adımlı doğrulamayı (2FA) nasıl açarım?",
        a: "“Güvenlik” sayfasından iki adımlı doğrulamayı etkinleştirebilirsin. Bu, hesabına giriş sırasında ek bir kod isteyerek güvenliğini önemli ölçüde artırır.",
      },
      {
        q: "Hesabımı kapatabilir miyim?",
        a: "Evet. Hesabını kapatmak istersen destek ekibiyle iletişime geç. Bakiyene ve aktif siparişlerine dair durumu birlikte değerlendirir, talebini işleme alırız.",
      },
    ],
  },
  {
    slug: "bayilik-api",
    title: "Bayilik & API",
    icon: "Plugs",
    image: "/help/help-reseller.webp",
    items: [
      {
        q: "Bayi olmak için ne gerekiyor?",
        a: "“Bayilik” sayfasından başvuru formunu doldurman yeterli. Başvurun onaylandığında bayi paneline, indirimli fiyatlara ve API erişimine sahip olursun.",
      },
      {
        q: "Bayilik avantajları neler?",
        a: "Onaylı bayiler kademeye göre indirimli alım fiyatları, otomatik sipariş için API erişimi ve webhook bildirimleri kullanır. Hacmin arttıkça kademen yükselir, indirimin artar.",
      },
      {
        q: "API’yi nasıl kullanırım?",
        a: "Bayi panelindeki “API Ayarları”ndan anahtarını üret, ardından REST uçlarımızla bakiye sorgula, ürün listele ve otomatik sipariş ver. Detaylar için API Dökümanı sayfamıza göz at.",
      },
      {
        q: "API’den her ürünü satabilir miyim?",
        a: "API üzerinden şu an yalnızca kod-teslim (stoktan satılan) ürünler verilebilir. Hesaba yükleme veya dış sağlayıcı ile teslim edilen ürünler API kapsamı dışındadır.",
      },
    ],
  },
];

/**
 * HELP_SECTIONS çevirileri — bölüm slug anahtarlı.
 * title çevrilir; items q/a index sırasına göre çevrilir.
 */
type HelpOverlay = {
  title?: string;
  items?: Record<number, Partial<QA>>;
};
const HELP_SECTIONS_I18N: Partial<Record<Locale, Record<string, HelpOverlay>>> = {
  en: {
    "siparis-kod": {
      title: "Orders & Code Delivery",
      items: {
        0: { q: "Where do I see the code I bought?", a: "The moment your payment is completed, your code appears on the “My Orders” page. Tap the “Show Code” button on the order card to reveal it, copy it, or download it as a .txt file." },
        1: { q: "How quickly is the code delivered?", a: "All codes are delivered automatically and instantly. The moment payment is deducted from your balance, the code is credited to your account; it usually takes a few seconds." },
        2: { q: "What if I lose my code?", a: "Your codes are stored encrypted in your account. You can view them again anytime from the “My Orders” page; they never get lost." },
        3: { q: "My code isn’t working, what should I do?", a: "First make sure the region (Turkey) and platform are correct. If the issue persists, reach out via “My Support Tickets” with your order number; we’ll review it and provide a solution quickly." },
        4: { q: "Where can I see my past orders?", a: "All your orders are listed by date on the “My Orders” page. From each order card you can re-view the code and check product and amount details." },
        5: { q: "Can I get an invoice?", a: "Yes. You can view documents for your top-ups and orders on the “My Invoices” page. For a corporate invoice, you can send your details via support." },
      },
    },
    "cuzdan-odeme": {
      title: "Wallet & Payment",
      items: {
        0: { q: "How do I add balance?", a: "From the “Wallet” page, choose an amount (or enter a custom amount), select a payment method and tap “Top Up”. The amount is added to your balance instantly." },
        1: { q: "What is the top-up bonus?", a: "When you top up above certain amounts you earn extra balance: 100₺ → +2%, 250₺ → +4%, 500₺ and above → +6%. The bonus is added automatically at the moment of top-up." },
        2: { q: "Why do we use a wallet?", a: "Thanks to the wallet model you don’t have to enter payment details again on every purchase; you buy with your balance in one click, within seconds." },
        3: { q: "Can I withdraw my balance?", a: "Store balance is for shopping. Cash refund requests are evaluated by our support team within the relevant regulations and conditions." },
        4: { q: "Which payment methods do you accept?", a: "Common card and digital payment methods are supported for top-ups. You can see the available options on the top-up screen of the “Wallet” page." },
        5: { q: "Is my payment secure?", a: "All payments are protected with SSL encryption and 3D Secure. Your card details are not stored with us; the payment step runs over secure infrastructure." },
      },
    },
    "guvenlik": {
      title: "Account & Security",
      items: {
        0: { q: "How do I keep my account safe?", a: "Use a strong, unique password and never share it with anyone. You can change your password anytime from the “Security” page." },
        1: { q: "Can I change my email address?", a: "Yes. From the “Security” page you can add your new email and enter the verification code to update your primary email." },
        2: { q: "Are my codes safe?", a: "All codes are stored encrypted in the database and only you can view them. Our payment infrastructure is protected with 3D Secure and SSL." },
      },
    },
    "referans": {
      title: "Referrals & Campaigns",
      items: {
        0: { q: "How do I invite a friend?", a: "Share your invite code or link from the “Referral” page with your friend. When your friend signs up with this link and makes their first top-up, you both earn bonus balance." },
        1: { q: "When is the referral bonus credited?", a: "The moment the person you invited signs up and completes their first balance top-up, the bonus is automatically added to both wallets." },
        2: { q: "How many people can I invite?", a: "There is no upper limit on invitations. You keep earning a bonus for every valid user you invite; in the tiered system, more invites = higher rewards." },
        3: { q: "Where do I follow campaigns and discounts?", a: "We announce active campaigns on the “Blog” page and in the campaign area on the homepage. We recommend keeping your notifications on for important opportunities." },
      },
    },
    "iade-cayma": {
      title: "Refunds & Right of Withdrawal",
      items: {
        0: { q: "Is there a refund for digital codes?", a: "Once digital codes are delivered and viewed, they fall outside the right of withdrawal under distance-selling regulations. This is an industry standard to prevent abuse." },
        1: { q: "Can I return an order I haven’t viewed yet?", a: "If you haven’t viewed the code at all, reach out via “My Support Tickets” with your order number. For unviewed and unused orders, we assess the situation and provide a solution." },
        2: { q: "I received a code that doesn’t work, what happens?", a: "Although very rare, if a code can’t be used, open a support ticket with your order number. We’ll review and verify the code; if the issue is on our side, we’ll replace it or refund your balance." },
        3: { q: "If the refund is approved, where does the money go?", a: "Unless otherwise stated, approved refunds are returned as balance to your store wallet, so you can use it instantly on your next purchase." },
      },
    },
    "hesap-uyelik": {
      title: "Account & Membership",
      items: {
        0: { q: "How do I sign up?", a: "Sign up in seconds with your email or Google account using “Sign Up” at the top right. With email sign-up, your account is ready after you enter the verification code." },
        1: { q: "I forgot my password, what should I do?", a: "Click the “Forgot password” link on the sign-in screen and enter your email address. You can set a new password from the link/code we send you." },
        2: { q: "How do I enable two-factor authentication (2FA)?", a: "You can enable two-factor authentication from the “Security” page. This significantly boosts your security by requiring an extra code when you sign in." },
        3: { q: "Can I close my account?", a: "Yes. If you want to close your account, contact the support team. We’ll review the status of your balance and active orders together and process your request." },
      },
    },
    "bayilik-api": {
      title: "Reseller & API",
      items: {
        0: { q: "What’s needed to become a reseller?", a: "Just fill out the application form on the “Reseller” page. Once your application is approved, you get access to the reseller panel, discounted prices and the API." },
        1: { q: "What are the reseller benefits?", a: "Approved resellers get tier-based discounted purchase prices, API access for automated ordering, and webhook notifications. As your volume grows, your tier rises and your discount increases." },
        2: { q: "How do I use the API?", a: "Generate your key from “API Settings” in the reseller panel, then use our REST endpoints to query balance, list products and place automated orders. See our API Documentation page for details." },
        3: { q: "Can I sell every product via the API?", a: "For now only code-delivery (in-stock) products can be provided via the API. Products delivered via account top-up or an external provider are outside the API scope." },
      },
    },
  },
  de: {
    "siparis-kod": {
      title: "Bestellungen & Code-Lieferung",
      items: {
        0: { q: "Wo sehe ich den gekauften Code?", a: "Sobald deine Zahlung abgeschlossen ist, erscheint dein Code auf der Seite „Meine Bestellungen“. Tippe auf der Bestellkarte auf „Code anzeigen“, um ihn anzuzeigen, zu kopieren oder als .txt herunterzuladen." },
        1: { q: "Wie schnell wird der Code geliefert?", a: "Alle Codes werden automatisch und sofort geliefert. Sobald die Zahlung von deinem Guthaben abgebucht wird, wird der Code deinem Konto gutgeschrieben; das dauert meist nur wenige Sekunden." },
        2: { q: "Was passiert, wenn ich meinen Code verliere?", a: "Deine Codes werden verschlüsselt in deinem Konto gespeichert. Du kannst sie jederzeit auf der Seite „Meine Bestellungen“ erneut ansehen; sie gehen nicht verloren." },
        3: { q: "Mein Code funktioniert nicht, was soll ich tun?", a: "Stelle zuerst sicher, dass Region (Türkei) und Plattform korrekt sind. Bleibt das Problem bestehen, kontaktiere uns über „Meine Support-Tickets“ mit deiner Bestellnummer; wir prüfen es und bieten schnell eine Lösung." },
        4: { q: "Wo sehe ich meine bisherigen Bestellungen?", a: "Alle deine Bestellungen sind nach Datum auf der Seite „Meine Bestellungen“ aufgelistet. Über jede Bestellkarte kannst du den Code erneut ansehen sowie Produkt- und Betragsdetails prüfen." },
        5: { q: "Kann ich eine Rechnung erhalten?", a: "Ja. Belege zu deinen Aufladungen und Bestellungen findest du auf der Seite „Meine Rechnungen“. Für eine Firmenrechnung kannst du deine Daten über den Support senden." },
      },
    },
    "cuzdan-odeme": {
      title: "Wallet & Zahlung",
      items: {
        0: { q: "Wie lade ich Guthaben auf?", a: "Wähle auf der Seite „Wallet“ einen Betrag (oder gib einen eigenen ein), lege die Zahlungsmethode fest und tippe auf „Aufladen“. Der Betrag wird sofort deinem Guthaben hinzugefügt." },
        1: { q: "Was ist der Aufladebonus?", a: "Wenn du über bestimmten Beträgen auflädst, erhältst du zusätzliches Guthaben: 100₺ → +2 %, 250₺ → +4 %, 500₺ und mehr → +6 %. Der Bonus wird beim Aufladen automatisch hinzugefügt." },
        2: { q: "Warum nutzen wir ein Wallet?", a: "Dank des Wallet-Modells musst du nicht bei jedem Kauf erneut Zahlungsdaten eingeben; du kaufst mit deinem Guthaben mit einem Klick, in Sekunden." },
        3: { q: "Kann ich mein Guthaben abheben?", a: "Das Store-Guthaben ist zum Einkaufen gedacht. Anträge auf Barerstattung werden von unserem Support-Team im Rahmen der geltenden Vorschriften und Bedingungen geprüft." },
        4: { q: "Welche Zahlungsmethoden akzeptiert ihr?", a: "Für Aufladungen werden gängige Karten- und digitale Zahlungsmethoden unterstützt. Die verfügbaren Optionen siehst du im Aufladebildschirm der Seite „Wallet“." },
        5: { q: "Ist meine Zahlung sicher?", a: "Alle Zahlungen sind durch SSL-Verschlüsselung und 3D Secure geschützt. Deine Kartendaten werden bei uns nicht gespeichert; der Zahlungsschritt läuft über eine sichere Infrastruktur." },
      },
    },
    "guvenlik": {
      title: "Konto & Sicherheit",
      items: {
        0: { q: "Wie halte ich mein Konto sicher?", a: "Verwende ein starkes, einzigartiges Passwort und teile es mit niemandem. Du kannst dein Passwort jederzeit auf der Seite „Sicherheit“ ändern." },
        1: { q: "Kann ich meine E-Mail-Adresse ändern?", a: "Ja. Auf der Seite „Sicherheit“ kannst du deine neue E-Mail hinzufügen und mit dem Bestätigungscode deine primäre E-Mail aktualisieren." },
        2: { q: "Sind meine Codes sicher?", a: "Alle Codes werden verschlüsselt in der Datenbank gespeichert und nur du kannst sie ansehen. Unsere Zahlungsinfrastruktur ist mit 3D Secure und SSL geschützt." },
      },
    },
    "referans": {
      title: "Empfehlungen & Aktionen",
      items: {
        0: { q: "Wie lade ich einen Freund ein?", a: "Teile deinen Einladungscode oder -link von der Seite „Empfehlung“ mit deinem Freund. Wenn dein Freund sich über diesen Link registriert und die erste Aufladung macht, erhaltet ihr beide Bonusguthaben." },
        1: { q: "Wann wird der Empfehlungsbonus gutgeschrieben?", a: "Sobald die eingeladene Person sich registriert und ihre erste Aufladung abschließt, wird der Bonus automatisch beiden Wallets gutgeschrieben." },
        2: { q: "Wie viele Personen kann ich einladen?", a: "Es gibt keine Obergrenze für Einladungen. Für jeden gültigen eingeladenen Nutzer erhältst du weiterhin einen Bonus; im Stufensystem gilt: mehr Einladungen = höhere Belohnungen." },
        3: { q: "Wo verfolge ich Aktionen und Rabatte?", a: "Aktive Aktionen kündigen wir auf der Seite „Blog“ und im Aktionsbereich der Startseite an. Für wichtige Gelegenheiten empfehlen wir, deine Benachrichtigungen aktiviert zu lassen." },
      },
    },
    "iade-cayma": {
      title: "Rückgabe & Widerrufsrecht",
      items: {
        0: { q: "Gibt es eine Rückgabe bei digitalen Codes?", a: "Nach Lieferung und Ansicht fallen digitale Codes gemäß den Fernabsatzvorschriften nicht unter das Widerrufsrecht. Dies ist ein Branchenstandard zur Missbrauchsvermeidung." },
        1: { q: "Kann ich eine noch nicht angesehene Bestellung zurückgeben?", a: "Wenn du den Code überhaupt nicht angesehen hast, kontaktiere uns über „Meine Support-Tickets“ mit deiner Bestellnummer. Für nicht angesehene und ungenutzte Bestellungen prüfen wir die Lage und bieten eine Lösung." },
        2: { q: "Ich habe einen nicht funktionierenden Code erhalten, was passiert?", a: "Sehr selten, aber falls ein Code nicht nutzbar ist, öffne ein Support-Ticket mit deiner Bestellnummer. Wir prüfen und verifizieren den Code; liegt das Problem bei uns, ersetzen wir ihn oder erstatten dein Guthaben." },
        3: { q: "Wohin wird das Geld bei genehmigter Rückerstattung gezahlt?", a: "Sofern nicht anders angegeben, werden genehmigte Erstattungen als Guthaben in dein Store-Wallet zurückgezahlt, sodass du es beim nächsten Kauf sofort nutzen kannst." },
      },
    },
    "hesap-uyelik": {
      title: "Konto & Mitgliedschaft",
      items: {
        0: { q: "Wie werde ich Mitglied?", a: "Werde in Sekunden mit deiner E-Mail oder deinem Google-Konto über „Registrieren“ oben rechts Mitglied. Bei der E-Mail-Registrierung ist dein Konto bereit, sobald du den Bestätigungscode eingegeben hast." },
        1: { q: "Ich habe mein Passwort vergessen, was soll ich tun?", a: "Klicke im Anmeldebildschirm auf „Passwort vergessen“ und gib deine E-Mail-Adresse ein. Über den Link/Code, den wir dir senden, kannst du ein neues Passwort festlegen." },
        2: { q: "Wie aktiviere ich die Zwei-Faktor-Authentifizierung (2FA)?", a: "Du kannst die Zwei-Faktor-Authentifizierung auf der Seite „Sicherheit“ aktivieren. Sie erhöht deine Sicherheit erheblich, indem bei der Anmeldung ein zusätzlicher Code abgefragt wird." },
        3: { q: "Kann ich mein Konto schließen?", a: "Ja. Wenn du dein Konto schließen möchtest, kontaktiere das Support-Team. Wir prüfen gemeinsam den Status deines Guthabens und deiner aktiven Bestellungen und bearbeiten deine Anfrage." },
      },
    },
    "bayilik-api": {
      title: "Reseller & API",
      items: {
        0: { q: "Was wird benötigt, um Reseller zu werden?", a: "Fülle einfach das Antragsformular auf der Seite „Reseller“ aus. Nach Genehmigung deines Antrags erhältst du Zugang zum Reseller-Panel, zu Rabattpreisen und zur API." },
        1: { q: "Was sind die Reseller-Vorteile?", a: "Genehmigte Reseller nutzen stufenbasierte Rabatt-Einkaufspreise, API-Zugang für automatische Bestellungen und Webhook-Benachrichtigungen. Mit wachsendem Volumen steigt deine Stufe und dein Rabatt." },
        2: { q: "Wie nutze ich die API?", a: "Erzeuge deinen Schlüssel unter „API-Einstellungen“ im Reseller-Panel und nutze dann unsere REST-Endpunkte, um das Guthaben abzufragen, Produkte aufzulisten und automatisch Bestellungen aufzugeben. Details findest du auf unserer API-Dokumentationsseite." },
        3: { q: "Kann ich jedes Produkt über die API verkaufen?", a: "Derzeit können über die API nur Code-Lieferprodukte (auf Lager) bereitgestellt werden. Produkte, die per Konto-Aufladung oder über einen externen Anbieter geliefert werden, liegen außerhalb des API-Umfangs." },
      },
    },
  },
  ar: {
    "siparis-kod": {
      title: "الطلبات وتسليم الأكواد",
      items: {
        0: { q: "أين أرى الكود الذي اشتريته؟", a: "بمجرد اكتمال الدفع، يظهر الكود في صفحة «طلباتي». اضغط زر «إظهار الكود» في بطاقة الطلب لعرضه أو نسخه أو تنزيله كملف .txt." },
        1: { q: "خلال كم من الوقت يُسلَّم الكود؟", a: "تُسلَّم جميع الأكواد تلقائيًا وفورًا. بمجرد خصم المبلغ من رصيدك، يُضاف الكود إلى حسابك؛ ويستغرق ذلك عادةً ثوانٍ قليلة." },
        2: { q: "ماذا لو فقدت الكود؟", a: "تُحفظ أكوادك مشفّرة في حسابك. يمكنك عرضها مجددًا في أي وقت من صفحة «طلباتي»؛ فهي لا تُفقد." },
        3: { q: "الكود لا يعمل، ماذا أفعل؟", a: "تأكد أولًا من صحة المنطقة (تركيا) والمنصة. إذا استمرت المشكلة، تواصل معنا عبر «طلبات الدعم» مع رقم طلبك؛ وسنراجعها ونوفّر حلًا سريعًا." },
        4: { q: "أين أرى طلباتي السابقة؟", a: "تُدرَج جميع طلباتك حسب التاريخ في صفحة «طلباتي». ومن كل بطاقة طلب يمكنك عرض الكود مجددًا والاطلاع على تفاصيل المنتج والمبلغ." },
        5: { q: "هل يمكنني الحصول على فاتورة؟", a: "نعم. يمكنك عرض مستندات شحنات رصيدك وطلباتك من صفحة «فواتيري». وللفاتورة المؤسسية يمكنك إرسال بياناتك عبر الدعم." },
      },
    },
    "cuzdan-odeme": {
      title: "المحفظة والدفع",
      items: {
        0: { q: "كيف أشحن رصيدًا؟", a: "من صفحة «المحفظة» اختر مبلغًا (أو أدخل مبلغًا مخصصًا)، وحدد طريقة الدفع واضغط «شحن». يُضاف المبلغ إلى رصيدك فورًا." },
        1: { q: "ما هي مكافأة الشحن؟", a: "عند الشحن فوق مبالغ معينة تكسب رصيدًا إضافيًا: 100₺ ← ‎+2%‎، 250₺ ← ‎+4%‎، 500₺ فأكثر ← ‎+6%‎. تُضاف المكافأة تلقائيًا عند الشحن." },
        2: { q: "لماذا نستخدم المحفظة؟", a: "بفضل نموذج المحفظة لا تحتاج إلى إدخال بيانات الدفع في كل عملية شراء؛ تشتري برصيدك بنقرة واحدة وخلال ثوانٍ." },
        3: { q: "هل يمكنني سحب رصيدي؟", a: "رصيد المتجر مخصص للتسوق. تُقيَّم طلبات الاسترداد النقدي من قِبل فريق الدعم وفقًا للأنظمة والشروط ذات الصلة." },
        4: { q: "ما طرق الدفع التي تقبلونها؟", a: "تُدعم بطاقات الدفع الشائعة ووسائل الدفع الرقمية لشحن الرصيد. يمكنك رؤية الخيارات المتاحة في شاشة الشحن بصفحة «المحفظة»." },
        5: { q: "هل عملية الدفع آمنة؟", a: "جميع المدفوعات محمية بتشفير SSL و3D Secure. بيانات بطاقتك لا تُحفظ لدينا؛ وتجري خطوة الدفع عبر بنية تحتية آمنة." },
      },
    },
    "guvenlik": {
      title: "الحساب والأمان",
      items: {
        0: { q: "كيف أحافظ على أمان حسابي؟", a: "استخدم كلمة مرور قوية وفريدة ولا تشاركها مع أحد. يمكنك تغيير كلمة المرور في أي وقت من صفحة «الأمان»." },
        1: { q: "هل يمكنني تغيير عنوان بريدي الإلكتروني؟", a: "نعم. من صفحة «الأمان» يمكنك إضافة بريدك الجديد وإدخال رمز التحقق لتحديث بريدك الأساسي." },
        2: { q: "هل أكوادي آمنة؟", a: "تُحفظ جميع الأكواد مشفّرة في قاعدة البيانات ولا يمكن لأحد غيرك عرضها. وبنية الدفع لدينا محمية بـ 3D Secure وSSL." },
      },
    },
    "referans": {
      title: "الإحالة والحملات",
      items: {
        0: { q: "كيف أدعو صديقًا؟", a: "شارك رمز أو رابط الدعوة من صفحة «الإحالة» مع صديقك. عندما يسجّل صديقك عبر هذا الرابط ويقوم بأول شحن، تكسبان معًا رصيد مكافأة." },
        1: { q: "متى تُضاف مكافأة الإحالة؟", a: "بمجرد أن يسجّل الشخص الذي دعوته ويكمل أول شحن للرصيد، تُضاف المكافأة تلقائيًا إلى محفظتي الطرفين." },
        2: { q: "كم شخصًا يمكنني دعوتهم؟", a: "لا يوجد حد أقصى لعدد الدعوات. تستمر في كسب مكافأة عن كل مستخدم صالح تدعوه؛ وفي النظام المتدرج: دعوات أكثر = مكافآت أعلى." },
        3: { q: "أين أتابع الحملات والخصومات؟", a: "نُعلن عن الحملات النشطة في صفحة «المدونة» وفي قسم الحملات بالصفحة الرئيسية. ننصح بإبقاء إشعاراتك مفعّلة للفرص المهمة." },
      },
    },
    "iade-cayma": {
      title: "الاسترجاع وحق الانسحاب",
      items: {
        0: { q: "هل يوجد استرجاع للأكواد الرقمية؟", a: "بعد تسليم الأكواد الرقمية وعرضها، تخرج عن نطاق حق الانسحاب وفقًا لأنظمة البيع عن بُعد. وهذا معيار قطاعي لمنع إساءة الاستخدام." },
        1: { q: "هل يمكنني إرجاع طلب لم أعرضه بعد؟", a: "إذا لم تعرض الكود إطلاقًا، تواصل معنا عبر «طلبات الدعم» مع رقم طلبك. وللطلبات غير المعروضة وغير المستخدمة، نُقيّم الحالة ونوفّر حلًا." },
        2: { q: "استلمت كودًا لا يعمل، ماذا يحدث؟", a: "نادرًا جدًا، لكن إذا تعذّر استخدام كود، افتح طلب دعم مع رقم طلبك. سنراجع الكود ونتحقق منه؛ وإذا كانت المشكلة من جهتنا، نستبدله أو نعيد الرصيد." },
        3: { q: "إذا تمت الموافقة على الاسترجاع، أين يُودَع المبلغ؟", a: "ما لم يُذكر خلاف ذلك، تُعاد المبالغ المعتمدة كرصيد إلى محفظة المتجر، لتستخدمها فورًا في عملية الشراء التالية." },
      },
    },
    "hesap-uyelik": {
      title: "الحساب والعضوية",
      items: {
        0: { q: "كيف أصبح عضوًا؟", a: "سجّل خلال ثوانٍ ببريدك الإلكتروني أو حساب Google عبر «إنشاء حساب» أعلى اليمين. وفي التسجيل بالبريد، يصبح حسابك جاهزًا بعد إدخال رمز التحقق." },
        1: { q: "نسيت كلمة المرور، ماذا أفعل؟", a: "اضغط رابط «نسيت كلمة المرور» في شاشة تسجيل الدخول وأدخل بريدك الإلكتروني. ومن الرابط/الرمز الذي نرسله يمكنك تعيين كلمة مرور جديدة." },
        2: { q: "كيف أفعّل التحقق بخطوتين (2FA)؟", a: "يمكنك تفعيل التحقق بخطوتين من صفحة «الأمان». وهذا يعزز أمانك بشكل كبير بطلب رمز إضافي عند تسجيل الدخول." },
        3: { q: "هل يمكنني إغلاق حسابي؟", a: "نعم. إذا رغبت في إغلاق حسابك، تواصل مع فريق الدعم. سنقيّم معًا وضع رصيدك وطلباتك النشطة ونعالج طلبك." },
      },
    },
    "bayilik-api": {
      title: "الوكالة وواجهة API",
      items: {
        0: { q: "ماذا يلزم لأصبح وكيلًا؟", a: "يكفي ملء نموذج الطلب في صفحة «الوكالة». وعند الموافقة على طلبك، تحصل على لوحة الوكيل والأسعار المخفّضة والوصول إلى API." },
        1: { q: "ما مزايا الوكالة؟", a: "يستخدم الوكلاء المعتمدون أسعار شراء مخفّضة حسب الفئة، ووصولًا إلى API للطلب التلقائي، وإشعارات webhook. وكلما زاد حجمك ارتفعت فئتك وزاد خصمك." },
        2: { q: "كيف أستخدم API؟", a: "أنشئ مفتاحك من «إعدادات API» في لوحة الوكيل، ثم استخدم نقاط REST لدينا للاستعلام عن الرصيد وعرض المنتجات وإجراء طلبات تلقائية. للتفاصيل راجع صفحة وثائق API." },
        3: { q: "هل يمكنني بيع كل منتج عبر API؟", a: "حاليًا يمكن توفير منتجات التسليم بالكود (من المخزون) فقط عبر API. أما المنتجات المسلَّمة عبر شحن الحساب أو مزوّد خارجي فهي خارج نطاق API." },
      },
    },
  },
  ru: {
    "siparis-kod": {
      title: "Заказы и выдача кодов",
      items: {
        0: { q: "Где я вижу купленный код?", a: "Как только оплата завершена, код появляется на странице «Мои заказы». Нажмите кнопку «Показать код» на карточке заказа, чтобы открыть, скопировать или скачать его в виде файла .txt." },
        1: { q: "Как быстро доставляется код?", a: "Все коды доставляются автоматически и мгновенно. Как только оплата списывается с баланса, код зачисляется на ваш аккаунт; обычно это занимает несколько секунд." },
        2: { q: "Что если я потеряю код?", a: "Ваши коды хранятся в аккаунте в зашифрованном виде. Вы можете в любой момент снова просмотреть их на странице «Мои заказы»; они не теряются." },
        3: { q: "Код не работает, что делать?", a: "Сначала убедитесь, что регион (Турция) и платформа верны. Если проблема не исчезает, обратитесь через «Мои обращения в поддержку» с номером заказа; мы проверим и быстро предложим решение." },
        4: { q: "Где посмотреть прошлые заказы?", a: "Все ваши заказы перечислены по дате на странице «Мои заказы». С каждой карточки заказа можно снова просмотреть код и проверить детали товара и суммы." },
        5: { q: "Могу ли я получить счёт?", a: "Да. Документы по пополнениям и заказам можно посмотреть на странице «Мои счета». Для корпоративного счёта отправьте свои данные через поддержку." },
      },
    },
    "cuzdan-odeme": {
      title: "Кошелёк и оплата",
      items: {
        0: { q: "Как пополнить баланс?", a: "На странице «Кошелёк» выберите сумму (или введите свою), укажите способ оплаты и нажмите «Пополнить». Сумма мгновенно добавляется к балансу." },
        1: { q: "Что такое бонус за пополнение?", a: "При пополнении выше определённых сумм вы получаете дополнительный баланс: 100₺ → +2%, 250₺ → +4%, 500₺ и выше → +6%. Бонус добавляется автоматически в момент пополнения." },
        2: { q: "Почему мы используем кошелёк?", a: "Благодаря модели кошелька вам не нужно заново вводить платёжные данные при каждой покупке; вы покупаете с баланса в один клик, за секунды." },
        3: { q: "Могу ли я вывести баланс?", a: "Баланс магазина предназначен для покупок. Запросы на денежный возврат рассматриваются нашей поддержкой в рамках соответствующих правил и условий." },
        4: { q: "Какие способы оплаты вы принимаете?", a: "Для пополнений поддерживаются распространённые карты и цифровые способы оплаты. Доступные варианты вы увидите на экране пополнения страницы «Кошелёк»." },
        5: { q: "Безопасен ли мой платёж?", a: "Все платежи защищены SSL-шифрованием и 3D Secure. Данные вашей карты у нас не хранятся; шаг оплаты проходит через защищённую инфраструктуру." },
      },
    },
    "guvenlik": {
      title: "Аккаунт и безопасность",
      items: {
        0: { q: "Как защитить свой аккаунт?", a: "Используйте надёжный и уникальный пароль и никому его не сообщайте. Вы можете изменить пароль в любой момент на странице «Безопасность»." },
        1: { q: "Могу ли я изменить адрес электронной почты?", a: "Да. На странице «Безопасность» вы можете добавить новый e-mail и ввести код подтверждения, чтобы обновить основную почту." },
        2: { q: "В безопасности ли мои коды?", a: "Все коды хранятся в базе данных в зашифрованном виде, и просматривать их можете только вы. Наша платёжная инфраструктура защищена 3D Secure и SSL." },
      },
    },
    "referans": {
      title: "Рефералы и акции",
      items: {
        0: { q: "Как пригласить друга?", a: "Поделитесь с другом кодом или ссылкой-приглашением со страницы «Реферал». Когда ваш друг зарегистрируется по этой ссылке и сделает первое пополнение, вы оба получите бонусный баланс." },
        1: { q: "Когда зачисляется реферальный бонус?", a: "Как только приглашённый вами человек зарегистрируется и завершит первое пополнение баланса, бонус автоматически добавляется в оба кошелька." },
        2: { q: "Скольких человек я могу пригласить?", a: "Верхнего предела на приглашения нет. Вы продолжаете получать бонус за каждого действительного приглашённого пользователя; в многоуровневой системе больше приглашений = выше награды." },
        3: { q: "Где следить за акциями и скидками?", a: "Активные акции мы анонсируем на странице «Блог» и в разделе акций на главной странице. Для важных предложений рекомендуем держать уведомления включёнными." },
      },
    },
    "iade-cayma": {
      title: "Возврат и право на отказ",
      items: {
        0: { q: "Есть ли возврат для цифровых кодов?", a: "После доставки и просмотра цифровые коды не подпадают под право на отказ согласно правилам дистанционной продажи. Это отраслевой стандарт для предотвращения злоупотреблений." },
        1: { q: "Могу ли я вернуть ещё не просмотренный заказ?", a: "Если вы вообще не просматривали код, обратитесь через «Мои обращения в поддержку» с номером заказа. Для непросмотренных и неиспользованных заказов мы оценим ситуацию и предложим решение." },
        2: { q: "Я получил нерабочий код, что будет?", a: "Хотя это бывает крайне редко, если код не удаётся использовать, создайте обращение в поддержку с номером заказа. Мы проверим и подтвердим код; если проблема на нашей стороне, заменим его или вернём баланс." },
        3: { q: "Куда поступят деньги при одобрении возврата?", a: "Если не указано иное, одобрённые возвраты возвращаются как баланс в ваш кошелёк магазина, чтобы вы могли сразу использовать его при следующей покупке." },
      },
    },
    "hesap-uyelik": {
      title: "Аккаунт и членство",
      items: {
        0: { q: "Как зарегистрироваться?", a: "Зарегистрируйтесь за секунды с помощью e-mail или аккаунта Google через «Регистрация» в правом верхнем углу. При регистрации по e-mail аккаунт готов после ввода кода подтверждения." },
        1: { q: "Я забыл пароль, что делать?", a: "Нажмите ссылку «Забыли пароль» на экране входа и введите свой e-mail. По ссылке/коду, которые мы отправим, вы сможете задать новый пароль." },
        2: { q: "Как включить двухфакторную аутентификацию (2FA)?", a: "Двухфакторную аутентификацию можно включить на странице «Безопасность». Это значительно повышает безопасность, запрашивая дополнительный код при входе." },
        3: { q: "Могу ли я закрыть аккаунт?", a: "Да. Если вы хотите закрыть аккаунт, свяжитесь с поддержкой. Мы вместе оценим состояние вашего баланса и активных заказов и обработаем ваш запрос." },
      },
    },
    "bayilik-api": {
      title: "Дилерство и API",
      items: {
        0: { q: "Что нужно, чтобы стать дилером?", a: "Достаточно заполнить форму заявки на странице «Дилерство». После одобрения заявки вы получаете доступ к панели дилера, скидочным ценам и API." },
        1: { q: "Какие преимущества у дилерства?", a: "Одобрённые дилеры используют скидочные закупочные цены по уровням, доступ к API для автоматических заказов и webhook-уведомления. По мере роста объёма ваш уровень повышается, а скидка растёт." },
        2: { q: "Как использовать API?", a: "Сгенерируйте ключ в «Настройках API» в панели дилера, затем используйте наши REST-эндпоинты, чтобы запрашивать баланс, получать список товаров и оформлять автоматические заказы. Подробности — на странице документации API." },
        3: { q: "Могу ли я продавать любой товар через API?", a: "Пока через API можно предоставлять только товары с выдачей кода (со склада). Товары, доставляемые через пополнение аккаунта или внешнего поставщика, вне рамок API." },
      },
    },
  },
};

/** HELP_SECTIONS'ı locale'e göre döner (çeviri yoksa TR). */
export function getHelpSections(locale: Locale = DEFAULT_LOCALE): HelpSection[] {
  const over = HELP_SECTIONS_I18N[locale];
  if (!over) return HELP_SECTIONS;
  return HELP_SECTIONS.map((s) => {
    const o = over[s.slug];
    if (!o) return s;
    return {
      ...s,
      title: pick(s.title, o.title),
      items: s.items.map((qa, i) => ({
        q: pick(qa.q, o.items?.[i]?.q),
        a: pick(qa.a, o.items?.[i]?.a),
      })),
    };
  });
}

/** Haberler — duyuru/güncelleme kartları (en yeni en üstte). */
export interface NewsItem {
  slug: string;
  title: string;
  date: string; // ISO
  tag: "Güncelleme" | "Duyuru" | "Kampanya";
  summary: string;
  body: string;
  image: string; // haber görseli — public/news/ içindeki 16:9 flat 3D illüstrasyon
}

/** Slug'a göre haber bul (locale verilirse çevirili döner, yoksa TR). */
export function getNews(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): NewsItem | undefined {
  const base = NEWS.find((n) => n.slug === slug);
  if (!base) return undefined;
  return applyNewsOverlay(base, locale);
}

/** Tüm haberleri locale'e göre döner (çeviri yoksa TR). */
export function getAllNews(locale: Locale = DEFAULT_LOCALE): NewsItem[] {
  if (locale === DEFAULT_LOCALE || !NEWS_I18N[locale]) return NEWS;
  return NEWS.map((n) => applyNewsOverlay(n, locale));
}

/** Tek bir habere overlay uygular (tag çevrilmez — render'da t() ile). */
function applyNewsOverlay(item: NewsItem, locale: Locale): NewsItem {
  const o = NEWS_I18N[locale]?.[item.slug];
  if (!o) return item;
  return {
    ...item,
    title: pick(item.title, o.title),
    summary: pick(item.summary, o.summary),
    body: pick(item.body, o.body),
  };
}

export const NEWS: NewsItem[] = [
  {
    slug: "hesap-merkezi-yenilendi",
    title: "Hesap merkezi tamamen yenilendi",
    date: "2026-05-29",
    tag: "Güncelleme",
    summary:
      "Cüzdan, siparişler, faturalar, destek ve referans tek bir modern panelde toplandı.",
    body: "Hesap sayfanı baştan tasarladık. Artık sol menüden cüzdanına, bakiye hareketlerine, faturalarına, destek taleplerine ve referans programına tek yerden ulaşabilirsin. Tüm listelerde filtre ve arama da eklendi.",
    image: "/news/news-account.png",
  },
  {
    slug: "referans-programi-basladi",
    title: "Referans programı başladı 🎉",
    date: "2026-05-29",
    tag: "Kampanya",
    summary:
      "Arkadaşını davet et, ilk yüklemesinde ikiniz de bonus bakiye kazanın.",
    body: "Davet kodunu paylaş, arkadaşın kayıt olup ilk yüklemesini yaptığında her ikinize de bonus bakiye tanımlansın. Daha fazla davet, daha fazla ödül kademesi anlamına geliyor.",
    image: "/news/news-referral.png",
  },
  {
    slug: "bildirim-sistemi",
    title: "Anlık bildirimler geldi",
    date: "2026-05-29",
    tag: "Güncelleme",
    summary:
      "Sipariş, cüzdan ve kampanya bildirimlerini artık çan ikonundan takip edebilirsin.",
    body: "Header'daki çan ikonuyla siparişlerin hazır olduğunda, bakiye yüklendiğinde veya yeni bir kampanya başladığında anında haberdar olursun.",
    image: "/news/news-notifications.png",
  },
];

/** NEWS çevirileri — slug anahtarlı (tag ÇEVRİLMEZ; render'da t("news.tag.*")). */
const NEWS_I18N: Partial<
  Record<Locale, Record<string, Partial<Pick<NewsItem, "title" | "summary" | "body">>>>
> = {
  en: {
    "hesap-merkezi-yenilendi": {
      title: "The account center has been completely revamped",
      summary:
        "Wallet, orders, invoices, support and referrals are now gathered in a single modern panel.",
      body: "We redesigned your account page from scratch. Now, from the left menu, you can reach your wallet, balance activity, invoices, support tickets and the referral program all in one place. Filters and search have also been added to every list.",
    },
    "referans-programi-basladi": {
      title: "The referral program has launched 🎉",
      summary:
        "Invite your friend and both of you earn bonus balance on their first top-up.",
      body: "Share your invite code; when your friend signs up and makes their first top-up, bonus balance is credited to both of you. More invites mean more reward tiers.",
    },
    "bildirim-sistemi": {
      title: "Instant notifications have arrived",
      summary:
        "You can now follow order, wallet and campaign notifications from the bell icon.",
      body: "With the bell icon in the header, you’re notified instantly when your orders are ready, your balance is topped up, or a new campaign starts.",
    },
  },
  de: {
    "hesap-merkezi-yenilendi": {
      title: "Das Konto-Center wurde komplett überarbeitet",
      summary:
        "Wallet, Bestellungen, Rechnungen, Support und Empfehlungen sind jetzt in einem modernen Panel vereint.",
      body: "Wir haben deine Kontoseite von Grund auf neu gestaltet. Jetzt erreichst du über das linke Menü dein Wallet, deine Guthabenbewegungen, Rechnungen, Support-Tickets und das Empfehlungsprogramm an einem Ort. Filter und Suche wurden ebenfalls zu allen Listen hinzugefügt.",
    },
    "referans-programi-basladi": {
      title: "Das Empfehlungsprogramm ist gestartet 🎉",
      summary:
        "Lade deinen Freund ein und ihr beide erhaltet Bonusguthaben bei seiner ersten Aufladung.",
      body: "Teile deinen Einladungscode; wenn dein Freund sich registriert und seine erste Aufladung macht, wird euch beiden Bonusguthaben gutgeschrieben. Mehr Einladungen bedeuten mehr Belohnungsstufen.",
    },
    "bildirim-sistemi": {
      title: "Sofort-Benachrichtigungen sind da",
      summary:
        "Bestell-, Wallet- und Aktionsbenachrichtigungen kannst du jetzt über das Glocken-Symbol verfolgen.",
      body: "Mit dem Glocken-Symbol in der Kopfzeile wirst du sofort benachrichtigt, wenn deine Bestellungen bereit sind, dein Guthaben aufgeladen wurde oder eine neue Aktion startet.",
    },
  },
  ar: {
    "hesap-merkezi-yenilendi": {
      title: "تم تجديد مركز الحساب بالكامل",
      summary:
        "المحفظة والطلبات والفواتير والدعم والإحالة أصبحت مجمّعة في لوحة عصرية واحدة.",
      body: "أعدنا تصميم صفحة حسابك من جديد. الآن من القائمة الجانبية يمكنك الوصول إلى محفظتك وحركات رصيدك وفواتيرك وطلبات الدعم وبرنامج الإحالة من مكان واحد. كما أُضيفت أدوات التصفية والبحث إلى جميع القوائم.",
    },
    "referans-programi-basladi": {
      title: "انطلق برنامج الإحالة 🎉",
      summary:
        "ادعُ صديقك وستكسبان معًا رصيد مكافأة عند أول شحن له.",
      body: "شارك رمز دعوتك؛ وعندما يسجّل صديقك ويقوم بأول شحن، يُضاف رصيد مكافأة لكليكما. والمزيد من الدعوات يعني المزيد من فئات المكافآت.",
    },
    "bildirim-sistemi": {
      title: "وصلت الإشعارات الفورية",
      summary:
        "يمكنك الآن متابعة إشعارات الطلبات والمحفظة والحملات من أيقونة الجرس.",
      body: "بأيقونة الجرس في الشريط العلوي، تصلك إشعارات فورية عند جاهزية طلباتك أو شحن رصيدك أو بدء حملة جديدة.",
    },
  },
  ru: {
    "hesap-merkezi-yenilendi": {
      title: "Центр аккаунта полностью обновлён",
      summary:
        "Кошелёк, заказы, счета, поддержка и рефералы теперь собраны в одной современной панели.",
      body: "Мы заново спроектировали страницу вашего аккаунта. Теперь из левого меню можно в одном месте перейти к кошельку, движениям баланса, счетам, обращениям в поддержку и реферальной программе. Во все списки также добавлены фильтры и поиск.",
    },
    "referans-programi-basladi": {
      title: "Реферальная программа запущена 🎉",
      summary:
        "Пригласите друга, и вы оба получите бонусный баланс при его первом пополнении.",
      body: "Поделитесь кодом-приглашением; когда ваш друг зарегистрируется и сделает первое пополнение, бонусный баланс начисляется вам обоим. Больше приглашений — больше уровней наград.",
    },
    "bildirim-sistemi": {
      title: "Появились мгновенные уведомления",
      summary:
        "Теперь вы можете следить за уведомлениями о заказах, кошельке и акциях по значку колокольчика.",
      body: "С помощью значка колокольчика в шапке вы мгновенно узнаёте, когда ваши заказы готовы, баланс пополнен или начинается новая акция.",
    },
  },
};

/** Etkinlikler — yaklaşan/aktif kampanya & etkinlikler. */
export interface EventItem {
  slug: string;
  title: string;
  status: "active" | "upcoming" | "ended";
  startsAt: string; // ISO
  endsAt: string; // ISO
  summary: string;
  body: string;
}

export const EVENTS: EventItem[] = [
  {
    slug: "hafta-sonu-bonus",
    title: "Hafta Sonu Bonus Festivali",
    status: "active",
    startsAt: "2026-05-29",
    endsAt: "2026-06-01",
    summary: "Tüm bakiye yüklemelerinde ekstra %5'e varan bonus.",
    body: "Hafta sonu boyunca yapacağın bakiye yüklemelerinde standart bonusa ek avantajlar seni bekliyor. Cüzdanına yükle, alışverişe hazır ol.",
  },
  {
    slug: "yeni-uye-firsati",
    title: "Yeni Üye Fırsatı",
    status: "active",
    startsAt: "2026-05-01",
    endsAt: "2026-12-31",
    summary: "Referans linkiyle katıl, hoş geldin bonusunu kap.",
    body: "Bir arkadaşının davet linkiyle kayıt olup ilk yüklemeni yaptığında hoş geldin bonusu cüzdanına tanımlanır.",
  },
  {
    slug: "yaz-indirimleri",
    title: "Yaz İndirimleri",
    status: "upcoming",
    startsAt: "2026-06-15",
    endsAt: "2026-07-15",
    summary: "Seçili oyun e-pinlerinde yaza özel indirimler yolda.",
    body: "Yaz boyunca seçili oyun e-pinleri ve platform bakiyelerinde özel indirimler başlıyor. Takipte kal, kaçırma.",
  },
];

/** EVENTS çevirileri — slug anahtarlı (status t() ile çevrilir, burada değil). */
const EVENTS_I18N: Partial<
  Record<Locale, Record<string, Partial<Pick<EventItem, "title" | "summary" | "body">>>>
> = {
  en: {
    "hafta-sonu-bonus": {
      title: "Weekend Bonus Festival",
      summary: "Up to an extra 5% bonus on all balance top-ups.",
      body: "Throughout the weekend, advantages on top of the standard bonus await you on every balance top-up. Top up your wallet and get ready to shop.",
    },
    "yeni-uye-firsati": {
      title: "New Member Offer",
      summary: "Join via a referral link and grab your welcome bonus.",
      body: "When you sign up with a friend’s invite link and make your first top-up, the welcome bonus is credited to your wallet.",
    },
    "yaz-indirimleri": {
      title: "Summer Sale",
      summary: "Summer-special discounts on selected game e-pins are on the way.",
      body: "Throughout the summer, special discounts begin on selected game e-pins and platform balances. Stay tuned, don’t miss out.",
    },
  },
  de: {
    "hafta-sonu-bonus": {
      title: "Wochenend-Bonus-Festival",
      summary: "Bis zu 5 % extra Bonus auf alle Guthaben-Aufladungen.",
      body: "Das ganze Wochenende über warten bei jeder Guthaben-Aufladung Vorteile zusätzlich zum Standardbonus auf dich. Lade dein Wallet auf und mach dich bereit zum Shoppen.",
    },
    "yeni-uye-firsati": {
      title: "Neumitglieder-Angebot",
      summary: "Tritt über einen Empfehlungslink bei und sichere dir deinen Willkommensbonus.",
      body: "Wenn du dich über den Einladungslink eines Freundes registrierst und deine erste Aufladung machst, wird der Willkommensbonus deinem Wallet gutgeschrieben.",
    },
    "yaz-indirimleri": {
      title: "Sommer-Rabatte",
      summary: "Sommer-Sonderrabatte auf ausgewählte Spiele-E-Pins sind unterwegs.",
      body: "Den ganzen Sommer über starten Sonderrabatte auf ausgewählte Spiele-E-Pins und Plattformguthaben. Bleib dran, verpasse es nicht.",
    },
  },
  ar: {
    "hafta-sonu-bonus": {
      title: "مهرجان مكافأة نهاية الأسبوع",
      summary: "مكافأة إضافية تصل إلى 5% على جميع عمليات شحن الرصيد.",
      body: "طوال نهاية الأسبوع تنتظرك مزايا إضافية فوق المكافأة القياسية على كل شحن للرصيد. اشحن محفظتك واستعد للتسوق.",
    },
    "yeni-uye-firsati": {
      title: "عرض الأعضاء الجدد",
      summary: "انضم عبر رابط إحالة واحصل على مكافأة الترحيب.",
      body: "عندما تسجّل عبر رابط دعوة صديق وتقوم بأول شحن، تُضاف مكافأة الترحيب إلى محفظتك.",
    },
    "yaz-indirimleri": {
      title: "تخفيضات الصيف",
      summary: "تخفيضات صيفية خاصة على أكواد ألعاب مختارة في الطريق.",
      body: "طوال الصيف تبدأ تخفيضات خاصة على أكواد ألعاب مختارة وأرصدة المنصات. تابعنا ولا تفوّت الفرصة.",
    },
  },
  ru: {
    "hafta-sonu-bonus": {
      title: "Фестиваль бонусов выходного дня",
      summary: "До +5% бонуса на все пополнения баланса.",
      body: "В течение выходных при каждом пополнении баланса вас ждут преимущества сверх стандартного бонуса. Пополните кошелёк и готовьтесь к покупкам.",
    },
    "yeni-uye-firsati": {
      title: "Предложение для новых участников",
      summary: "Присоединяйтесь по реферальной ссылке и получите приветственный бонус.",
      body: "Когда вы регистрируетесь по пригласительной ссылке друга и делаете первое пополнение, приветственный бонус зачисляется в ваш кошелёк.",
    },
    "yaz-indirimleri": {
      title: "Летние скидки",
      summary: "Специальные летние скидки на отдельные игровые e-pin уже в пути.",
      body: "В течение лета стартуют специальные скидки на отдельные игровые e-pin и балансы платформ. Следите за обновлениями, не упустите.",
    },
  },
};

/** EVENTS'i locale'e göre döner (çeviri yoksa TR). */
export function getEvents(locale: Locale = DEFAULT_LOCALE): EventItem[] {
  const over = EVENTS_I18N[locale];
  if (!over) return EVENTS;
  return EVENTS.map((e) => {
    const o = over[e.slug];
    if (!o) return e;
    return {
      ...e,
      title: pick(e.title, o.title),
      summary: pick(e.summary, o.summary),
      body: pick(e.body, o.body),
    };
  });
}

/** Çekilişler — kazananın belirlendiği ödüllü etkinlikler. */
export interface RaffleItem {
  slug: string;
  title: string;
  prize: string; // ana ödül
  status: "active" | "upcoming" | "ended";
  startsAt: string; // ISO
  endsAt: string; // ISO (çekiliş tarihi)
  participants: number; // katılımcı sayısı
  ticketCost: number; // katılım bedeli (bakiye) — 0 ise ücretsiz
  summary: string;
  image: string; // ödül görseli — public/raffles/ içindeki 16:9 flat 3D illüstrasyon
  winner?: string; // sona erenlerde maskelenmiş kazanan
}

export const RAFFLES: RaffleItem[] = [
  {
    slug: "playstation-5-cekilis",
    title: "PlayStation 5 Çekilişi",
    prize: "PlayStation 5 Slim 1TB",
    status: "active",
    startsAt: "2026-05-20",
    endsAt: "2026-06-20",
    participants: 4218,
    ticketCost: 0,
    summary: "Her 100₺ bakiye yüklemesi 1 çekiliş hakkı kazandırır. Ana ödül: PS5!",
    image: "/raffles/prize-ps5.png",
  },
  {
    slug: "1000-tl-bakiye-cekilis",
    title: "1.000₺ Bakiye Çekilişi",
    prize: "1.000₺ EpinFox Bakiyesi",
    status: "active",
    startsAt: "2026-05-25",
    endsAt: "2026-06-05",
    participants: 9712,
    ticketCost: 0,
    summary: "Aktif üyeler arasından her hafta bir kişiye 1.000₺ bakiye.",
    image: "/raffles/prize-balance.png",
  },
  {
    slug: "iphone-16-cekilis",
    title: "iPhone 16 Çekilişi",
    prize: "iPhone 16 128GB",
    status: "upcoming",
    startsAt: "2026-06-10",
    endsAt: "2026-07-10",
    participants: 0,
    ticketCost: 0,
    summary: "Yakında başlıyor. Bildirimleri aç, ilk katılanlardan ol.",
    image: "/raffles/prize-iphone.png",
  },
  {
    slug: "steam-deck-cekilis",
    title: "Steam Deck Çekilişi",
    prize: "Steam Deck OLED 512GB",
    status: "ended",
    startsAt: "2026-04-01",
    endsAt: "2026-05-01",
    participants: 6540,
    ticketCost: 0,
    summary: "Sona erdi. Kazanan belirlendi ve ödülü teslim edildi.",
    image: "/raffles/prize-steamdeck.png",
    winner: "m****t k****a",
  },
];

/**
 * RAFFLES çevirileri — slug anahtarlı. title/prize/summary çevrilir;
 * marka/ürün adları (PlayStation 5, iPhone 16, Steam Deck, EpinFox) korunur.
 * status t() ile çevrilir, winner maskelenmiş kalır.
 */
const RAFFLES_I18N: Partial<
  Record<Locale, Record<string, Partial<Pick<RaffleItem, "title" | "prize" | "summary">>>>
> = {
  en: {
    "playstation-5-cekilis": {
      title: "PlayStation 5 Giveaway",
      summary: "Every 100₺ balance top-up earns 1 entry. Grand prize: PS5!",
    },
    "1000-tl-bakiye-cekilis": {
      title: "1,000₺ Balance Giveaway",
      prize: "1,000₺ EpinFox Balance",
      summary: "Each week, 1,000₺ balance goes to one person among active members.",
    },
    "iphone-16-cekilis": {
      title: "iPhone 16 Giveaway",
      summary: "Starting soon. Turn on notifications and be among the first to join.",
    },
    "steam-deck-cekilis": {
      title: "Steam Deck Giveaway",
      summary: "Ended. The winner was drawn and the prize was delivered.",
    },
  },
  de: {
    "playstation-5-cekilis": {
      title: "PlayStation 5 Gewinnspiel",
      summary: "Jede Aufladung von 100₺ bringt 1 Los. Hauptpreis: PS5!",
    },
    "1000-tl-bakiye-cekilis": {
      title: "1.000₺ Guthaben-Gewinnspiel",
      prize: "1.000₺ EpinFox-Guthaben",
      summary: "Jede Woche geht 1.000₺ Guthaben an eine Person unter den aktiven Mitgliedern.",
    },
    "iphone-16-cekilis": {
      title: "iPhone 16 Gewinnspiel",
      summary: "Startet bald. Aktiviere Benachrichtigungen und sei unter den Ersten.",
    },
    "steam-deck-cekilis": {
      title: "Steam Deck Gewinnspiel",
      summary: "Beendet. Der Gewinner wurde gezogen und der Preis übergeben.",
    },
  },
  ar: {
    "playstation-5-cekilis": {
      title: "سحب PlayStation 5",
      summary: "كل شحن بقيمة 100₺ يمنحك فرصة سحب واحدة. الجائزة الكبرى: PS5!",
    },
    "1000-tl-bakiye-cekilis": {
      title: "سحب رصيد 1.000₺",
      prize: "رصيد EpinFox بقيمة 1.000₺",
      summary: "كل أسبوع يحصل شخص واحد من الأعضاء النشطين على رصيد 1.000₺.",
    },
    "iphone-16-cekilis": {
      title: "سحب iPhone 16",
      summary: "يبدأ قريبًا. فعّل الإشعارات وكن من أوائل المشاركين.",
    },
    "steam-deck-cekilis": {
      title: "سحب Steam Deck",
      summary: "انتهى. تم تحديد الفائز وتسليم الجائزة.",
    },
  },
  ru: {
    "playstation-5-cekilis": {
      title: "Розыгрыш PlayStation 5",
      summary: "Каждое пополнение баланса на 100₺ даёт 1 билет. Главный приз: PS5!",
    },
    "1000-tl-bakiye-cekilis": {
      title: "Розыгрыш баланса 1 000₺",
      prize: "Баланс EpinFox на 1 000₺",
      summary: "Каждую неделю 1 000₺ баланса достаётся одному из активных участников.",
    },
    "iphone-16-cekilis": {
      title: "Розыгрыш iPhone 16",
      summary: "Скоро старт. Включите уведомления и будьте среди первых участников.",
    },
    "steam-deck-cekilis": {
      title: "Розыгрыш Steam Deck",
      summary: "Завершён. Победитель определён, приз вручён.",
    },
  },
};

/** RAFFLES'ı locale'e göre döner (çeviri yoksa TR). */
export function getRaffles(locale: Locale = DEFAULT_LOCALE): RaffleItem[] {
  const over = RAFFLES_I18N[locale];
  if (!over) return RAFFLES;
  return RAFFLES.map((r) => {
    const o = over[r.slug];
    if (!o) return r;
    return {
      ...r,
      title: pick(r.title, o.title),
      prize: pick(r.prize, o.prize),
      summary: pick(r.summary, o.summary),
    };
  });
}

/** İş birliği yapılan içerik üreticileri (yayıncılar). */
export interface Publisher {
  slug: string;
  name: string;
  platform: "YouTube" | "Twitch" | "Kick" | "TikTok" | "Instagram";
  handle: string; // @kullanıcıadı
  url: string; // kanal/profil linki
  bio: string; // kısa tanıtım (detay + bağış sayfasında)
  supporters: number; // toplam destekçi sayısı (sosyal kanıt)
}

/** Slug'a göre yayıncı bul (locale verilirse bio çevirili döner, yoksa TR). */
export function getPublisher(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Publisher | undefined {
  const base = PUBLISHERS.find((p) => p.slug === slug);
  if (!base) return undefined;
  const bio = PUBLISHERS_I18N[locale]?.[base.slug];
  return bio ? { ...base, bio: pick(base.bio, bio) } : base;
}

/** Tüm yayıncıları locale'e göre döner (yalnızca bio çevrilir; çeviri yoksa TR). */
export function getPublishers(locale: Locale = DEFAULT_LOCALE): Publisher[] {
  const over = PUBLISHERS_I18N[locale];
  if (!over) return PUBLISHERS;
  return PUBLISHERS.map((p) =>
    over[p.slug] ? { ...p, bio: pick(p.bio, over[p.slug]) } : p,
  );
}

export const PUBLISHERS: Publisher[] = [
  {
    slug: "elraenn",
    name: "Elraenn",
    platform: "Twitch",
    handle: "@elraenn",
    url: "https://twitch.tv/elraenn",
    bio: "Türkiye'nin en çok izlenen Twitch yayıncılarından. Sohbet ve rekabetçi oyun içerikleri üretir.",
    supporters: 1240,
  },
  {
    slug: "wtcn",
    name: "wtcN",
    platform: "Twitch",
    handle: "@wtcn",
    url: "https://twitch.tv/wtcn",
    bio: "Valorant ve FPS odaklı yayınlarıyla tanınan içerik üreticisi ve eski profesyonel oyuncu.",
    supporters: 980,
  },
  {
    slug: "jahrein",
    name: "Jahrein",
    platform: "YouTube",
    handle: "@Jahrein",
    url: "https://youtube.com/@Jahrein",
    bio: "Tartışma, gündem ve oyun içerikleriyle geniş bir kitleye ulaşan deneyimli yayıncı.",
    supporters: 2110,
  },
  {
    slug: "pqueen",
    name: "PQueen",
    platform: "YouTube",
    handle: "@PQueen",
    url: "https://youtube.com/@PQueen",
    bio: "Oyun ve yaşam tarzı içerikleriyle Türkiye'nin önde gelen kadın içerik üreticilerinden.",
    supporters: 1560,
  },
  {
    slug: "unlostv",
    name: "UnlosTV",
    platform: "Kick",
    handle: "@unlostv",
    url: "https://kick.com/unlostv",
    bio: "Enerjik yayın tarzı ve turnuva içerikleriyle bilinen popüler Kick yayıncısı.",
    supporters: 870,
  },
  {
    slug: "berkcan-guven",
    name: "Berkcan Güven",
    platform: "YouTube",
    handle: "@BerkcanGuven",
    url: "https://youtube.com/@BerkcanGuven",
    bio: "Mizah ve sosyal deney videolarıyla milyonlarca aboneye sahip içerik üreticisi.",
    supporters: 3050,
  },
  {
    slug: "zerforum",
    name: "Zerforum",
    platform: "TikTok",
    handle: "@zerforum",
    url: "https://tiktok.com/@zerforum",
    bio: "Kısa oyun klipleri ve eğlence içerikleriyle TikTok'ta hızla büyüyen yayıncı.",
    supporters: 640,
  },
  {
    slug: "kendine-muzisyen",
    name: "Kendine Müzisyen",
    platform: "YouTube",
    handle: "@KendineMuzisyen",
    url: "https://youtube.com/@KendineMuzisyen",
    bio: "Müzik, mizah ve oyun içeriklerini harmanlayan özgün bir içerik üreticisi.",
    supporters: 1890,
  },
];

/** PUBLISHERS bio çevirileri — slug anahtarlı (isim/handle/platform korunur). */
const PUBLISHERS_I18N: Partial<Record<Locale, Record<string, string>>> = {
  en: {
    elraenn: "One of Turkey’s most-watched Twitch streamers. Produces chat and competitive gaming content.",
    wtcn: "Content creator and former pro player known for his Valorant- and FPS-focused streams.",
    jahrein: "An experienced streamer reaching a wide audience with debate, current-affairs and gaming content.",
    pqueen: "One of Turkey’s leading female content creators with gaming and lifestyle content.",
    unlostv: "A popular Kick streamer known for his energetic streaming style and tournament content.",
    "berkcan-guven": "A content creator with millions of subscribers known for comedy and social-experiment videos.",
    zerforum: "A streamer growing fast on TikTok with short gaming clips and entertainment content.",
    "kendine-muzisyen": "An original content creator blending music, comedy and gaming content.",
  },
  de: {
    elraenn: "Einer der meistgesehenen Twitch-Streamer der Türkei. Produziert Chat- und kompetitive Gaming-Inhalte.",
    wtcn: "Content-Creator und ehemaliger Profispieler, bekannt für seine auf Valorant und FPS ausgerichteten Streams.",
    jahrein: "Ein erfahrener Streamer, der mit Debatten-, Aktuelles- und Gaming-Inhalten ein breites Publikum erreicht.",
    pqueen: "Eine der führenden weiblichen Content-Creatorinnen der Türkei mit Gaming- und Lifestyle-Inhalten.",
    unlostv: "Ein beliebter Kick-Streamer, bekannt für seinen energiegeladenen Streaming-Stil und Turnierinhalte.",
    "berkcan-guven": "Ein Content-Creator mit Millionen Abonnenten, bekannt für Comedy- und Social-Experiment-Videos.",
    zerforum: "Ein auf TikTok schnell wachsender Streamer mit kurzen Gaming-Clips und Unterhaltungsinhalten.",
    "kendine-muzisyen": "Ein origineller Content-Creator, der Musik-, Comedy- und Gaming-Inhalte vereint.",
  },
  ar: {
    elraenn: "أحد أكثر بثّاثي Twitch مشاهدةً في تركيا. يقدّم محتوى الدردشة والألعاب التنافسية.",
    wtcn: "صانع محتوى ولاعب محترف سابق، معروف ببثّه المركّز على Valorant وألعاب التصويب.",
    jahrein: "بثّاث متمرّس يصل إلى جمهور واسع بمحتوى النقاش والأحداث الجارية والألعاب.",
    pqueen: "من أبرز صانعات المحتوى في تركيا بمحتوى الألعاب وأسلوب الحياة.",
    unlostv: "بثّاث Kick شهير معروف بأسلوب بثّه الحيوي ومحتوى البطولات.",
    "berkcan-guven": "صانع محتوى لديه ملايين المشتركين، معروف بمقاطع الكوميديا والتجارب الاجتماعية.",
    zerforum: "بثّاث ينمو بسرعة على TikTok بمقاطع ألعاب قصيرة ومحتوى ترفيهي.",
    "kendine-muzisyen": "صانع محتوى أصيل يمزج بين الموسيقى والكوميديا والألعاب.",
  },
  ru: {
    elraenn: "Один из самых популярных стримеров Twitch в Турции. Создаёт чат- и соревновательный игровой контент.",
    wtcn: "Создатель контента и бывший профессиональный игрок, известный стримами по Valorant и FPS.",
    jahrein: "Опытный стример, охватывающий широкую аудиторию контентом о дискуссиях, актуальных темах и играх.",
    pqueen: "Одна из ведущих женщин — создателей контента в Турции с игровым и lifestyle-контентом.",
    unlostv: "Популярный стример Kick, известный энергичным стилем стримов и турнирным контентом.",
    "berkcan-guven": "Создатель контента с миллионами подписчиков, известный комедийными видео и социальными экспериментами.",
    zerforum: "Стример, быстро растущий в TikTok, с короткими игровыми клипами и развлекательным контентом.",
    "kendine-muzisyen": "Самобытный создатель контента, сочетающий музыку, юмор и игры.",
  },
};

/** Yetkili bayiler — EpinFox ürünlerini satan iş ortakları. */
export interface Reseller {
  slug: string;
  name: string;
  city: string;
  url: string; // bayinin kendi sitesi
  verified: boolean; // doğrulanmış bayi rozeti
}

export const RESELLERS: Reseller[] = [
  { slug: "oyunmarket", name: "OyunMarket", city: "İstanbul", url: "https://oyunmarket.example.com", verified: true },
  { slug: "epinhane", name: "EpinHane", city: "Ankara", url: "https://epinhane.example.com", verified: true },
  { slug: "dijitalkod", name: "DijitalKod", city: "İzmir", url: "https://dijitalkod.example.com", verified: true },
  { slug: "gamestore-tr", name: "GameStore TR", city: "Bursa", url: "https://gamestore-tr.example.com", verified: true },
  { slug: "pinbakkal", name: "PinBakkal", city: "Antalya", url: "https://pinbakkal.example.com", verified: false },
  { slug: "kodmagaza", name: "KodMağaza", city: "Adana", url: "https://kodmagaza.example.com", verified: true },
  { slug: "hizliepin", name: "HızlıEpin", city: "Konya", url: "https://hizliepin.example.com", verified: true },
  { slug: "oyunbazaar", name: "OyunBazaar", city: "Gaziantep", url: "https://oyunbazaar.example.com", verified: false },
];
