import type { Dict } from "./core";

// Bu parça dosyası tanıtım/içerik sayfalarının (earn, about, contact, raffles)
// çeviri anahtarlarını içerir. dictionaries.ts core + tüm parçaları birleştirir.

export const tr: Dict = {
  // ───────────────────────── EARN (Para Kazan) ─────────────────────────
  "pages.earn.meta.title": "Para Kazan",
  "pages.earn.meta.desc":
    "EpinFox içeriğini sosyal medyada paylaş, onaylanınca cüzdanına bakiye ödülü kazan.",
  "pages.earn.badge": "Para Kazan",
  "pages.earn.heroTitle": "İçeriğimizi paylaş, bakiye kazan",
  "pages.earn.heroDesc":
    "EpinFox'u sosyal medyada paylaş, onaylanan her içerik için cüzdanına bakiye ödülü kazan. Ne kadar paylaşırsan o kadar kazanırsın.",
  "pages.earn.howTitle": "Nasıl çalışır?",
  "pages.earn.step1.title": "Paylaş",
  "pages.earn.step1.desc":
    "EpinFox ürünlerini, kampanyalarını veya deneyimini Instagram, TikTok, YouTube ya da X'te paylaş.",
  "pages.earn.step2.title": "Gönder",
  "pages.earn.step2.desc":
    "Paylaşımının linkini ve istersen ekran görüntüsünü bu sayfadan bize gönder.",
  "pages.earn.step3.title": "Kazan",
  "pages.earn.step3.desc":
    "Ekibimiz inceleyip onayladığında ödülün anında cüzdanına bakiye olarak eklenir.",
  "pages.earn.faqTitle": "Sık Sorulan Sorular",
  "pages.earn.faq1.q": "Ne kadar kazanırım?",
  "pages.earn.faq1.a":
    "Ödül, paylaşımının erişimine ve kalitesine göre belirlenir. Daha fazla gerçek izlenme/etkileşim alan, kurallara uygun içerikler daha yüksek ödül kazanır. Ödül tutarı onay sırasında belirlenip cüzdanına bakiye olarak eklenir.",
  "pages.earn.faq2.q": "Hangi içerikler kabul edilir?",
  "pages.earn.faq2.a":
    "EpinFox'u tanıtan özgün içerikler: ürün/kampanya paylaşımı, deneyim videosu, hikâye/story, kısa video (Reels/Shorts) veya gönderi. İçerik herkese açık olmalı ve EpinFox'a net şekilde atıfta bulunmalı.",
  "pages.earn.faq3.q": "Hangi platformlar geçerli?",
  "pages.earn.faq3.a":
    "Instagram, TikTok, YouTube ve X (Twitter) paylaşımları kabul edilir. Hesabın herkese açık olmalı ki incelemede paylaşımı görebilelim.",
  "pages.earn.faq4.q": "Paylaşımım ne zaman değerlendirilir?",
  "pages.earn.faq4.a":
    "Gönderiler genellikle 1-3 iş günü içinde incelenir. Sonuç (onay/ret) hesabına bildirim olarak gelir; onaylanırsa ödül anında cüzdanına yansır.",
  "pages.earn.faq5.q": "Kaç paylaşım gönderebilirim?",
  "pages.earn.faq5.a":
    "Sınır yok — kurallara uygun her özgün paylaşım için ayrı ödül kazanabilirsin. Ancak aynı paylaşımı (aynı linki) yalnızca bir kez gönderebilirsin.",
  "pages.earn.faq6.q": "Hangi durumlarda reddedilir?",
  "pages.earn.faq6.a":
    "Sahte etkileşim/bot, alakasız içerik, EpinFox'a atıf içermeyen paylaşımlar, gizli hesaplar, kopya/çalıntı içerik ve yanıltıcı paylaşımlar reddedilir. Tekrarlayan ihlaller programdan çıkarılmaya yol açabilir.",
  "pages.earn.faq7.q": "Ödülü nasıl kullanırım?",
  "pages.earn.faq7.a":
    "Kazandığın bakiyeyi EpinFox'taki tüm ürün ve hizmetlerde anında kullanabilirsin. Bakiye, cüzdanına diğer yüklemelerinle aynı şekilde tanımlanır.",

  // earn-submit-form
  "pages.earn.form.title": "Paylaşımını gönder",
  "pages.earn.form.subtitle":
    "Paylaştığın içeriğin linkini ekle, ekibimiz inceleyip ödülünü versin.",
  "pages.earn.form.loginDesc": "Para kazanmaya başlamak için giriş yapman gerekiyor.",
  "pages.earn.form.loginCta": "Giriş Yap",
  "pages.earn.form.platform": "Platform",
  "pages.earn.platform.other": "Diğer",
  "pages.earn.form.linkLabel": "Paylaşım linki",
  "pages.earn.form.noteLabel": "Not (opsiyonel)",
  "pages.earn.form.notePlaceholder": "Eklemek istediğin bir şey varsa yaz.",
  "pages.earn.form.proofLabel": "Kanıt görseli (opsiyonel, en fazla 3)",
  "pages.earn.form.filesSelected": "dosya seçildi",
  "pages.earn.form.addScreenshot": "Ekran görüntüsü ekle",
  "pages.earn.form.success": "Başvurun alındı! İncelemeden sonra sonucu bildireceğiz.",
  "pages.earn.form.submitting": "Gönderiliyor…",
  "pages.earn.form.submit": "Paylaşımı Gönder",

  // earn-history
  "pages.earn.history.title": "Başvurularım",
  "pages.earn.history.earnedSuffix": "kazandın",
  "pages.earn.history.loginTitle": "Giriş yapınca burada görünür",
  "pages.earn.history.loginDesc":
    "Başvurularını ve ödüllerini takip etmek için giriş yap.",
  "pages.earn.history.emptyTitle": "Henüz başvuru yok",
  "pages.earn.history.emptyDesc": "İlk paylaşımını gönder, ödül kazanmaya başla.",
  "pages.earn.status.pending": "İnceleniyor",
  "pages.earn.status.approved": "Onaylandı",
  "pages.earn.status.rejected": "Reddedildi",

  // ───────────────────────── ABOUT (Hakkımızda) ─────────────────────────
  "pages.about.meta.title": "Hakkımızda",
  "pages.about.meta.desc": "EpinFox — dijital kod ve oyun bakiyesi platformu hakkında.",
  "pages.about.badge": "Hakkımızda",
  "pages.about.heroTitle.pre": "Dijital kod alışverişini",
  "pages.about.heroTitle.accent": "saniyelere",
  "pages.about.heroTitle.post": "indirdik",
  "pages.about.heroDesc":
    "EpinFox; oyun e-pinleri, platform bakiyeleri, abonelikler ve dijital hizmetleri güvenli, hızlı ve uygun komisyonla teslim eden bir dijital kod platformudur. Amacımız tek: oyuncuya en sorunsuz alışveriş deneyimini sunmak.",
  "pages.about.stat1.value": "7/24",
  "pages.about.stat1.label": "Otomatik teslimat",
  "pages.about.stat2.value": "1000+",
  "pages.about.stat2.label": "Dijital ürün",
  "pages.about.stat3.value": "%100",
  "pages.about.stat3.label": "Güvenli ödeme",
  "pages.about.stat4.value": "Anlık",
  "pages.about.stat4.label": "Kod teslimi",
  "pages.about.valuesTitle": "Neden EpinFox?",
  "pages.about.valuesSubtitle":
    "Binlerce oyuncunun EpinFox'u tercih etmesinin altı sebebi.",
  "pages.about.value1.title": "Anlık Teslimat",
  "pages.about.value1.text":
    "Ödeme onaylandığı an kodun hesabında. Saniyeler içinde, gece-gündüz fark etmeksizin otomatik teslimat.",
  "pages.about.value2.title": "Güvenli Alışveriş",
  "pages.about.value2.text":
    "Tüm ürün kodları şifrelenerek saklanır, ödemeler SSL ile korunur. Dolandırıcılık önleme sistemleri 7/24 aktif.",
  "pages.about.value3.title": "Cüzdan Modeli",
  "pages.about.value3.text":
    "Bakiyeni bir kez yükle, tek tıkla harca. Her alışverişte kart bilgisi girme, hızlı ve pratik öde.",
  "pages.about.value4.title": "7/24 Destek",
  "pages.about.value4.text":
    "AI destek asistanı ve insan ekibimizle her zaman yanındayız. Sorunların hızla çözülür.",
  "pages.about.value5.title": "Ödüller & Bonuslar",
  "pages.about.value5.text":
    "Yükleme bonusları, ödüllü çekilişler ve referans avantajlarıyla her zaman daha fazlasını kazan.",
  "pages.about.value6.title": "Yasal Uyumluluk",
  "pages.about.value6.text":
    "ETBİS'e kayıtlı, KVKK ve mesafeli satış mevzuatına tam uyumlu, şeffaf bir e-ticaret platformu.",
  "pages.about.stepsTitle": "Üç adımda alışveriş",
  "pages.about.stepsSubtitle":
    "Karmaşa yok, bekleme yok. Yükle, seç, anında teslim al.",
  "pages.about.step1.title": "Bakiye Yükle",
  "pages.about.step1.text":
    "Cüzdanına güvenli ödeme yöntemleriyle bakiye yükle. Yükleme bonuslarından faydalan.",
  "pages.about.step2.title": "Ürünü Seç",
  "pages.about.step2.text":
    "Binlerce oyun e-pini, platform bakiyesi ve aboneliği mağazadan keşfet, sepete ekle.",
  "pages.about.step3.title": "Anında Teslim Al",
  "pages.about.step3.text":
    "Kodun saniyeler içinde Siparişlerim sayfanda ve e-postanda. Hemen kullanmaya başla.",
  "pages.about.mission.title": "Misyonumuz ve Yaklaşımımız",
  "pages.about.mission.intro":
    "EpinFox olarak, dijital ürün alışverişinin hızlı, güvenli ve şeffaf olması gerektiğine inanıyoruz. Geleneksel bayilerde yaşanan gecikmeler, gizli komisyonlar ve güven sorunlarını ortadan kaldırmak için cüzdan tabanlı, otomatik teslimat yapan bir altyapı kurduk.",
  "pages.about.mission.h1": "Müşteri Önceliği",
  "pages.about.mission.p1":
    "Her kararımızın merkezinde kullanıcı deneyimi var. Sipariş akışından destek süreçlerine, fiyatlandırmadan güvenlik önlemlerine kadar her adımı oyuncunun lehine tasarlıyoruz. Geri bildirimlerinle platformu birlikte geliştiriyoruz.",
  "pages.about.mission.h2": "Güven ve Yasal Uyumluluk",
  "pages.about.mission.p2":
    "EpinFox, ETBİS'e kayıtlı bir e-ticaret platformudur. Mesafeli satış, kişisel verilerin korunması (KVKK) ve geri ödeme süreçlerimiz yürürlükteki yasal mevzuata tam uyumludur. Tüm işlemlerin kayıt altındadır ve şeffaftır.",
  "pages.about.mission.h3": "Sürekli Gelişim",
  "pages.about.mission.p3":
    "Ürün yelpazemizi, ödeme seçeneklerimizi ve avantaj programlarımızı sürekli genişletiyoruz. Ödüllü çekilişler, referans programı ve yükleme bonuslarıyla sana her zaman daha fazlasını sunmayı hedefliyoruz.",
  "pages.about.cta.title": "Aramıza katıl",
  "pages.about.cta.desc":
    "Cüzdanına yükle, binlerce dijital ürünü keşfet, ödüllü çekilişlere ücretsiz katıl.",
  "pages.about.cta.store": "Mağazayı Keşfet",
  "pages.about.cta.contact": "Bize Ulaş",

  // ───────────────────────── CONTACT (İletişim) ─────────────────────────
  "pages.contact.meta.title": "İletişim",
  "pages.contact.meta.desc":
    "EpinFox ile iletişime geç — e-posta, canlı destek ve kurumsal bilgiler.",
  "pages.contact.badge": "İletişim",
  "pages.contact.heroTitle": "Bize ulaş, hemen dönelim",
  "pages.contact.heroDesc":
    "EpinFox ekibi her zaman yanında. Sana en uygun kanalı seç — siparişlerin anında, desteğimiz kesintisiz.",
  "pages.contact.channel.live.title": "Canlı Destek",
  "pages.contact.channel.live.value": "Sağ alttaki sohbet balonu",
  "pages.contact.channel.live.desc":
    "AI destek asistanımız 7/24 anında yanıt verir. En hızlı çözüm kanalı.",
  "pages.contact.channel.support.title": "Destek Talebi",
  "pages.contact.channel.support.value": "Talep oluştur",
  "pages.contact.channel.support.desc":
    "Sipariş veya cüzdan sorunların için kayıtlı talep aç, takip et.",
  "pages.contact.channel.email.title": "E-posta",
  "pages.contact.channel.email.desc":
    "Genel sorular, iş birlikleri ve kurumsal talepler için.",
  "pages.contact.channel.phone.title": "Telefon",
  "pages.contact.channel.phone.desc":
    "Çalışma saatleri içinde telefonla da bize ulaşabilirsin.",
  "pages.contact.hours.title": "Çalışma Saatleri",
  "pages.contact.hours.pre": "Sipariş ve teslimat",
  "pages.contact.hours.strong": "7/24 otomatik",
  "pages.contact.hours.post":
    ". Canlı destek kesintisiz, e-posta/telefon yanıtları çalışma saatleri içinde.",
  "pages.contact.corp.title": "Kurumsal Bilgiler",
  "pages.contact.corp.subtitle": "Resmi şirket ve kayıt bilgilerimiz aşağıdadır.",
  "pages.contact.corp.company": "Unvan",
  "pages.contact.corp.address": "Adres",
  "pages.contact.corp.tax": "Vergi Dairesi / No",
  "pages.contact.corp.mersis": "MERSİS No",
  "pages.contact.corp.etbis": "ETBİS Kayıt No",
  "pages.contact.corp.email": "E-posta",
  "pages.contact.corp.phone": "Telefon",
  "pages.contact.corp.kep": "KEP Adresi",
  "pages.contact.faq.title": "Önce yanıtları kontrol et",
  "pages.contact.faq.desc": "Sık sorulan soruların çoğu Yardım Merkezi'nde yanıtlı.",

  // ───────────────────────── RAFFLES (Çekilişler) ─────────────────────────
  "pages.raffles.meta.title": "Çekilişler",
  "pages.raffles.meta.desc":
    "EpinFox ödüllü çekilişleri — PS5, iPhone, Steam Deck ve bakiye ödülleri. Bakiye yükle, çekiliş hakkı kazan.",
  "pages.raffles.heroImageAlt":
    "EpinFox çekiliş ödülleri — PS5, telefon, oyun konsolu ve kupa",
  "pages.raffles.badge": "Ödüllü Çekilişler",
  "pages.raffles.heroTitle.pre": "Bakiye Yükle,",
  "pages.raffles.heroTitle.accent": "Büyük Ödülleri",
  "pages.raffles.heroTitle.post": "Kazan",
  "pages.raffles.heroDesc":
    "Her 100₺ yükleme bir çekiliş hakkı. PS5, iPhone, Steam Deck ve binlerce TL bakiye ödülü seni bekliyor — katılım tamamen ücretsiz.",
  "pages.raffles.stat.raffles": "Çekiliş",
  "pages.raffles.stat.participants": "Katılımcı",
  "pages.raffles.stat.free.value": "Ücretsiz",
  "pages.raffles.stat.free.label": "Katılım",
  "pages.raffles.status.active": "Aktif",
  "pages.raffles.status.upcoming": "Yakında",
  "pages.raffles.status.ended": "Sonuçlandı",
  "pages.raffles.section.active.title": "Aktif Çekilişler",
  "pages.raffles.section.active.subtitle": "Şu an katılabileceğin çekilişler",
  "pages.raffles.section.upcoming.title": "Yakında Başlıyor",
  "pages.raffles.section.upcoming.subtitle": "Bildirimleri aç, ilk katılanlardan ol",
  "pages.raffles.section.ended.title": "Sonuçlanan Çekilişler",
  "pages.raffles.section.ended.subtitle":
    "Geçmiş kazananlar ve teslim edilen ödüller",
  "pages.raffles.card.participantsSuffix": "katılımcı",
  "pages.raffles.card.free": "Ücretsiz katılım",
  "pages.raffles.card.perTicket": "/ bilet",
  "pages.raffles.card.winnerLabel": "Kazanan:",
  "pages.raffles.card.winnerAnnounced": "Açıklandı",
  "pages.raffles.card.startsIn": "Başlamasına kalan",
  "pages.raffles.card.upcomingBtn": "Yakında başlıyor",
  "pages.raffles.card.timeLeft": "Çekilişe kalan süre",
  "pages.raffles.card.joinCta": "Bakiye Yükle, Katıl",
  "pages.raffles.how.title": "Nasıl Katılırım?",
  "pages.raffles.how.subtitle": "Üç adımda büyük ödüllere bir adım daha yakın.",
  "pages.raffles.how.step1.title": "Bakiye Yükle",
  "pages.raffles.how.step1.text":
    "Her 100₺ yükleme otomatik olarak 1 çekiliş hakkı kazandırır.",
  "pages.raffles.how.step2.title": "Otomatik Katıl",
  "pages.raffles.how.step2.text":
    "Aktif çekilişlere biletlerin anında ve ücretsiz tanımlanır.",
  "pages.raffles.how.step3.title": "Kazan & Teslim Al",
  "pages.raffles.how.step3.text":
    "Çekiliş günü kazananlar yayınlanır, ödül anında teslim edilir.",
  "pages.raffles.how.disclaimer":
    "Tüm çekilişler noter / canlı yayın eşliğinde, şeffaf şekilde yapılır.",
};

export const en: Dict = {
  // EARN
  "pages.earn.meta.title": "Earn Money",
  "pages.earn.meta.desc":
    "Share EpinFox content on social media and earn wallet balance rewards once approved.",
  "pages.earn.badge": "Earn Money",
  "pages.earn.heroTitle": "Share our content, earn balance",
  "pages.earn.heroDesc":
    "Share EpinFox on social media and earn a wallet balance reward for every approved post. The more you share, the more you earn.",
  "pages.earn.howTitle": "How does it work?",
  "pages.earn.step1.title": "Share",
  "pages.earn.step1.desc":
    "Share EpinFox products, campaigns or your experience on Instagram, TikTok, YouTube or X.",
  "pages.earn.step2.title": "Submit",
  "pages.earn.step2.desc":
    "Send us the link to your post and, if you like, a screenshot from this page.",
  "pages.earn.step3.title": "Earn",
  "pages.earn.step3.desc":
    "Once our team reviews and approves it, your reward is added to your wallet balance instantly.",
  "pages.earn.faqTitle": "Frequently Asked Questions",
  "pages.earn.faq1.q": "How much will I earn?",
  "pages.earn.faq1.a":
    "The reward is based on the reach and quality of your post. Compliant content with more genuine views/engagement earns a higher reward. The reward amount is set at approval and added to your wallet as balance.",
  "pages.earn.faq2.q": "What kind of content is accepted?",
  "pages.earn.faq2.a":
    "Original content promoting EpinFox: product/campaign posts, experience videos, stories, short videos (Reels/Shorts) or posts. Content must be public and clearly reference EpinFox.",
  "pages.earn.faq3.q": "Which platforms are eligible?",
  "pages.earn.faq3.a":
    "Posts on Instagram, TikTok, YouTube and X (Twitter) are accepted. Your account must be public so we can review the post.",
  "pages.earn.faq4.q": "When is my post reviewed?",
  "pages.earn.faq4.a":
    "Submissions are usually reviewed within 1-3 business days. The result (approval/rejection) arrives as a notification on your account; if approved, the reward is added to your wallet instantly.",
  "pages.earn.faq5.q": "How many posts can I submit?",
  "pages.earn.faq5.a":
    "No limit — you can earn a separate reward for every compliant original post. However, you can submit the same post (same link) only once.",
  "pages.earn.faq6.q": "When is a submission rejected?",
  "pages.earn.faq6.a":
    "Fake engagement/bots, irrelevant content, posts without an EpinFox reference, private accounts, copied/stolen content and misleading posts are rejected. Repeated violations may lead to removal from the program.",
  "pages.earn.faq7.q": "How do I use my reward?",
  "pages.earn.faq7.a":
    "You can use your earned balance instantly across all EpinFox products and services. The balance is added to your wallet just like your other top-ups.",

  "pages.earn.form.title": "Submit your post",
  "pages.earn.form.subtitle":
    "Add the link to the content you shared, and our team will review it and give your reward.",
  "pages.earn.form.loginDesc": "You need to sign in to start earning money.",
  "pages.earn.form.loginCta": "Sign In",
  "pages.earn.form.platform": "Platform",
  "pages.earn.platform.other": "Other",
  "pages.earn.form.linkLabel": "Post link",
  "pages.earn.form.noteLabel": "Note (optional)",
  "pages.earn.form.notePlaceholder": "Write anything you'd like to add.",
  "pages.earn.form.proofLabel": "Proof image (optional, up to 3)",
  "pages.earn.form.filesSelected": "files selected",
  "pages.earn.form.addScreenshot": "Add a screenshot",
  "pages.earn.form.success":
    "Your submission has been received! We'll let you know the result after review.",
  "pages.earn.form.submitting": "Submitting…",
  "pages.earn.form.submit": "Submit Post",

  "pages.earn.history.title": "My Submissions",
  "pages.earn.history.earnedSuffix": "earned",
  "pages.earn.history.loginTitle": "Visible here after you sign in",
  "pages.earn.history.loginDesc": "Sign in to track your submissions and rewards.",
  "pages.earn.history.emptyTitle": "No submissions yet",
  "pages.earn.history.emptyDesc":
    "Submit your first post and start earning rewards.",
  "pages.earn.status.pending": "Under Review",
  "pages.earn.status.approved": "Approved",
  "pages.earn.status.rejected": "Rejected",

  // ABOUT
  "pages.about.meta.title": "About Us",
  "pages.about.meta.desc":
    "EpinFox — about the digital code and game balance platform.",
  "pages.about.badge": "About Us",
  "pages.about.heroTitle.pre": "We brought digital code shopping",
  "pages.about.heroTitle.accent": "down to seconds",
  "pages.about.heroTitle.post": "",
  "pages.about.heroDesc":
    "EpinFox is a digital code platform that delivers game e-pins, platform balances, subscriptions and digital services securely, quickly and at fair rates. Our single goal: to give gamers the most seamless shopping experience.",
  "pages.about.stat1.value": "24/7",
  "pages.about.stat1.label": "Automatic delivery",
  "pages.about.stat2.value": "1000+",
  "pages.about.stat2.label": "Digital products",
  "pages.about.stat3.value": "100%",
  "pages.about.stat3.label": "Secure payment",
  "pages.about.stat4.value": "Instant",
  "pages.about.stat4.label": "Code delivery",
  "pages.about.valuesTitle": "Why EpinFox?",
  "pages.about.valuesSubtitle":
    "Six reasons why thousands of gamers choose EpinFox.",
  "pages.about.value1.title": "Instant Delivery",
  "pages.about.value1.text":
    "Your code is in your account the moment payment is confirmed. Automatic delivery in seconds, day or night.",
  "pages.about.value2.title": "Secure Shopping",
  "pages.about.value2.text":
    "All product codes are stored encrypted and payments are protected with SSL. Fraud prevention systems are active 24/7.",
  "pages.about.value3.title": "Wallet Model",
  "pages.about.value3.text":
    "Top up once, spend with a single click. No card details on every purchase — fast and practical payment.",
  "pages.about.value4.title": "24/7 Support",
  "pages.about.value4.text":
    "Our AI support assistant and human team are always by your side. Your issues are resolved quickly.",
  "pages.about.value5.title": "Rewards & Bonuses",
  "pages.about.value5.text":
    "Earn more every time with top-up bonuses, prize raffles and referral perks.",
  "pages.about.value6.title": "Legal Compliance",
  "pages.about.value6.text":
    "Registered with ETBİS, fully compliant with KVKK and distance selling regulations — a transparent e-commerce platform.",
  "pages.about.stepsTitle": "Shop in three steps",
  "pages.about.stepsSubtitle":
    "No hassle, no waiting. Top up, choose, get instant delivery.",
  "pages.about.step1.title": "Top Up Balance",
  "pages.about.step1.text":
    "Top up your wallet with secure payment methods. Benefit from top-up bonuses.",
  "pages.about.step2.title": "Pick a Product",
  "pages.about.step2.text":
    "Discover thousands of game e-pins, platform balances and subscriptions in the store, add to cart.",
  "pages.about.step3.title": "Get Instant Delivery",
  "pages.about.step3.text":
    "Your code is on your Orders page and in your email within seconds. Start using it right away.",
  "pages.about.mission.title": "Our Mission and Approach",
  "pages.about.mission.intro":
    "At EpinFox, we believe digital product shopping should be fast, secure and transparent. To eliminate the delays, hidden commissions and trust issues found at traditional resellers, we built a wallet-based infrastructure with automatic delivery.",
  "pages.about.mission.h1": "Customer Priority",
  "pages.about.mission.p1":
    "User experience is at the center of every decision we make. From the order flow to support processes, from pricing to security measures, we design every step in the gamer's favor. We improve the platform together with your feedback.",
  "pages.about.mission.h2": "Trust and Legal Compliance",
  "pages.about.mission.p2":
    "EpinFox is an e-commerce platform registered with ETBİS. Our distance selling, personal data protection (KVKK) and refund processes fully comply with applicable legislation. All your transactions are recorded and transparent.",
  "pages.about.mission.h3": "Continuous Improvement",
  "pages.about.mission.p3":
    "We continuously expand our product range, payment options and benefit programs. With prize raffles, a referral program and top-up bonuses, we aim to always offer you more.",
  "pages.about.cta.title": "Join us",
  "pages.about.cta.desc":
    "Top up your wallet, discover thousands of digital products, and join prize raffles for free.",
  "pages.about.cta.store": "Explore the Store",
  "pages.about.cta.contact": "Contact Us",

  // CONTACT
  "pages.contact.meta.title": "Contact",
  "pages.contact.meta.desc":
    "Get in touch with EpinFox — email, live support and corporate information.",
  "pages.contact.badge": "Contact",
  "pages.contact.heroTitle": "Reach out, we'll respond right away",
  "pages.contact.heroDesc":
    "The EpinFox team is always by your side. Choose the channel that suits you best — your orders are instant, our support is uninterrupted.",
  "pages.contact.channel.live.title": "Live Support",
  "pages.contact.channel.live.value": "Chat bubble at the bottom right",
  "pages.contact.channel.live.desc":
    "Our AI support assistant responds instantly 24/7. The fastest resolution channel.",
  "pages.contact.channel.support.title": "Support Request",
  "pages.contact.channel.support.value": "Create a request",
  "pages.contact.channel.support.desc":
    "Open and track a logged request for your order or wallet issues.",
  "pages.contact.channel.email.title": "Email",
  "pages.contact.channel.email.desc":
    "For general questions, collaborations and corporate requests.",
  "pages.contact.channel.phone.title": "Phone",
  "pages.contact.channel.phone.desc":
    "You can also reach us by phone during business hours.",
  "pages.contact.hours.title": "Business Hours",
  "pages.contact.hours.pre": "Orders and delivery are",
  "pages.contact.hours.strong": "automatic 24/7",
  "pages.contact.hours.post":
    ". Live support is uninterrupted; email/phone replies are during business hours.",
  "pages.contact.corp.title": "Corporate Information",
  "pages.contact.corp.subtitle":
    "Our official company and registration details are below.",
  "pages.contact.corp.company": "Title",
  "pages.contact.corp.address": "Address",
  "pages.contact.corp.tax": "Tax Office / No",
  "pages.contact.corp.mersis": "MERSİS No",
  "pages.contact.corp.etbis": "ETBİS Registration No",
  "pages.contact.corp.email": "Email",
  "pages.contact.corp.phone": "Phone",
  "pages.contact.corp.kep": "KEP Address",
  "pages.contact.faq.title": "Check the answers first",
  "pages.contact.faq.desc":
    "Most frequently asked questions are answered in the Help Center.",

  // RAFFLES
  "pages.raffles.meta.title": "Raffles",
  "pages.raffles.meta.desc":
    "EpinFox prize raffles — PS5, iPhone, Steam Deck and balance rewards. Top up your balance and earn raffle entries.",
  "pages.raffles.heroImageAlt":
    "EpinFox raffle prizes — PS5, phone, game console and trophy",
  "pages.raffles.badge": "Prize Raffles",
  "pages.raffles.heroTitle.pre": "Top Up Balance,",
  "pages.raffles.heroTitle.accent": "Win Big",
  "pages.raffles.heroTitle.post": "Prizes",
  "pages.raffles.heroDesc":
    "Every ₺100 top-up earns a raffle entry. PS5, iPhone, Steam Deck and thousands of TL in balance rewards are waiting — participation is completely free.",
  "pages.raffles.stat.raffles": "Raffles",
  "pages.raffles.stat.participants": "Participants",
  "pages.raffles.stat.free.value": "Free",
  "pages.raffles.stat.free.label": "Entry",
  "pages.raffles.status.active": "Active",
  "pages.raffles.status.upcoming": "Upcoming",
  "pages.raffles.status.ended": "Ended",
  "pages.raffles.section.active.title": "Active Raffles",
  "pages.raffles.section.active.subtitle": "Raffles you can join right now",
  "pages.raffles.section.upcoming.title": "Starting Soon",
  "pages.raffles.section.upcoming.subtitle":
    "Turn on notifications, be among the first to join",
  "pages.raffles.section.ended.title": "Completed Raffles",
  "pages.raffles.section.ended.subtitle": "Past winners and delivered prizes",
  "pages.raffles.card.participantsSuffix": "participants",
  "pages.raffles.card.free": "Free entry",
  "pages.raffles.card.perTicket": "/ ticket",
  "pages.raffles.card.winnerLabel": "Winner:",
  "pages.raffles.card.winnerAnnounced": "Announced",
  "pages.raffles.card.startsIn": "Time until start",
  "pages.raffles.card.upcomingBtn": "Starting soon",
  "pages.raffles.card.timeLeft": "Time left for the raffle",
  "pages.raffles.card.joinCta": "Top Up Balance, Join",
  "pages.raffles.how.title": "How Do I Join?",
  "pages.raffles.how.subtitle": "One step closer to big prizes in three steps.",
  "pages.raffles.how.step1.title": "Top Up Balance",
  "pages.raffles.how.step1.text":
    "Every ₺100 top-up automatically earns 1 raffle entry.",
  "pages.raffles.how.step2.title": "Join Automatically",
  "pages.raffles.how.step2.text":
    "Your tickets to active raffles are assigned instantly and for free.",
  "pages.raffles.how.step3.title": "Win & Receive",
  "pages.raffles.how.step3.text":
    "Winners are announced on raffle day, and the prize is delivered instantly.",
  "pages.raffles.how.disclaimer":
    "All raffles are held transparently, with a notary / live broadcast.",
};

export const de: Dict = {
  // EARN
  "pages.earn.meta.title": "Geld verdienen",
  "pages.earn.meta.desc":
    "Teile EpinFox-Inhalte in sozialen Medien und verdiene nach Freigabe Guthaben für deine Wallet.",
  "pages.earn.badge": "Geld verdienen",
  "pages.earn.heroTitle": "Teile unsere Inhalte, verdiene Guthaben",
  "pages.earn.heroDesc":
    "Teile EpinFox in sozialen Medien und verdiene für jeden freigegebenen Beitrag eine Guthaben-Belohnung. Je mehr du teilst, desto mehr verdienst du.",
  "pages.earn.howTitle": "Wie funktioniert es?",
  "pages.earn.step1.title": "Teilen",
  "pages.earn.step1.desc":
    "Teile EpinFox-Produkte, Kampagnen oder deine Erfahrung auf Instagram, TikTok, YouTube oder X.",
  "pages.earn.step2.title": "Einreichen",
  "pages.earn.step2.desc":
    "Sende uns über diese Seite den Link zu deinem Beitrag und auf Wunsch einen Screenshot.",
  "pages.earn.step3.title": "Verdienen",
  "pages.earn.step3.desc":
    "Sobald unser Team ihn geprüft und freigegeben hat, wird deine Belohnung sofort als Guthaben in deine Wallet gebucht.",
  "pages.earn.faqTitle": "Häufig gestellte Fragen",
  "pages.earn.faq1.q": "Wie viel verdiene ich?",
  "pages.earn.faq1.a":
    "Die Belohnung richtet sich nach Reichweite und Qualität deines Beitrags. Regelkonforme Inhalte mit mehr echten Aufrufen/Interaktionen erhalten eine höhere Belohnung. Der Betrag wird bei der Freigabe festgelegt und als Guthaben gutgeschrieben.",
  "pages.earn.faq2.q": "Welche Inhalte werden akzeptiert?",
  "pages.earn.faq2.a":
    "Originelle Inhalte, die EpinFox bewerben: Produkt-/Kampagnenbeiträge, Erfahrungsvideos, Stories, Kurzvideos (Reels/Shorts) oder Posts. Der Inhalt muss öffentlich sein und klar auf EpinFox verweisen.",
  "pages.earn.faq3.q": "Welche Plattformen sind gültig?",
  "pages.earn.faq3.a":
    "Beiträge auf Instagram, TikTok, YouTube und X (Twitter) werden akzeptiert. Dein Konto muss öffentlich sein, damit wir den Beitrag prüfen können.",
  "pages.earn.faq4.q": "Wann wird mein Beitrag geprüft?",
  "pages.earn.faq4.a":
    "Einreichungen werden in der Regel innerhalb von 1-3 Werktagen geprüft. Das Ergebnis (Freigabe/Ablehnung) erhältst du als Benachrichtigung in deinem Konto; bei Freigabe wird die Belohnung sofort gutgeschrieben.",
  "pages.earn.faq5.q": "Wie viele Beiträge kann ich einreichen?",
  "pages.earn.faq5.a":
    "Keine Begrenzung — für jeden regelkonformen Originalbeitrag kannst du eine separate Belohnung verdienen. Denselben Beitrag (denselben Link) kannst du jedoch nur einmal einreichen.",
  "pages.earn.faq6.q": "Wann wird eine Einreichung abgelehnt?",
  "pages.earn.faq6.a":
    "Gefälschte Interaktionen/Bots, irrelevante Inhalte, Beiträge ohne EpinFox-Bezug, private Konten, kopierte/gestohlene Inhalte und irreführende Beiträge werden abgelehnt. Wiederholte Verstöße können zum Ausschluss aus dem Programm führen.",
  "pages.earn.faq7.q": "Wie nutze ich meine Belohnung?",
  "pages.earn.faq7.a":
    "Du kannst dein verdientes Guthaben sofort für alle Produkte und Dienste von EpinFox verwenden. Das Guthaben wird wie deine anderen Aufladungen in deine Wallet gebucht.",

  "pages.earn.form.title": "Beitrag einreichen",
  "pages.earn.form.subtitle":
    "Füge den Link zum geteilten Inhalt hinzu, unser Team prüft ihn und vergibt deine Belohnung.",
  "pages.earn.form.loginDesc": "Du musst dich anmelden, um Geld zu verdienen.",
  "pages.earn.form.loginCta": "Anmelden",
  "pages.earn.form.platform": "Plattform",
  "pages.earn.platform.other": "Andere",
  "pages.earn.form.linkLabel": "Beitragslink",
  "pages.earn.form.noteLabel": "Notiz (optional)",
  "pages.earn.form.notePlaceholder": "Schreibe, falls du etwas hinzufügen möchtest.",
  "pages.earn.form.proofLabel": "Nachweisbild (optional, max. 3)",
  "pages.earn.form.filesSelected": "Dateien ausgewählt",
  "pages.earn.form.addScreenshot": "Screenshot hinzufügen",
  "pages.earn.form.success":
    "Deine Einreichung ist eingegangen! Nach der Prüfung teilen wir dir das Ergebnis mit.",
  "pages.earn.form.submitting": "Wird gesendet…",
  "pages.earn.form.submit": "Beitrag einreichen",

  "pages.earn.history.title": "Meine Einreichungen",
  "pages.earn.history.earnedSuffix": "verdient",
  "pages.earn.history.loginTitle": "Hier sichtbar, sobald du angemeldet bist",
  "pages.earn.history.loginDesc":
    "Melde dich an, um deine Einreichungen und Belohnungen zu verfolgen.",
  "pages.earn.history.emptyTitle": "Noch keine Einreichungen",
  "pages.earn.history.emptyDesc":
    "Reiche deinen ersten Beitrag ein und beginne, Belohnungen zu verdienen.",
  "pages.earn.status.pending": "In Prüfung",
  "pages.earn.status.approved": "Freigegeben",
  "pages.earn.status.rejected": "Abgelehnt",

  // ABOUT
  "pages.about.meta.title": "Über uns",
  "pages.about.meta.desc":
    "EpinFox — über die Plattform für digitale Codes und Spielguthaben.",
  "pages.about.badge": "Über uns",
  "pages.about.heroTitle.pre": "Wir haben den Einkauf digitaler Codes",
  "pages.about.heroTitle.accent": "auf Sekunden",
  "pages.about.heroTitle.post": "verkürzt",
  "pages.about.heroDesc":
    "EpinFox ist eine Plattform für digitale Codes, die Spiel-E-Pins, Plattformguthaben, Abonnements und digitale Dienste sicher, schnell und zu fairen Konditionen liefert. Unser einziges Ziel: Gamern das reibungsloseste Einkaufserlebnis zu bieten.",
  "pages.about.stat1.value": "24/7",
  "pages.about.stat1.label": "Automatische Lieferung",
  "pages.about.stat2.value": "1000+",
  "pages.about.stat2.label": "Digitale Produkte",
  "pages.about.stat3.value": "100%",
  "pages.about.stat3.label": "Sichere Zahlung",
  "pages.about.stat4.value": "Sofort",
  "pages.about.stat4.label": "Code-Lieferung",
  "pages.about.valuesTitle": "Warum EpinFox?",
  "pages.about.valuesSubtitle":
    "Sechs Gründe, warum Tausende Gamer EpinFox wählen.",
  "pages.about.value1.title": "Sofortige Lieferung",
  "pages.about.value1.text":
    "Dein Code ist in deinem Konto, sobald die Zahlung bestätigt ist. Automatische Lieferung in Sekunden, Tag und Nacht.",
  "pages.about.value2.title": "Sicheres Einkaufen",
  "pages.about.value2.text":
    "Alle Produktcodes werden verschlüsselt gespeichert, Zahlungen sind per SSL geschützt. Betrugspräventionssysteme sind rund um die Uhr aktiv.",
  "pages.about.value3.title": "Wallet-Modell",
  "pages.about.value3.text":
    "Einmal aufladen, mit einem Klick ausgeben. Keine Karteneingabe bei jedem Kauf — schnell und praktisch bezahlen.",
  "pages.about.value4.title": "24/7-Support",
  "pages.about.value4.text":
    "Unser KI-Support-Assistent und unser menschliches Team sind immer für dich da. Deine Probleme werden schnell gelöst.",
  "pages.about.value5.title": "Belohnungen & Boni",
  "pages.about.value5.text":
    "Verdiene mit Aufladeboni, Preisverlosungen und Empfehlungsvorteilen jedes Mal mehr.",
  "pages.about.value6.title": "Rechtliche Konformität",
  "pages.about.value6.text":
    "Bei ETBİS registriert, vollständig konform mit KVKK und den Vorschriften für den Fernabsatz — eine transparente E-Commerce-Plattform.",
  "pages.about.stepsTitle": "In drei Schritten einkaufen",
  "pages.about.stepsSubtitle":
    "Kein Aufwand, kein Warten. Aufladen, auswählen, sofort erhalten.",
  "pages.about.step1.title": "Guthaben aufladen",
  "pages.about.step1.text":
    "Lade deine Wallet mit sicheren Zahlungsmethoden auf. Profitiere von Aufladeboni.",
  "pages.about.step2.title": "Produkt auswählen",
  "pages.about.step2.text":
    "Entdecke Tausende Spiel-E-Pins, Plattformguthaben und Abos im Shop und lege sie in den Warenkorb.",
  "pages.about.step3.title": "Sofort erhalten",
  "pages.about.step3.text":
    "Dein Code ist innerhalb von Sekunden auf deiner Bestellungen-Seite und in deiner E-Mail. Beginne sofort mit der Nutzung.",
  "pages.about.mission.title": "Unsere Mission und unser Ansatz",
  "pages.about.mission.intro":
    "Bei EpinFox glauben wir, dass der Einkauf digitaler Produkte schnell, sicher und transparent sein sollte. Um Verzögerungen, versteckte Provisionen und Vertrauensprobleme traditioneller Händler zu beseitigen, haben wir eine Wallet-basierte Infrastruktur mit automatischer Lieferung aufgebaut.",
  "pages.about.mission.h1": "Kundenpriorität",
  "pages.about.mission.p1":
    "Die Nutzererfahrung steht im Mittelpunkt jeder Entscheidung. Vom Bestellablauf über Supportprozesse bis hin zu Preisen und Sicherheitsmaßnahmen gestalten wir jeden Schritt zugunsten der Gamer. Mit deinem Feedback entwickeln wir die Plattform gemeinsam weiter.",
  "pages.about.mission.h2": "Vertrauen und rechtliche Konformität",
  "pages.about.mission.p2":
    "EpinFox ist eine bei ETBİS registrierte E-Commerce-Plattform. Unsere Prozesse für Fernabsatz, Schutz personenbezogener Daten (KVKK) und Rückerstattungen entsprechen vollständig der geltenden Gesetzgebung. Alle deine Transaktionen werden erfasst und sind transparent.",
  "pages.about.mission.h3": "Kontinuierliche Verbesserung",
  "pages.about.mission.p3":
    "Wir erweitern kontinuierlich unser Produktangebot, unsere Zahlungsoptionen und Vorteilsprogramme. Mit Preisverlosungen, einem Empfehlungsprogramm und Aufladeboni möchten wir dir immer mehr bieten.",
  "pages.about.cta.title": "Mach mit",
  "pages.about.cta.desc":
    "Lade deine Wallet auf, entdecke Tausende digitale Produkte und nimm kostenlos an Preisverlosungen teil.",
  "pages.about.cta.store": "Shop entdecken",
  "pages.about.cta.contact": "Kontakt aufnehmen",

  // CONTACT
  "pages.contact.meta.title": "Kontakt",
  "pages.contact.meta.desc":
    "Kontaktiere EpinFox — E-Mail, Live-Support und Unternehmensinformationen.",
  "pages.contact.badge": "Kontakt",
  "pages.contact.heroTitle": "Melde dich, wir antworten sofort",
  "pages.contact.heroDesc":
    "Das EpinFox-Team ist immer für dich da. Wähle den passenden Kanal — deine Bestellungen sofort, unser Support ununterbrochen.",
  "pages.contact.channel.live.title": "Live-Support",
  "pages.contact.channel.live.value": "Chat-Blase unten rechts",
  "pages.contact.channel.live.desc":
    "Unser KI-Support-Assistent antwortet rund um die Uhr sofort. Der schnellste Lösungskanal.",
  "pages.contact.channel.support.title": "Support-Anfrage",
  "pages.contact.channel.support.value": "Anfrage erstellen",
  "pages.contact.channel.support.desc":
    "Öffne und verfolge eine erfasste Anfrage für deine Bestell- oder Wallet-Probleme.",
  "pages.contact.channel.email.title": "E-Mail",
  "pages.contact.channel.email.desc":
    "Für allgemeine Fragen, Kooperationen und Unternehmensanfragen.",
  "pages.contact.channel.phone.title": "Telefon",
  "pages.contact.channel.phone.desc":
    "Du kannst uns während der Geschäftszeiten auch telefonisch erreichen.",
  "pages.contact.hours.title": "Geschäftszeiten",
  "pages.contact.hours.pre": "Bestellung und Lieferung sind",
  "pages.contact.hours.strong": "rund um die Uhr automatisch",
  "pages.contact.hours.post":
    ". Live-Support ist ununterbrochen; E-Mail-/Telefonantworten erfolgen während der Geschäftszeiten.",
  "pages.contact.corp.title": "Unternehmensinformationen",
  "pages.contact.corp.subtitle":
    "Unsere offiziellen Firmen- und Registrierungsdaten findest du unten.",
  "pages.contact.corp.company": "Firmenname",
  "pages.contact.corp.address": "Adresse",
  "pages.contact.corp.tax": "Finanzamt / Nr.",
  "pages.contact.corp.mersis": "MERSİS-Nr.",
  "pages.contact.corp.etbis": "ETBİS-Registriernr.",
  "pages.contact.corp.email": "E-Mail",
  "pages.contact.corp.phone": "Telefon",
  "pages.contact.corp.kep": "KEP-Adresse",
  "pages.contact.faq.title": "Prüfe zuerst die Antworten",
  "pages.contact.faq.desc":
    "Die meisten häufig gestellten Fragen werden im Hilfecenter beantwortet.",

  // RAFFLES
  "pages.raffles.meta.title": "Verlosungen",
  "pages.raffles.meta.desc":
    "EpinFox-Preisverlosungen — PS5, iPhone, Steam Deck und Guthaben-Preise. Lade Guthaben auf und verdiene Lose.",
  "pages.raffles.heroImageAlt":
    "EpinFox-Verlosungspreise — PS5, Smartphone, Spielkonsole und Pokal",
  "pages.raffles.badge": "Preisverlosungen",
  "pages.raffles.heroTitle.pre": "Guthaben aufladen,",
  "pages.raffles.heroTitle.accent": "große Preise",
  "pages.raffles.heroTitle.post": "gewinnen",
  "pages.raffles.heroDesc":
    "Jede Aufladung von 100 ₺ bringt ein Los. PS5, iPhone, Steam Deck und Guthaben-Preise in Höhe von Tausenden TL warten auf dich — die Teilnahme ist völlig kostenlos.",
  "pages.raffles.stat.raffles": "Verlosungen",
  "pages.raffles.stat.participants": "Teilnehmer",
  "pages.raffles.stat.free.value": "Kostenlos",
  "pages.raffles.stat.free.label": "Teilnahme",
  "pages.raffles.status.active": "Aktiv",
  "pages.raffles.status.upcoming": "Bald",
  "pages.raffles.status.ended": "Beendet",
  "pages.raffles.section.active.title": "Aktive Verlosungen",
  "pages.raffles.section.active.subtitle":
    "Verlosungen, an denen du jetzt teilnehmen kannst",
  "pages.raffles.section.upcoming.title": "Startet bald",
  "pages.raffles.section.upcoming.subtitle":
    "Aktiviere Benachrichtigungen und sei unter den Ersten",
  "pages.raffles.section.ended.title": "Abgeschlossene Verlosungen",
  "pages.raffles.section.ended.subtitle":
    "Vergangene Gewinner und ausgelieferte Preise",
  "pages.raffles.card.participantsSuffix": "Teilnehmer",
  "pages.raffles.card.free": "Kostenlose Teilnahme",
  "pages.raffles.card.perTicket": "/ Los",
  "pages.raffles.card.winnerLabel": "Gewinner:",
  "pages.raffles.card.winnerAnnounced": "Bekannt gegeben",
  "pages.raffles.card.startsIn": "Zeit bis zum Start",
  "pages.raffles.card.upcomingBtn": "Startet bald",
  "pages.raffles.card.timeLeft": "Verbleibende Zeit für die Verlosung",
  "pages.raffles.card.joinCta": "Guthaben aufladen, teilnehmen",
  "pages.raffles.how.title": "Wie nehme ich teil?",
  "pages.raffles.how.subtitle":
    "In drei Schritten den großen Preisen einen Schritt näher.",
  "pages.raffles.how.step1.title": "Guthaben aufladen",
  "pages.raffles.how.step1.text":
    "Jede Aufladung von 100 ₺ bringt automatisch 1 Los.",
  "pages.raffles.how.step2.title": "Automatisch teilnehmen",
  "pages.raffles.how.step2.text":
    "Deine Lose für aktive Verlosungen werden sofort und kostenlos zugewiesen.",
  "pages.raffles.how.step3.title": "Gewinnen & erhalten",
  "pages.raffles.how.step3.text":
    "Am Verlosungstag werden die Gewinner veröffentlicht und der Preis sofort ausgeliefert.",
  "pages.raffles.how.disclaimer":
    "Alle Verlosungen werden transparent in Anwesenheit eines Notars / per Livestream durchgeführt.",
};

export const ar: Dict = {
  // EARN
  "pages.earn.meta.title": "اكسب المال",
  "pages.earn.meta.desc":
    "شارك محتوى EpinFox على وسائل التواصل الاجتماعي واكسب رصيداً في محفظتك بعد الموافقة.",
  "pages.earn.badge": "اكسب المال",
  "pages.earn.heroTitle": "شارك محتوانا، اكسب رصيداً",
  "pages.earn.heroDesc":
    "شارك EpinFox على وسائل التواصل الاجتماعي واكسب مكافأة رصيد لكل منشور تتم الموافقة عليه. كلما شاركت أكثر، كسبت أكثر.",
  "pages.earn.howTitle": "كيف يعمل؟",
  "pages.earn.step1.title": "شارك",
  "pages.earn.step1.desc":
    "شارك منتجات EpinFox أو حملاتها أو تجربتك على Instagram أو TikTok أو YouTube أو X.",
  "pages.earn.step2.title": "أرسل",
  "pages.earn.step2.desc": "أرسل لنا من هذه الصفحة رابط منشورك ولقطة شاشة إن رغبت.",
  "pages.earn.step3.title": "اكسب",
  "pages.earn.step3.desc":
    "بمجرد مراجعته والموافقة عليه من قبل فريقنا، تُضاف مكافأتك فوراً كرصيد إلى محفظتك.",
  "pages.earn.faqTitle": "الأسئلة الشائعة",
  "pages.earn.faq1.q": "كم سأكسب؟",
  "pages.earn.faq1.a":
    "تُحدد المكافأة بناءً على مدى وصول منشورك وجودته. المحتوى المتوافق مع القواعد والذي يحصل على مشاهدات/تفاعلات حقيقية أكثر يكسب مكافأة أعلى. يُحدد مبلغ المكافأة عند الموافقة ويُضاف كرصيد إلى محفظتك.",
  "pages.earn.faq2.q": "ما المحتوى المقبول؟",
  "pages.earn.faq2.a":
    "محتوى أصلي يروّج لـ EpinFox: منشورات المنتجات/الحملات، فيديوهات التجربة، القصص، الفيديوهات القصيرة (Reels/Shorts) أو المنشورات. يجب أن يكون المحتوى عاماً ويشير بوضوح إلى EpinFox.",
  "pages.earn.faq3.q": "ما المنصات المؤهلة؟",
  "pages.earn.faq3.a":
    "تُقبل المنشورات على Instagram وTikTok وYouTube وX (تويتر). يجب أن يكون حسابك عاماً حتى نتمكن من مراجعة المنشور.",
  "pages.earn.faq4.q": "متى يُراجع منشوري؟",
  "pages.earn.faq4.a":
    "تُراجع الطلبات عادةً خلال 1-3 أيام عمل. تصلك النتيجة (الموافقة/الرفض) كإشعار في حسابك؛ وإذا تمت الموافقة تُضاف المكافأة إلى محفظتك فوراً.",
  "pages.earn.faq5.q": "كم منشوراً يمكنني إرساله؟",
  "pages.earn.faq5.a":
    "لا يوجد حد — يمكنك كسب مكافأة منفصلة لكل منشور أصلي متوافق مع القواعد. لكن يمكنك إرسال المنشور نفسه (الرابط نفسه) مرة واحدة فقط.",
  "pages.earn.faq6.q": "متى يُرفض الطلب؟",
  "pages.earn.faq6.a":
    "تُرفض التفاعلات المزيفة/الروبوتات، والمحتوى غير ذي الصلة، والمنشورات التي لا تشير إلى EpinFox، والحسابات الخاصة، والمحتوى المنسوخ/المسروق والمنشورات المضللة. قد تؤدي المخالفات المتكررة إلى الإقصاء من البرنامج.",
  "pages.earn.faq7.q": "كيف أستخدم مكافأتي؟",
  "pages.earn.faq7.a":
    "يمكنك استخدام الرصيد الذي كسبته فوراً في جميع منتجات وخدمات EpinFox. يُضاف الرصيد إلى محفظتك تماماً مثل عمليات الشحن الأخرى.",

  "pages.earn.form.title": "أرسل منشورك",
  "pages.earn.form.subtitle":
    "أضف رابط المحتوى الذي شاركته، وسيقوم فريقنا بمراجعته ومنحك مكافأتك.",
  "pages.earn.form.loginDesc": "يجب تسجيل الدخول لبدء كسب المال.",
  "pages.earn.form.loginCta": "تسجيل الدخول",
  "pages.earn.form.platform": "المنصة",
  "pages.earn.platform.other": "أخرى",
  "pages.earn.form.linkLabel": "رابط المنشور",
  "pages.earn.form.noteLabel": "ملاحظة (اختياري)",
  "pages.earn.form.notePlaceholder": "اكتب أي شيء تود إضافته.",
  "pages.earn.form.proofLabel": "صورة إثبات (اختياري، 3 كحد أقصى)",
  "pages.earn.form.filesSelected": "ملفات محددة",
  "pages.earn.form.addScreenshot": "أضف لقطة شاشة",
  "pages.earn.form.success": "تم استلام طلبك! سنبلغك بالنتيجة بعد المراجعة.",
  "pages.earn.form.submitting": "جارٍ الإرسال…",
  "pages.earn.form.submit": "إرسال المنشور",

  "pages.earn.history.title": "طلباتي",
  "pages.earn.history.earnedSuffix": "كسبت",
  "pages.earn.history.loginTitle": "يظهر هنا بعد تسجيل الدخول",
  "pages.earn.history.loginDesc": "سجّل الدخول لتتبع طلباتك ومكافآتك.",
  "pages.earn.history.emptyTitle": "لا توجد طلبات بعد",
  "pages.earn.history.emptyDesc": "أرسل منشورك الأول وابدأ بكسب المكافآت.",
  "pages.earn.status.pending": "قيد المراجعة",
  "pages.earn.status.approved": "تمت الموافقة",
  "pages.earn.status.rejected": "مرفوض",

  // ABOUT
  "pages.about.meta.title": "من نحن",
  "pages.about.meta.desc": "EpinFox — حول منصة الأكواد الرقمية ورصيد الألعاب.",
  "pages.about.badge": "من نحن",
  "pages.about.heroTitle.pre": "اختصرنا التسوّق للأكواد الرقمية",
  "pages.about.heroTitle.accent": "إلى ثوانٍ",
  "pages.about.heroTitle.post": "",
  "pages.about.heroDesc":
    "EpinFox منصة أكواد رقمية تسلّم بطاقات الألعاب وأرصدة المنصات والاشتراكات والخدمات الرقمية بأمان وسرعة وعمولة معقولة. هدفنا واحد: تقديم أسلس تجربة تسوّق للاعبين.",
  "pages.about.stat1.value": "24/7",
  "pages.about.stat1.label": "تسليم تلقائي",
  "pages.about.stat2.value": "+1000",
  "pages.about.stat2.label": "منتج رقمي",
  "pages.about.stat3.value": "%100",
  "pages.about.stat3.label": "دفع آمن",
  "pages.about.stat4.value": "فوري",
  "pages.about.stat4.label": "تسليم الكود",
  "pages.about.valuesTitle": "لماذا EpinFox؟",
  "pages.about.valuesSubtitle": "ستة أسباب تجعل آلاف اللاعبين يختارون EpinFox.",
  "pages.about.value1.title": "تسليم فوري",
  "pages.about.value1.text":
    "كودك في حسابك لحظة تأكيد الدفع. تسليم تلقائي خلال ثوانٍ، ليلاً ونهاراً.",
  "pages.about.value2.title": "تسوّق آمن",
  "pages.about.value2.text":
    "تُخزَّن جميع أكواد المنتجات مشفّرة، والمدفوعات محمية بـ SSL. أنظمة منع الاحتيال نشطة 24/7.",
  "pages.about.value3.title": "نموذج المحفظة",
  "pages.about.value3.text":
    "اشحن مرة واحدة، وأنفق بنقرة واحدة. لا إدخال لبيانات البطاقة في كل عملية شراء — دفع سريع وعملي.",
  "pages.about.value4.title": "دعم 24/7",
  "pages.about.value4.text":
    "مساعد الدعم بالذكاء الاصطناعي وفريقنا البشري بجانبك دائماً. تُحل مشكلاتك بسرعة.",
  "pages.about.value5.title": "مكافآت وبونصات",
  "pages.about.value5.text":
    "اكسب المزيد دائماً مع بونصات الشحن والسحوبات بجوائز ومزايا الإحالة.",
  "pages.about.value6.title": "الامتثال القانوني",
  "pages.about.value6.text":
    "مسجّلة لدى ETBİS، متوافقة تماماً مع KVKK ولوائح البيع عن بُعد — منصة تجارة إلكترونية شفافة.",
  "pages.about.stepsTitle": "تسوّق في ثلاث خطوات",
  "pages.about.stepsSubtitle": "لا تعقيد ولا انتظار. اشحن، اختر، استلم فوراً.",
  "pages.about.step1.title": "اشحن الرصيد",
  "pages.about.step1.text":
    "اشحن محفظتك بطرق دفع آمنة. استفد من بونصات الشحن.",
  "pages.about.step2.title": "اختر المنتج",
  "pages.about.step2.text":
    "اكتشف آلاف بطاقات الألعاب وأرصدة المنصات والاشتراكات في المتجر، وأضفها إلى السلة.",
  "pages.about.step3.title": "استلم فوراً",
  "pages.about.step3.text":
    "كودك على صفحة طلباتي وفي بريدك خلال ثوانٍ. ابدأ باستخدامه على الفور.",
  "pages.about.mission.title": "مهمتنا ونهجنا",
  "pages.about.mission.intro":
    "نحن في EpinFox نؤمن بأن التسوّق للمنتجات الرقمية يجب أن يكون سريعاً وآمناً وشفافاً. وللقضاء على التأخيرات والعمولات الخفية ومشكلات الثقة لدى الموزعين التقليديين، بنينا بنية قائمة على المحفظة مع تسليم تلقائي.",
  "pages.about.mission.h1": "أولوية العميل",
  "pages.about.mission.p1":
    "تجربة المستخدم في صميم كل قرار نتخذه. من مسار الطلب إلى عمليات الدعم، ومن التسعير إلى تدابير الأمان، نصمم كل خطوة لمصلحة اللاعب. ونطوّر المنصة معاً عبر ملاحظاتك.",
  "pages.about.mission.h2": "الثقة والامتثال القانوني",
  "pages.about.mission.p2":
    "EpinFox منصة تجارة إلكترونية مسجّلة لدى ETBİS. تتوافق عملياتنا الخاصة بالبيع عن بُعد وحماية البيانات الشخصية (KVKK) والاسترداد تماماً مع التشريعات السارية. جميع معاملاتك مسجّلة وشفافة.",
  "pages.about.mission.h3": "تطوير مستمر",
  "pages.about.mission.p3":
    "نوسّع باستمرار تشكيلة منتجاتنا وخيارات الدفع وبرامج المزايا. مع السحوبات بجوائز وبرنامج الإحالة وبونصات الشحن، نهدف إلى تقديم المزيد لك دائماً.",
  "pages.about.cta.title": "انضم إلينا",
  "pages.about.cta.desc":
    "اشحن محفظتك، واكتشف آلاف المنتجات الرقمية، وشارك مجاناً في السحوبات بجوائز.",
  "pages.about.cta.store": "اكتشف المتجر",
  "pages.about.cta.contact": "تواصل معنا",

  // CONTACT
  "pages.contact.meta.title": "اتصل بنا",
  "pages.contact.meta.desc":
    "تواصل مع EpinFox — البريد الإلكتروني والدعم المباشر والمعلومات المؤسسية.",
  "pages.contact.badge": "اتصل بنا",
  "pages.contact.heroTitle": "تواصل معنا، وسنرد فوراً",
  "pages.contact.heroDesc":
    "فريق EpinFox بجانبك دائماً. اختر القناة الأنسب لك — طلباتك فورية ودعمنا متواصل.",
  "pages.contact.channel.live.title": "الدعم المباشر",
  "pages.contact.channel.live.value": "فقاعة الدردشة أسفل اليمين",
  "pages.contact.channel.live.desc":
    "يرد مساعد الدعم بالذكاء الاصطناعي فوراً 24/7. أسرع قناة للحل.",
  "pages.contact.channel.support.title": "طلب دعم",
  "pages.contact.channel.support.value": "إنشاء طلب",
  "pages.contact.channel.support.desc":
    "افتح طلباً مسجّلاً لمشكلات طلبك أو محفظتك وتابعه.",
  "pages.contact.channel.email.title": "البريد الإلكتروني",
  "pages.contact.channel.email.desc": "للأسئلة العامة والتعاون والطلبات المؤسسية.",
  "pages.contact.channel.phone.title": "الهاتف",
  "pages.contact.channel.phone.desc":
    "يمكنك أيضاً التواصل معنا هاتفياً خلال ساعات العمل.",
  "pages.contact.hours.title": "ساعات العمل",
  "pages.contact.hours.pre": "الطلب والتسليم",
  "pages.contact.hours.strong": "تلقائيان 24/7",
  "pages.contact.hours.post":
    ". الدعم المباشر متواصل، وردود البريد/الهاتف خلال ساعات العمل.",
  "pages.contact.corp.title": "المعلومات المؤسسية",
  "pages.contact.corp.subtitle": "بيانات الشركة والتسجيل الرسمية أدناه.",
  "pages.contact.corp.company": "الاسم التجاري",
  "pages.contact.corp.address": "العنوان",
  "pages.contact.corp.tax": "مكتب الضرائب / الرقم",
  "pages.contact.corp.mersis": "رقم MERSİS",
  "pages.contact.corp.etbis": "رقم تسجيل ETBİS",
  "pages.contact.corp.email": "البريد الإلكتروني",
  "pages.contact.corp.phone": "الهاتف",
  "pages.contact.corp.kep": "عنوان KEP",
  "pages.contact.faq.title": "تحقق من الإجابات أولاً",
  "pages.contact.faq.desc": "معظم الأسئلة الشائعة لها إجابات في مركز المساعدة.",

  // RAFFLES
  "pages.raffles.meta.title": "السحوبات",
  "pages.raffles.meta.desc":
    "سحوبات EpinFox بجوائز — PS5 وiPhone وSteam Deck وجوائز رصيد. اشحن رصيدك واكسب فرص سحب.",
  "pages.raffles.heroImageAlt":
    "جوائز سحوبات EpinFox — PS5 وهاتف ووحدة ألعاب وكأس",
  "pages.raffles.badge": "سحوبات بجوائز",
  "pages.raffles.heroTitle.pre": "اشحن الرصيد،",
  "pages.raffles.heroTitle.accent": "واربح الجوائز",
  "pages.raffles.heroTitle.post": "الكبرى",
  "pages.raffles.heroDesc":
    "كل شحن بقيمة 100₺ يمنحك فرصة سحب. PS5 وiPhone وSteam Deck وآلاف الليرات كجوائز رصيد بانتظارك — المشاركة مجانية تماماً.",
  "pages.raffles.stat.raffles": "سحب",
  "pages.raffles.stat.participants": "مشارك",
  "pages.raffles.stat.free.value": "مجاناً",
  "pages.raffles.stat.free.label": "المشاركة",
  "pages.raffles.status.active": "نشط",
  "pages.raffles.status.upcoming": "قريباً",
  "pages.raffles.status.ended": "انتهى",
  "pages.raffles.section.active.title": "السحوبات النشطة",
  "pages.raffles.section.active.subtitle": "سحوبات يمكنك المشاركة فيها الآن",
  "pages.raffles.section.upcoming.title": "يبدأ قريباً",
  "pages.raffles.section.upcoming.subtitle": "فعّل الإشعارات وكن من أوائل المشاركين",
  "pages.raffles.section.ended.title": "السحوبات المنتهية",
  "pages.raffles.section.ended.subtitle": "الفائزون السابقون والجوائز المسلّمة",
  "pages.raffles.card.participantsSuffix": "مشارك",
  "pages.raffles.card.free": "مشاركة مجانية",
  "pages.raffles.card.perTicket": "/ تذكرة",
  "pages.raffles.card.winnerLabel": "الفائز:",
  "pages.raffles.card.winnerAnnounced": "أُعلن عنه",
  "pages.raffles.card.startsIn": "الوقت حتى البدء",
  "pages.raffles.card.upcomingBtn": "يبدأ قريباً",
  "pages.raffles.card.timeLeft": "الوقت المتبقي للسحب",
  "pages.raffles.card.joinCta": "اشحن الرصيد وشارك",
  "pages.raffles.how.title": "كيف أشارك؟",
  "pages.raffles.how.subtitle": "خطوة أقرب إلى الجوائز الكبرى في ثلاث خطوات.",
  "pages.raffles.how.step1.title": "اشحن الرصيد",
  "pages.raffles.how.step1.text":
    "كل شحن بقيمة 100₺ يمنحك تلقائياً فرصة سحب واحدة.",
  "pages.raffles.how.step2.title": "شارك تلقائياً",
  "pages.raffles.how.step2.text": "تُخصّص تذاكرك للسحوبات النشطة فوراً ومجاناً.",
  "pages.raffles.how.step3.title": "اربح واستلم",
  "pages.raffles.how.step3.text":
    "يوم السحب يُعلن عن الفائزين وتُسلَّم الجائزة فوراً.",
  "pages.raffles.how.disclaimer":
    "تُجرى جميع السحوبات بشفافية بحضور موثّق / بث مباشر.",
};

export const ru: Dict = {
  // EARN
  "pages.earn.meta.title": "Зарабатывайте",
  "pages.earn.meta.desc":
    "Делитесь контентом EpinFox в соцсетях и получайте баланс на кошелёк после одобрения.",
  "pages.earn.badge": "Зарабатывайте",
  "pages.earn.heroTitle": "Делитесь нашим контентом, зарабатывайте баланс",
  "pages.earn.heroDesc":
    "Делитесь EpinFox в соцсетях и получайте награду на баланс кошелька за каждый одобренный пост. Чем больше делитесь, тем больше зарабатываете.",
  "pages.earn.howTitle": "Как это работает?",
  "pages.earn.step1.title": "Поделитесь",
  "pages.earn.step1.desc":
    "Поделитесь продуктами, акциями или своим опытом EpinFox в Instagram, TikTok, YouTube или X.",
  "pages.earn.step2.title": "Отправьте",
  "pages.earn.step2.desc":
    "Отправьте нам ссылку на ваш пост и при желании скриншот через эту страницу.",
  "pages.earn.step3.title": "Заработайте",
  "pages.earn.step3.desc":
    "Как только наша команда проверит и одобрит его, награда мгновенно зачислится на баланс кошелька.",
  "pages.earn.faqTitle": "Часто задаваемые вопросы",
  "pages.earn.faq1.q": "Сколько я заработаю?",
  "pages.earn.faq1.a":
    "Награда определяется охватом и качеством вашего поста. Соответствующий правилам контент с большим числом реальных просмотров/взаимодействий получает более высокую награду. Сумма определяется при одобрении и зачисляется на баланс кошелька.",
  "pages.earn.faq2.q": "Какой контент принимается?",
  "pages.earn.faq2.a":
    "Оригинальный контент, продвигающий EpinFox: посты о продуктах/акциях, видео об опыте, истории, короткие видео (Reels/Shorts) или публикации. Контент должен быть публичным и чётко ссылаться на EpinFox.",
  "pages.earn.faq3.q": "Какие платформы подходят?",
  "pages.earn.faq3.a":
    "Принимаются публикации в Instagram, TikTok, YouTube и X (Twitter). Ваш аккаунт должен быть публичным, чтобы мы могли проверить пост.",
  "pages.earn.faq4.q": "Когда мой пост рассмотрят?",
  "pages.earn.faq4.a":
    "Заявки обычно рассматриваются в течение 1-3 рабочих дней. Результат (одобрение/отказ) приходит уведомлением в вашем аккаунте; при одобрении награда мгновенно зачисляется на кошелёк.",
  "pages.earn.faq5.q": "Сколько постов я могу отправить?",
  "pages.earn.faq5.a":
    "Без ограничений — за каждый соответствующий правилам оригинальный пост можно получить отдельную награду. Однако один и тот же пост (одну ссылку) можно отправить только один раз.",
  "pages.earn.faq6.q": "В каких случаях заявку отклоняют?",
  "pages.earn.faq6.a":
    "Отклоняются накрутки/боты, нерелевантный контент, посты без упоминания EpinFox, закрытые аккаунты, скопированный/украденный контент и вводящие в заблуждение посты. Повторные нарушения могут привести к исключению из программы.",
  "pages.earn.faq7.q": "Как использовать награду?",
  "pages.earn.faq7.a":
    "Заработанный баланс можно сразу использовать для всех продуктов и услуг EpinFox. Баланс зачисляется на кошелёк так же, как и другие пополнения.",

  "pages.earn.form.title": "Отправьте свой пост",
  "pages.earn.form.subtitle":
    "Добавьте ссылку на опубликованный контент, и наша команда проверит его и выдаст награду.",
  "pages.earn.form.loginDesc": "Чтобы начать зарабатывать, нужно войти в систему.",
  "pages.earn.form.loginCta": "Войти",
  "pages.earn.form.platform": "Платформа",
  "pages.earn.platform.other": "Другое",
  "pages.earn.form.linkLabel": "Ссылка на пост",
  "pages.earn.form.noteLabel": "Примечание (необязательно)",
  "pages.earn.form.notePlaceholder": "Напишите, если хотите что-то добавить.",
  "pages.earn.form.proofLabel": "Изображение-подтверждение (необязательно, до 3)",
  "pages.earn.form.filesSelected": "файлов выбрано",
  "pages.earn.form.addScreenshot": "Добавить скриншот",
  "pages.earn.form.success":
    "Ваша заявка получена! Мы сообщим результат после проверки.",
  "pages.earn.form.submitting": "Отправка…",
  "pages.earn.form.submit": "Отправить пост",

  "pages.earn.history.title": "Мои заявки",
  "pages.earn.history.earnedSuffix": "заработано",
  "pages.earn.history.loginTitle": "Появится здесь после входа",
  "pages.earn.history.loginDesc": "Войдите, чтобы отслеживать заявки и награды.",
  "pages.earn.history.emptyTitle": "Заявок пока нет",
  "pages.earn.history.emptyDesc":
    "Отправьте первый пост и начните зарабатывать награды.",
  "pages.earn.status.pending": "На рассмотрении",
  "pages.earn.status.approved": "Одобрено",
  "pages.earn.status.rejected": "Отклонено",

  // ABOUT
  "pages.about.meta.title": "О нас",
  "pages.about.meta.desc":
    "EpinFox — о платформе цифровых кодов и игрового баланса.",
  "pages.about.badge": "О нас",
  "pages.about.heroTitle.pre": "Мы сократили покупку цифровых кодов",
  "pages.about.heroTitle.accent": "до секунд",
  "pages.about.heroTitle.post": "",
  "pages.about.heroDesc":
    "EpinFox — это платформа цифровых кодов, которая доставляет игровые e-pin, балансы платформ, подписки и цифровые услуги безопасно, быстро и по выгодной комиссии. Наша единственная цель — обеспечить игрокам максимально удобный шопинг.",
  "pages.about.stat1.value": "24/7",
  "pages.about.stat1.label": "Автоматическая доставка",
  "pages.about.stat2.value": "1000+",
  "pages.about.stat2.label": "Цифровых товаров",
  "pages.about.stat3.value": "100%",
  "pages.about.stat3.label": "Безопасная оплата",
  "pages.about.stat4.value": "Мгновенно",
  "pages.about.stat4.label": "Доставка кода",
  "pages.about.valuesTitle": "Почему EpinFox?",
  "pages.about.valuesSubtitle":
    "Шесть причин, почему тысячи игроков выбирают EpinFox.",
  "pages.about.value1.title": "Мгновенная доставка",
  "pages.about.value1.text":
    "Ваш код в аккаунте в момент подтверждения оплаты. Автоматическая доставка за секунды, днём и ночью.",
  "pages.about.value2.title": "Безопасные покупки",
  "pages.about.value2.text":
    "Все коды товаров хранятся в зашифрованном виде, платежи защищены SSL. Системы предотвращения мошенничества активны 24/7.",
  "pages.about.value3.title": "Модель кошелька",
  "pages.about.value3.text":
    "Пополните один раз — тратьте в один клик. Без ввода данных карты при каждой покупке — быстро и удобно.",
  "pages.about.value4.title": "Поддержка 24/7",
  "pages.about.value4.text":
    "ИИ-ассистент поддержки и наша команда всегда рядом. Ваши проблемы решаются быстро.",
  "pages.about.value5.title": "Награды и бонусы",
  "pages.about.value5.text":
    "Зарабатывайте больше с бонусами за пополнение, розыгрышами призов и реферальными преимуществами.",
  "pages.about.value6.title": "Юридическое соответствие",
  "pages.about.value6.text":
    "Зарегистрирована в ETBİS, полностью соответствует KVKK и правилам дистанционной продажи — прозрачная платформа электронной коммерции.",
  "pages.about.stepsTitle": "Покупки в три шага",
  "pages.about.stepsSubtitle":
    "Без хлопот и ожидания. Пополните, выберите, получите мгновенно.",
  "pages.about.step1.title": "Пополните баланс",
  "pages.about.step1.text":
    "Пополните кошелёк безопасными способами оплаты. Воспользуйтесь бонусами за пополнение.",
  "pages.about.step2.title": "Выберите товар",
  "pages.about.step2.text":
    "Откройте тысячи игровых e-pin, балансов платформ и подписок в магазине, добавьте в корзину.",
  "pages.about.step3.title": "Получите мгновенно",
  "pages.about.step3.text":
    "Ваш код на странице «Заказы» и в письме за секунды. Начните использовать сразу.",
  "pages.about.mission.title": "Наша миссия и подход",
  "pages.about.mission.intro":
    "В EpinFox мы убеждены, что покупка цифровых товаров должна быть быстрой, безопасной и прозрачной. Чтобы устранить задержки, скрытые комиссии и проблемы доверия у традиционных продавцов, мы создали инфраструктуру на основе кошелька с автоматической доставкой.",
  "pages.about.mission.h1": "Приоритет клиента",
  "pages.about.mission.p1":
    "В центре каждого нашего решения — пользовательский опыт. От процесса заказа до поддержки, от ценообразования до мер безопасности мы проектируем каждый шаг в пользу игрока. Мы развиваем платформу вместе с вашими отзывами.",
  "pages.about.mission.h2": "Доверие и юридическое соответствие",
  "pages.about.mission.p2":
    "EpinFox — платформа электронной коммерции, зарегистрированная в ETBİS. Наши процессы дистанционной продажи, защиты персональных данных (KVKK) и возврата полностью соответствуют действующему законодательству. Все ваши операции фиксируются и прозрачны.",
  "pages.about.mission.h3": "Постоянное развитие",
  "pages.about.mission.p3":
    "Мы постоянно расширяем ассортимент, варианты оплаты и программы преимуществ. С розыгрышами призов, реферальной программой и бонусами за пополнение мы стремимся предлагать вам всё больше.",
  "pages.about.cta.title": "Присоединяйтесь",
  "pages.about.cta.desc":
    "Пополните кошелёк, откройте тысячи цифровых товаров и бесплатно участвуйте в розыгрышах призов.",
  "pages.about.cta.store": "Открыть магазин",
  "pages.about.cta.contact": "Связаться с нами",

  // CONTACT
  "pages.contact.meta.title": "Контакты",
  "pages.contact.meta.desc":
    "Свяжитесь с EpinFox — email, живая поддержка и корпоративная информация.",
  "pages.contact.badge": "Контакты",
  "pages.contact.heroTitle": "Напишите нам — ответим сразу",
  "pages.contact.heroDesc":
    "Команда EpinFox всегда рядом. Выберите подходящий канал — заказы мгновенные, поддержка бесперебойная.",
  "pages.contact.channel.live.title": "Живая поддержка",
  "pages.contact.channel.live.value": "Чат-пузырь в правом нижнем углу",
  "pages.contact.channel.live.desc":
    "Наш ИИ-ассистент поддержки отвечает мгновенно 24/7. Самый быстрый канал решения.",
  "pages.contact.channel.support.title": "Запрос в поддержку",
  "pages.contact.channel.support.value": "Создать запрос",
  "pages.contact.channel.support.desc":
    "Откройте и отслеживайте зарегистрированный запрос по проблемам заказа или кошелька.",
  "pages.contact.channel.email.title": "Email",
  "pages.contact.channel.email.desc":
    "Для общих вопросов, сотрудничества и корпоративных запросов.",
  "pages.contact.channel.phone.title": "Телефон",
  "pages.contact.channel.phone.desc":
    "В рабочие часы вы также можете связаться с нами по телефону.",
  "pages.contact.hours.title": "Часы работы",
  "pages.contact.hours.pre": "Заказ и доставка",
  "pages.contact.hours.strong": "автоматические 24/7",
  "pages.contact.hours.post":
    ". Живая поддержка бесперебойна; ответы по email/телефону — в рабочие часы.",
  "pages.contact.corp.title": "Корпоративная информация",
  "pages.contact.corp.subtitle": "Официальные данные компании и регистрации ниже.",
  "pages.contact.corp.company": "Наименование",
  "pages.contact.corp.address": "Адрес",
  "pages.contact.corp.tax": "Налоговая / номер",
  "pages.contact.corp.mersis": "Номер MERSİS",
  "pages.contact.corp.etbis": "Рег. номер ETBİS",
  "pages.contact.corp.email": "Email",
  "pages.contact.corp.phone": "Телефон",
  "pages.contact.corp.kep": "Адрес KEP",
  "pages.contact.faq.title": "Сначала проверьте ответы",
  "pages.contact.faq.desc":
    "Ответы на большинство частых вопросов есть в Центре помощи.",

  // RAFFLES
  "pages.raffles.meta.title": "Розыгрыши",
  "pages.raffles.meta.desc":
    "Призовые розыгрыши EpinFox — PS5, iPhone, Steam Deck и призы на баланс. Пополните баланс и получите право на розыгрыш.",
  "pages.raffles.heroImageAlt":
    "Призы розыгрышей EpinFox — PS5, телефон, игровая консоль и кубок",
  "pages.raffles.badge": "Призовые розыгрыши",
  "pages.raffles.heroTitle.pre": "Пополните баланс,",
  "pages.raffles.heroTitle.accent": "выиграйте крупные",
  "pages.raffles.heroTitle.post": "призы",
  "pages.raffles.heroDesc":
    "Каждое пополнение на 100₺ — это право на розыгрыш. PS5, iPhone, Steam Deck и тысячи лир призового баланса ждут вас — участие полностью бесплатное.",
  "pages.raffles.stat.raffles": "Розыгрыши",
  "pages.raffles.stat.participants": "Участники",
  "pages.raffles.stat.free.value": "Бесплатно",
  "pages.raffles.stat.free.label": "Участие",
  "pages.raffles.status.active": "Активен",
  "pages.raffles.status.upcoming": "Скоро",
  "pages.raffles.status.ended": "Завершён",
  "pages.raffles.section.active.title": "Активные розыгрыши",
  "pages.raffles.section.active.subtitle":
    "Розыгрыши, в которых можно участвовать сейчас",
  "pages.raffles.section.upcoming.title": "Скоро начнётся",
  "pages.raffles.section.upcoming.subtitle":
    "Включите уведомления, будьте среди первых",
  "pages.raffles.section.ended.title": "Завершённые розыгрыши",
  "pages.raffles.section.ended.subtitle": "Прошлые победители и вручённые призы",
  "pages.raffles.card.participantsSuffix": "участников",
  "pages.raffles.card.free": "Бесплатное участие",
  "pages.raffles.card.perTicket": "/ билет",
  "pages.raffles.card.winnerLabel": "Победитель:",
  "pages.raffles.card.winnerAnnounced": "Объявлен",
  "pages.raffles.card.startsIn": "До начала",
  "pages.raffles.card.upcomingBtn": "Скоро начнётся",
  "pages.raffles.card.timeLeft": "До конца розыгрыша",
  "pages.raffles.card.joinCta": "Пополнить баланс и участвовать",
  "pages.raffles.how.title": "Как участвовать?",
  "pages.raffles.how.subtitle":
    "На шаг ближе к крупным призам всего за три шага.",
  "pages.raffles.how.step1.title": "Пополните баланс",
  "pages.raffles.how.step1.text":
    "Каждое пополнение на 100₺ автоматически даёт 1 право на розыгрыш.",
  "pages.raffles.how.step2.title": "Участвуйте автоматически",
  "pages.raffles.how.step2.text":
    "Билеты в активные розыгрыши начисляются мгновенно и бесплатно.",
  "pages.raffles.how.step3.title": "Выиграйте и получите",
  "pages.raffles.how.step3.text":
    "В день розыгрыша объявляются победители, а приз вручается мгновенно.",
  "pages.raffles.how.disclaimer":
    "Все розыгрыши проводятся прозрачно, в присутствии нотариуса / в прямом эфире.",
};
