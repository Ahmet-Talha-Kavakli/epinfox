import type { Dict } from "./core";

// i18n parça dosyası — server action / lib mesajları. dictionaries.ts birleştirir.
// Alt-prefix'ler:
//   srv.pm.*  promo
//   srv.sp.*  support
//   srv.ea.*  earn
//   srv.sa.*  satisfaction
//   srv.on.*  onboarding
//   srv.pay.* payment-methods
//   srv.fn.*  favorites-notify
//   srv.rt.*  relative-time

export const tr: Dict = {
  // ── promo ──
  "srv.pm.codeMin": "Kod en az 3 karakter.",
  "srv.pm.invalid": "Geçersiz kod.",
  "srv.pm.failed": "İşlem başarısız, lütfen tekrar deneyin.",
  "srv.pm.applied": "Promo kod uygulandı!",

  // ── support ──
  "srv.sp.fillAll": "Lütfen tüm alanları doldur.",
  "srv.sp.createFailed": "Talep oluşturulamadı.",
  "srv.sp.msgInvalid": "Mesaj geçersiz.",
  "srv.sp.notFound": "Talep bulunamadı.",
  "srv.sp.closed": "Bu talep kapatılmış.",
  "srv.sp.badRequest": "Geçersiz istek.",
  "srv.sp.alreadyClosed": "Talep zaten kapalı.",
  "srv.sp.alreadyOpen": "Talep zaten açık.",
  "srv.sp.reopened": "— Talep yeniden açıldı —",

  // ── earn ──
  "srv.ea.urlInvalid": "Geçerli bir paylaşım linki gir.",
  "srv.ea.invalidData": "Geçersiz veri.",
  "srv.ea.duplicate": "Bu paylaşımı zaten gönderdin.",
  "srv.ea.submitFailed": "Gönderilemedi, tekrar dene.",
  "srv.ea.notFound": "Başvuru bulunamadı.",
  "srv.ea.alreadyHandled": "Bu başvuru zaten işlenmiş.",
  "srv.ea.approveFailed": "Onaylanamadı.",
  "srv.ea.rejectFailed": "Reddedilemedi.",
  "srv.ea.adminTitle": "Yeni Para Kazan başvurusu",
  "srv.ea.adminBody": "{nickname} bir {platform} paylaşımı gönderdi.",
  "srv.ea.approvedTitle": "Para Kazan ödülün onaylandı! 🎉",
  "srv.ea.approvedBodyReward":
    "İçerik paylaşımın onaylandı, cüzdanına +{reward} eklendi.",
  "srv.ea.approvedBodyNoReward": "İçerik paylaşımın onaylandı, teşekkürler!",
  "srv.ea.rejectedTitle": "Para Kazan başvurun reddedildi",
  "srv.ea.rejectedBody": "Paylaşımın ödül kriterlerini karşılamadı.",
  "srv.ea.rejectDefault": "Kriterleri karşılamıyor.",

  // ── satisfaction ──
  "srv.sa.invalidRating": "Geçersiz puan.",
  "srv.sa.sendFailed": "Gönderilemedi, lütfen tekrar dene.",

  // ── onboarding ──
  "srv.on.profile.title": "Profilini tamamla",
  "srv.on.profile.desc": "Bir profil fotoğrafı ekleyerek hesabını kişiselleştir.",
  "srv.on.balance.title": "İlk bakiyeni yükle",
  "srv.on.balance.desc": "Cüzdanına bakiye yükle, tek tıkla alışverişe hazır ol.",
  "srv.on.order.title": "İlk siparişini ver",
  "srv.on.order.desc": "Mağazadan bir ürün seç, kodun anında hesabına gelsin.",
  "srv.on.referral.title": "Arkadaşını davet et",
  "srv.on.referral.desc": "Davet linkini paylaş, birlikte kazanın.",

  // ── payment-methods ──
  "srv.pay.fallbackLabel": "Bakiye yükleme",
  "srv.pay.withLabel": "{label} ile ",
  "srv.pay.bankTr.title": "Türkiye Banka Transferi",
  "srv.pay.bankTr.desc":
    "Masrafsız ve otomatik onaylanan Türkiye içi banka transfer ödemeleri",
  "srv.pay.bankTr.insTitle": "Havale / EFT ile yükleme",
  "srv.pay.bankTr.insNote":
    "Aşağıdaki IBAN'a tutarı gönder. Açıklama kısmına üye numaranı yaz; ödemen onaylanınca bakiyene yansır.",
  "srv.pay.card.title": "Kredi Kartı & Global Kart Ödemeleri",
  "srv.pay.card.desc": "Visa ve Mastercard ile hızlı ve güvenli kart ödemeleri",
  "srv.pay.card.insTitle": "Kart ile yükleme",
  "srv.pay.card.insNote":
    "Tutarı gir ve devam et; güvenli 3D Secure ödeme ekranına yönlendirileceksin. (Demo ortamında ödeme alınmaz.)",
  "srv.pay.wallets.title": "Dijital Cüzdanlar",
  "srv.pay.wallets.desc":
    "Yerel ve global dijital cüzdanlar ile hızlı ödeme seçenekleri",
  "srv.pay.wallets.insTitle": "Dijital cüzdan ile yükleme",
  "srv.pay.wallets.insNote":
    "Papara, Paycell gibi dijital cüzdanlardan tutarı gönder. Ödemen onaylanınca bakiyene yansır.",
  "srv.pay.crypto.title": "Kripto Para ile Ödeme",
  "srv.pay.crypto.desc":
    "Kripto para cüzdanları ile hızlı ve global ödeme imkânı",
  "srv.pay.crypto.insTitle": "Kripto ile yükleme",
  "srv.pay.crypto.insNote":
    "Aşağıdaki cüzdan adresine (TRC-20) USDT gönder. Ağ onayından sonra bakiyene yansır.",
  "srv.pay.localBank.title": "Yerel Banka Sistemleri",
  "srv.pay.localBank.desc":
    "Bazı ülkelerde kullanılan özel banka altyapıları ile ödeme",
  "srv.pay.localBank.insTitle": "Yerel banka ile yükleme",
  "srv.pay.localBank.insNote":
    "Ülkene özel banka altyapısı ile ödeme yap. Detaylar için destek ekibiyle iletişime geçebilirsin.",
  "srv.pay.cash.title": "Nakit / Fiziksel Ödeme Noktaları",
  "srv.pay.cash.desc":
    "Fiziksel mağaza veya ödeme noktalarından nakit ile yapılan ödemeler",
  "srv.pay.cash.insTitle": "Nakit ödeme noktası",
  "srv.pay.cash.insNote":
    "Anlaşmalı ödeme noktalarından (bayi/market) üye numaranı söyleyerek nakit yükleme yapabilirsin.",
  "srv.pay.giftCard.title": "Hediye Kartı & Dijital Pazar Yerleri",
  "srv.pay.giftCard.desc":
    "Önceden satın alınmış hediye kartları ile ödeme yapabilirsiniz",
  "srv.pay.giftCard.insTitle": "Hediye kartı ile yükleme",
  "srv.pay.giftCard.insNote":
    "Elinde bulunan hediye kartı kodunu destek talebi açarak ilet; doğrulandıktan sonra bakiyene eklenir.",
  "srv.pay.steam.title": "Steam ile Ödeme",
  "srv.pay.steam.desc": "Steam skin'ler ile ödeme yapabilirsiniz",
  "srv.pay.steam.insTitle": "Steam skin ile yükleme",
  "srv.pay.steam.insNote":
    "Steam envanterindeki skin'lerle ödeme yapmak için destek ekibiyle iletişime geç.",

  // ── favorites-notify (in-app) ──
  "srv.fn.priceDropTitle": "Favori ürününde fiyat düştü 🎉",
  "srv.fn.priceDropBody": "{name} artık {next} (önceki {old}). Kaçırma!",
  "srv.fn.priceUpTitle": "Favori ürününde fiyat güncellendi",
  "srv.fn.priceUpBody":
    "{name} fiyatı {next} olarak güncellendi (önceki {old}).",
  "srv.fn.backInStockTitle": "Favori ürünün tekrar stokta 🛒",
  "srv.fn.backInStockBody":
    "{name} yeniden satışta. Stoklar tükenmeden göz at!",

  // ── relative-time ──
  "srv.rt.justNow": "az önce",
  "srv.rt.minAgo": "{n} dk önce",
  "srv.rt.hourAgo": "{n} saat önce",
  "srv.rt.dayAgo": "{n} gün önce",
  "srv.rt.monthAgo": "{n} ay önce",
  "srv.rt.yearAgo": "{n} yıl önce",
};

export const en: Dict = {
  // ── promo ──
  "srv.pm.codeMin": "Code must be at least 3 characters.",
  "srv.pm.invalid": "Invalid code.",
  "srv.pm.failed": "Operation failed, please try again.",
  "srv.pm.applied": "Promo code applied!",

  // ── support ──
  "srv.sp.fillAll": "Please fill in all fields.",
  "srv.sp.createFailed": "Could not create the ticket.",
  "srv.sp.msgInvalid": "Invalid message.",
  "srv.sp.notFound": "Ticket not found.",
  "srv.sp.closed": "This ticket has been closed.",
  "srv.sp.badRequest": "Invalid request.",
  "srv.sp.alreadyClosed": "Ticket is already closed.",
  "srv.sp.alreadyOpen": "Ticket is already open.",
  "srv.sp.reopened": "— Ticket reopened —",

  // ── earn ──
  "srv.ea.urlInvalid": "Enter a valid share link.",
  "srv.ea.invalidData": "Invalid data.",
  "srv.ea.duplicate": "You have already submitted this share.",
  "srv.ea.submitFailed": "Could not submit, try again.",
  "srv.ea.notFound": "Submission not found.",
  "srv.ea.alreadyHandled": "This submission has already been processed.",
  "srv.ea.approveFailed": "Could not approve.",
  "srv.ea.rejectFailed": "Could not reject.",
  "srv.ea.adminTitle": "New Earn submission",
  "srv.ea.adminBody": "{nickname} submitted a {platform} share.",
  "srv.ea.approvedTitle": "Your Earn reward is approved! 🎉",
  "srv.ea.approvedBodyReward":
    "Your share was approved, +{reward} added to your wallet.",
  "srv.ea.approvedBodyNoReward": "Your share was approved, thank you!",
  "srv.ea.rejectedTitle": "Your Earn submission was rejected",
  "srv.ea.rejectedBody": "Your share did not meet the reward criteria.",
  "srv.ea.rejectDefault": "Does not meet the criteria.",

  // ── satisfaction ──
  "srv.sa.invalidRating": "Invalid rating.",
  "srv.sa.sendFailed": "Could not send, please try again.",

  // ── onboarding ──
  "srv.on.profile.title": "Complete your profile",
  "srv.on.profile.desc": "Add a profile photo to personalize your account.",
  "srv.on.balance.title": "Load your first balance",
  "srv.on.balance.desc":
    "Top up your wallet and be ready to shop with one click.",
  "srv.on.order.title": "Place your first order",
  "srv.on.order.desc":
    "Pick a product from the store and get your code instantly.",
  "srv.on.referral.title": "Invite a friend",
  "srv.on.referral.desc": "Share your invite link and earn together.",

  // ── payment-methods ──
  "srv.pay.fallbackLabel": "Balance top-up",
  "srv.pay.withLabel": "via {label} ",
  "srv.pay.bankTr.title": "Turkey Bank Transfer",
  "srv.pay.bankTr.desc":
    "Fee-free, automatically approved domestic Turkey bank transfer payments",
  "srv.pay.bankTr.insTitle": "Top up via wire / EFT",
  "srv.pay.bankTr.insNote":
    "Send the amount to the IBAN below. Write your member number in the description; your balance updates once the payment is approved.",
  "srv.pay.card.title": "Credit Card & Global Card Payments",
  "srv.pay.card.desc": "Fast and secure card payments with Visa and Mastercard",
  "srv.pay.card.insTitle": "Top up by card",
  "srv.pay.card.insNote":
    "Enter the amount and continue; you'll be redirected to the secure 3D Secure payment screen. (No payment is taken in the demo environment.)",
  "srv.pay.wallets.title": "Digital Wallets",
  "srv.pay.wallets.desc":
    "Fast payment options with local and global digital wallets",
  "srv.pay.wallets.insTitle": "Top up via digital wallet",
  "srv.pay.wallets.insNote":
    "Send the amount from digital wallets such as Papara or Paycell. Your balance updates once the payment is approved.",
  "srv.pay.crypto.title": "Crypto Payment",
  "srv.pay.crypto.desc": "Fast and global payment option with crypto wallets",
  "srv.pay.crypto.insTitle": "Top up with crypto",
  "srv.pay.crypto.insNote":
    "Send USDT to the wallet address below (TRC-20). Your balance updates after network confirmation.",
  "srv.pay.localBank.title": "Local Bank Systems",
  "srv.pay.localBank.desc":
    "Payment via special bank infrastructure used in some countries",
  "srv.pay.localBank.insTitle": "Top up via local bank",
  "srv.pay.localBank.insNote":
    "Pay using the bank infrastructure specific to your country. Contact the support team for details.",
  "srv.pay.cash.title": "Cash / Physical Payment Points",
  "srv.pay.cash.desc": "Cash payments made at physical stores or payment points",
  "srv.pay.cash.insTitle": "Cash payment point",
  "srv.pay.cash.insNote":
    "Top up with cash at partner payment points (dealer/store) by giving your member number.",
  "srv.pay.giftCard.title": "Gift Card & Digital Marketplaces",
  "srv.pay.giftCard.desc": "You can pay with previously purchased gift cards",
  "srv.pay.giftCard.insTitle": "Top up with a gift card",
  "srv.pay.giftCard.insNote":
    "Send your gift card code by opening a support ticket; it is added to your balance after verification.",
  "srv.pay.steam.title": "Pay with Steam",
  "srv.pay.steam.desc": "You can pay with Steam skins",
  "srv.pay.steam.insTitle": "Top up with Steam skins",
  "srv.pay.steam.insNote":
    "Contact the support team to pay with skins from your Steam inventory.",

  // ── favorites-notify (in-app) ──
  "srv.fn.priceDropTitle": "Price dropped on your favorite 🎉",
  "srv.fn.priceDropBody": "{name} is now {next} (was {old}). Don't miss it!",
  "srv.fn.priceUpTitle": "Price updated on your favorite",
  "srv.fn.priceUpBody": "{name} price was updated to {next} (was {old}).",
  "srv.fn.backInStockTitle": "Your favorite is back in stock 🛒",
  "srv.fn.backInStockBody":
    "{name} is on sale again. Check it out before stock runs out!",

  // ── relative-time ──
  "srv.rt.justNow": "just now",
  "srv.rt.minAgo": "{n} min ago",
  "srv.rt.hourAgo": "{n} h ago",
  "srv.rt.dayAgo": "{n} d ago",
  "srv.rt.monthAgo": "{n} mo ago",
  "srv.rt.yearAgo": "{n} y ago",
};

export const de: Dict = {
  // ── promo ──
  "srv.pm.codeMin": "Code muss mindestens 3 Zeichen lang sein.",
  "srv.pm.invalid": "Ungültiger Code.",
  "srv.pm.failed": "Vorgang fehlgeschlagen, bitte erneut versuchen.",
  "srv.pm.applied": "Promo-Code angewendet!",

  // ── support ──
  "srv.sp.fillAll": "Bitte fülle alle Felder aus.",
  "srv.sp.createFailed": "Ticket konnte nicht erstellt werden.",
  "srv.sp.msgInvalid": "Ungültige Nachricht.",
  "srv.sp.notFound": "Ticket nicht gefunden.",
  "srv.sp.closed": "Dieses Ticket wurde geschlossen.",
  "srv.sp.badRequest": "Ungültige Anfrage.",
  "srv.sp.alreadyClosed": "Ticket ist bereits geschlossen.",
  "srv.sp.alreadyOpen": "Ticket ist bereits offen.",
  "srv.sp.reopened": "— Ticket wieder geöffnet —",

  // ── earn ──
  "srv.ea.urlInvalid": "Gib einen gültigen Teilen-Link ein.",
  "srv.ea.invalidData": "Ungültige Daten.",
  "srv.ea.duplicate": "Du hast diesen Beitrag bereits eingereicht.",
  "srv.ea.submitFailed": "Konnte nicht gesendet werden, versuche es erneut.",
  "srv.ea.notFound": "Einreichung nicht gefunden.",
  "srv.ea.alreadyHandled": "Diese Einreichung wurde bereits bearbeitet.",
  "srv.ea.approveFailed": "Konnte nicht genehmigt werden.",
  "srv.ea.rejectFailed": "Konnte nicht abgelehnt werden.",
  "srv.ea.adminTitle": "Neue Verdienen-Einreichung",
  "srv.ea.adminBody": "{nickname} hat einen {platform}-Beitrag eingereicht.",
  "srv.ea.approvedTitle": "Deine Verdienen-Belohnung ist genehmigt! 🎉",
  "srv.ea.approvedBodyReward":
    "Dein Beitrag wurde genehmigt, +{reward} zu deinem Guthaben hinzugefügt.",
  "srv.ea.approvedBodyNoReward": "Dein Beitrag wurde genehmigt, danke!",
  "srv.ea.rejectedTitle": "Deine Verdienen-Einreichung wurde abgelehnt",
  "srv.ea.rejectedBody": "Dein Beitrag erfüllte die Belohnungskriterien nicht.",
  "srv.ea.rejectDefault": "Erfüllt die Kriterien nicht.",

  // ── satisfaction ──
  "srv.sa.invalidRating": "Ungültige Bewertung.",
  "srv.sa.sendFailed": "Konnte nicht gesendet werden, bitte erneut versuchen.",

  // ── onboarding ──
  "srv.on.profile.title": "Vervollständige dein Profil",
  "srv.on.profile.desc":
    "Füge ein Profilfoto hinzu, um dein Konto zu personalisieren.",
  "srv.on.balance.title": "Lade dein erstes Guthaben auf",
  "srv.on.balance.desc":
    "Lade dein Wallet auf und sei mit einem Klick bereit zum Einkaufen.",
  "srv.on.order.title": "Gib deine erste Bestellung auf",
  "srv.on.order.desc":
    "Wähle ein Produkt im Shop und erhalte deinen Code sofort.",
  "srv.on.referral.title": "Lade einen Freund ein",
  "srv.on.referral.desc": "Teile deinen Einladungslink und verdient gemeinsam.",

  // ── payment-methods ──
  "srv.pay.fallbackLabel": "Guthaben aufladen",
  "srv.pay.withLabel": "per {label} ",
  "srv.pay.bankTr.title": "Türkei-Banküberweisung",
  "srv.pay.bankTr.desc":
    "Gebührenfreie, automatisch bestätigte Banküberweisungen innerhalb der Türkei",
  "srv.pay.bankTr.insTitle": "Aufladen per Überweisung / EFT",
  "srv.pay.bankTr.insNote":
    "Sende den Betrag an die IBAN unten. Schreibe deine Mitgliedsnummer in den Verwendungszweck; dein Guthaben wird nach Bestätigung der Zahlung gutgeschrieben.",
  "srv.pay.card.title": "Kreditkarte & globale Kartenzahlungen",
  "srv.pay.card.desc":
    "Schnelle und sichere Kartenzahlungen mit Visa und Mastercard",
  "srv.pay.card.insTitle": "Aufladen per Karte",
  "srv.pay.card.insNote":
    "Gib den Betrag ein und fahre fort; du wirst zum sicheren 3D-Secure-Zahlungsbildschirm weitergeleitet. (In der Demo-Umgebung wird keine Zahlung erhoben.)",
  "srv.pay.wallets.title": "Digitale Wallets",
  "srv.pay.wallets.desc":
    "Schnelle Zahlungsoptionen mit lokalen und globalen digitalen Wallets",
  "srv.pay.wallets.insTitle": "Aufladen per digitalem Wallet",
  "srv.pay.wallets.insNote":
    "Sende den Betrag von digitalen Wallets wie Papara oder Paycell. Dein Guthaben wird nach Bestätigung der Zahlung gutgeschrieben.",
  "srv.pay.crypto.title": "Zahlung mit Krypto",
  "srv.pay.crypto.desc": "Schnelle und globale Zahlungsoption mit Krypto-Wallets",
  "srv.pay.crypto.insTitle": "Aufladen mit Krypto",
  "srv.pay.crypto.insNote":
    "Sende USDT an die Wallet-Adresse unten (TRC-20). Dein Guthaben wird nach Netzwerkbestätigung gutgeschrieben.",
  "srv.pay.localBank.title": "Lokale Banksysteme",
  "srv.pay.localBank.desc":
    "Zahlung über spezielle Bankinfrastrukturen, die in einigen Ländern genutzt werden",
  "srv.pay.localBank.insTitle": "Aufladen per lokaler Bank",
  "srv.pay.localBank.insNote":
    "Zahle über die für dein Land spezifische Bankinfrastruktur. Wende dich für Details an das Support-Team.",
  "srv.pay.cash.title": "Bargeld / physische Zahlstellen",
  "srv.pay.cash.desc": "Barzahlungen an physischen Geschäften oder Zahlstellen",
  "srv.pay.cash.insTitle": "Bar-Zahlstelle",
  "srv.pay.cash.insNote":
    "Lade an Partner-Zahlstellen (Händler/Markt) bar auf, indem du deine Mitgliedsnummer angibst.",
  "srv.pay.giftCard.title": "Geschenkkarte & digitale Marktplätze",
  "srv.pay.giftCard.desc":
    "Du kannst mit zuvor gekauften Geschenkkarten bezahlen",
  "srv.pay.giftCard.insTitle": "Aufladen mit Geschenkkarte",
  "srv.pay.giftCard.insNote":
    "Sende deinen Geschenkkartencode über ein Support-Ticket; er wird nach Überprüfung deinem Guthaben hinzugefügt.",
  "srv.pay.steam.title": "Zahlung mit Steam",
  "srv.pay.steam.desc": "Du kannst mit Steam-Skins bezahlen",
  "srv.pay.steam.insTitle": "Aufladen mit Steam-Skins",
  "srv.pay.steam.insNote":
    "Wende dich an das Support-Team, um mit Skins aus deinem Steam-Inventar zu bezahlen.",

  // ── favorites-notify (in-app) ──
  "srv.fn.priceDropTitle": "Preis bei deinem Favoriten gefallen 🎉",
  "srv.fn.priceDropBody":
    "{name} kostet jetzt {next} (vorher {old}). Verpass es nicht!",
  "srv.fn.priceUpTitle": "Preis bei deinem Favoriten aktualisiert",
  "srv.fn.priceUpBody":
    "{name}-Preis wurde auf {next} aktualisiert (vorher {old}).",
  "srv.fn.backInStockTitle": "Dein Favorit ist wieder verfügbar 🛒",
  "srv.fn.backInStockBody":
    "{name} ist wieder im Verkauf. Schau vorbei, bevor der Vorrat zu Ende ist!",

  // ── relative-time ──
  "srv.rt.justNow": "gerade eben",
  "srv.rt.minAgo": "vor {n} Min.",
  "srv.rt.hourAgo": "vor {n} Std.",
  "srv.rt.dayAgo": "vor {n} T.",
  "srv.rt.monthAgo": "vor {n} Mon.",
  "srv.rt.yearAgo": "vor {n} J.",
};

export const ar: Dict = {
  // ── promo ──
  "srv.pm.codeMin": "يجب أن يكون الرمز 3 أحرف على الأقل.",
  "srv.pm.invalid": "رمز غير صالح.",
  "srv.pm.failed": "فشلت العملية، يرجى المحاولة مرة أخرى.",
  "srv.pm.applied": "تم تطبيق الرمز الترويجي!",

  // ── support ──
  "srv.sp.fillAll": "يرجى ملء جميع الحقول.",
  "srv.sp.createFailed": "تعذّر إنشاء الطلب.",
  "srv.sp.msgInvalid": "رسالة غير صالحة.",
  "srv.sp.notFound": "لم يتم العثور على الطلب.",
  "srv.sp.closed": "تم إغلاق هذا الطلب.",
  "srv.sp.badRequest": "طلب غير صالح.",
  "srv.sp.alreadyClosed": "الطلب مغلق بالفعل.",
  "srv.sp.alreadyOpen": "الطلب مفتوح بالفعل.",
  "srv.sp.reopened": "— تمت إعادة فتح الطلب —",

  // ── earn ──
  "srv.ea.urlInvalid": "أدخل رابط مشاركة صالحًا.",
  "srv.ea.invalidData": "بيانات غير صالحة.",
  "srv.ea.duplicate": "لقد أرسلت هذه المشاركة من قبل.",
  "srv.ea.submitFailed": "تعذّر الإرسال، حاول مرة أخرى.",
  "srv.ea.notFound": "لم يتم العثور على الطلب.",
  "srv.ea.alreadyHandled": "تمت معالجة هذا الطلب بالفعل.",
  "srv.ea.approveFailed": "تعذّرت الموافقة.",
  "srv.ea.rejectFailed": "تعذّر الرفض.",
  "srv.ea.adminTitle": "طلب ربح جديد",
  "srv.ea.adminBody": "أرسل {nickname} مشاركة على {platform}.",
  "srv.ea.approvedTitle": "تمت الموافقة على مكافأة الربح الخاصة بك! 🎉",
  "srv.ea.approvedBodyReward":
    "تمت الموافقة على مشاركتك، وأُضيف +{reward} إلى محفظتك.",
  "srv.ea.approvedBodyNoReward": "تمت الموافقة على مشاركتك، شكرًا لك!",
  "srv.ea.rejectedTitle": "تم رفض طلب الربح الخاص بك",
  "srv.ea.rejectedBody": "لم تستوفِ مشاركتك معايير المكافأة.",
  "srv.ea.rejectDefault": "لا يستوفي المعايير.",

  // ── satisfaction ──
  "srv.sa.invalidRating": "تقييم غير صالح.",
  "srv.sa.sendFailed": "تعذّر الإرسال، يرجى المحاولة مرة أخرى.",

  // ── onboarding ──
  "srv.on.profile.title": "أكمل ملفك الشخصي",
  "srv.on.profile.desc": "أضف صورة للملف الشخصي لتخصيص حسابك.",
  "srv.on.balance.title": "اشحن رصيدك الأول",
  "srv.on.balance.desc": "اشحن محفظتك وكن جاهزًا للتسوق بنقرة واحدة.",
  "srv.on.order.title": "قم بأول طلب لك",
  "srv.on.order.desc": "اختر منتجًا من المتجر واحصل على رمزك فورًا.",
  "srv.on.referral.title": "ادعُ صديقًا",
  "srv.on.referral.desc": "شارك رابط الدعوة واربحوا معًا.",

  // ── payment-methods ──
  "srv.pay.fallbackLabel": "شحن الرصيد",
  "srv.pay.withLabel": "عبر {label} ",
  "srv.pay.bankTr.title": "تحويل بنكي في تركيا",
  "srv.pay.bankTr.desc":
    "مدفوعات تحويل بنكي داخل تركيا بدون رسوم ومعتمدة تلقائيًا",
  "srv.pay.bankTr.insTitle": "الشحن عبر الحوالة / EFT",
  "srv.pay.bankTr.insNote":
    "أرسل المبلغ إلى رقم الآيبان أدناه. اكتب رقم عضويتك في خانة الوصف؛ يُضاف الرصيد بعد اعتماد دفعتك.",
  "srv.pay.card.title": "بطاقة ائتمان ومدفوعات البطاقات العالمية",
  "srv.pay.card.desc": "مدفوعات بطاقات سريعة وآمنة عبر Visa وMastercard",
  "srv.pay.card.insTitle": "الشحن بالبطاقة",
  "srv.pay.card.insNote":
    "أدخل المبلغ وتابع؛ ستتم إعادة توجيهك إلى شاشة دفع 3D Secure الآمنة. (لا يتم تحصيل أي دفعة في بيئة العرض التجريبي.)",
  "srv.pay.wallets.title": "المحافظ الرقمية",
  "srv.pay.wallets.desc": "خيارات دفع سريعة عبر المحافظ الرقمية المحلية والعالمية",
  "srv.pay.wallets.insTitle": "الشحن عبر محفظة رقمية",
  "srv.pay.wallets.insNote":
    "أرسل المبلغ من محافظ رقمية مثل Papara أو Paycell. يُضاف الرصيد بعد اعتماد دفعتك.",
  "srv.pay.crypto.title": "الدفع بالعملات المشفرة",
  "srv.pay.crypto.desc": "خيار دفع سريع وعالمي عبر محافظ العملات المشفرة",
  "srv.pay.crypto.insTitle": "الشحن بالعملات المشفرة",
  "srv.pay.crypto.insNote":
    "أرسل USDT إلى عنوان المحفظة أدناه (TRC-20). يُضاف الرصيد بعد تأكيد الشبكة.",
  "srv.pay.localBank.title": "أنظمة البنوك المحلية",
  "srv.pay.localBank.desc": "الدفع عبر بنى تحتية بنكية خاصة تُستخدم في بعض الدول",
  "srv.pay.localBank.insTitle": "الشحن عبر بنك محلي",
  "srv.pay.localBank.insNote":
    "ادفع عبر البنية التحتية البنكية الخاصة ببلدك. تواصل مع فريق الدعم للتفاصيل.",
  "srv.pay.cash.title": "نقاط الدفع النقدي / المادي",
  "srv.pay.cash.desc": "مدفوعات نقدية تتم في المتاجر أو نقاط الدفع المادية",
  "srv.pay.cash.insTitle": "نقطة دفع نقدي",
  "srv.pay.cash.insNote":
    "اشحن نقدًا في نقاط الدفع الشريكة (وكيل/متجر) بذكر رقم عضويتك.",
  "srv.pay.giftCard.title": "بطاقة هدايا والأسواق الرقمية",
  "srv.pay.giftCard.desc": "يمكنك الدفع ببطاقات الهدايا المشتراة مسبقًا",
  "srv.pay.giftCard.insTitle": "الشحن ببطاقة هدايا",
  "srv.pay.giftCard.insNote":
    "أرسل رمز بطاقة الهدايا عبر فتح طلب دعم؛ يُضاف إلى رصيدك بعد التحقق.",
  "srv.pay.steam.title": "الدفع عبر Steam",
  "srv.pay.steam.desc": "يمكنك الدفع بأغلفة Steam (skins)",
  "srv.pay.steam.insTitle": "الشحن بأغلفة Steam",
  "srv.pay.steam.insNote":
    "تواصل مع فريق الدعم للدفع بالأغلفة الموجودة في مخزون Steam الخاص بك.",

  // ── favorites-notify (in-app) ──
  "srv.fn.priceDropTitle": "انخفض سعر منتجك المفضل 🎉",
  "srv.fn.priceDropBody": "{name} الآن {next} (كان {old}). لا تفوّته!",
  "srv.fn.priceUpTitle": "تم تحديث سعر منتجك المفضل",
  "srv.fn.priceUpBody": "تم تحديث سعر {name} إلى {next} (كان {old}).",
  "srv.fn.backInStockTitle": "منتجك المفضل متوفر مجددًا 🛒",
  "srv.fn.backInStockBody":
    "{name} معروض للبيع مجددًا. اطّلع عليه قبل نفاد المخزون!",

  // ── relative-time ──
  "srv.rt.justNow": "الآن",
  "srv.rt.minAgo": "قبل {n} د",
  "srv.rt.hourAgo": "قبل {n} س",
  "srv.rt.dayAgo": "قبل {n} ي",
  "srv.rt.monthAgo": "قبل {n} ش",
  "srv.rt.yearAgo": "قبل {n} سنة",
};

export const ru: Dict = {
  // ── promo ──
  "srv.pm.codeMin": "Код должен содержать не менее 3 символов.",
  "srv.pm.invalid": "Неверный код.",
  "srv.pm.failed": "Операция не удалась, попробуйте ещё раз.",
  "srv.pm.applied": "Промокод применён!",

  // ── support ──
  "srv.sp.fillAll": "Пожалуйста, заполните все поля.",
  "srv.sp.createFailed": "Не удалось создать обращение.",
  "srv.sp.msgInvalid": "Недопустимое сообщение.",
  "srv.sp.notFound": "Обращение не найдено.",
  "srv.sp.closed": "Это обращение закрыто.",
  "srv.sp.badRequest": "Недопустимый запрос.",
  "srv.sp.alreadyClosed": "Обращение уже закрыто.",
  "srv.sp.alreadyOpen": "Обращение уже открыто.",
  "srv.sp.reopened": "— Обращение снова открыто —",

  // ── earn ──
  "srv.ea.urlInvalid": "Введите корректную ссылку на публикацию.",
  "srv.ea.invalidData": "Недопустимые данные.",
  "srv.ea.duplicate": "Вы уже отправляли эту публикацию.",
  "srv.ea.submitFailed": "Не удалось отправить, попробуйте ещё раз.",
  "srv.ea.notFound": "Заявка не найдена.",
  "srv.ea.alreadyHandled": "Эта заявка уже обработана.",
  "srv.ea.approveFailed": "Не удалось одобрить.",
  "srv.ea.rejectFailed": "Не удалось отклонить.",
  "srv.ea.adminTitle": "Новая заявка «Заработай»",
  "srv.ea.adminBody": "{nickname} отправил(а) публикацию на {platform}.",
  "srv.ea.approvedTitle": "Ваша награда «Заработай» одобрена! 🎉",
  "srv.ea.approvedBodyReward":
    "Ваша публикация одобрена, +{reward} зачислено на кошелёк.",
  "srv.ea.approvedBodyNoReward": "Ваша публикация одобрена, спасибо!",
  "srv.ea.rejectedTitle": "Ваша заявка «Заработай» отклонена",
  "srv.ea.rejectedBody": "Ваша публикация не соответствует критериям награды.",
  "srv.ea.rejectDefault": "Не соответствует критериям.",

  // ── satisfaction ──
  "srv.sa.invalidRating": "Недопустимая оценка.",
  "srv.sa.sendFailed": "Не удалось отправить, попробуйте ещё раз.",

  // ── onboarding ──
  "srv.on.profile.title": "Заполните профиль",
  "srv.on.profile.desc": "Добавьте фото профиля, чтобы персонализировать аккаунт.",
  "srv.on.balance.title": "Пополните первый баланс",
  "srv.on.balance.desc":
    "Пополните кошелёк и будьте готовы к покупкам в один клик.",
  "srv.on.order.title": "Сделайте первый заказ",
  "srv.on.order.desc": "Выберите товар в магазине и получите код мгновенно.",
  "srv.on.referral.title": "Пригласите друга",
  "srv.on.referral.desc":
    "Поделитесь ссылкой-приглашением и зарабатывайте вместе.",

  // ── payment-methods ──
  "srv.pay.fallbackLabel": "Пополнение баланса",
  "srv.pay.withLabel": "через {label} ",
  "srv.pay.bankTr.title": "Банковский перевод в Турции",
  "srv.pay.bankTr.desc":
    "Бесплатные, автоматически подтверждаемые внутренние банковские переводы в Турции",
  "srv.pay.bankTr.insTitle": "Пополнение переводом / EFT",
  "srv.pay.bankTr.insNote":
    "Отправьте сумму на IBAN ниже. Укажите свой номер участника в назначении платежа; баланс пополнится после подтверждения оплаты.",
  "srv.pay.card.title": "Кредитная карта и глобальные карточные платежи",
  "srv.pay.card.desc": "Быстрые и безопасные карточные платежи Visa и Mastercard",
  "srv.pay.card.insTitle": "Пополнение картой",
  "srv.pay.card.insNote":
    "Введите сумму и продолжите; вы будете перенаправлены на безопасный экран оплаты 3D Secure. (В демо-среде оплата не списывается.)",
  "srv.pay.wallets.title": "Цифровые кошельки",
  "srv.pay.wallets.desc":
    "Быстрые способы оплаты через локальные и глобальные цифровые кошельки",
  "srv.pay.wallets.insTitle": "Пополнение через цифровой кошелёк",
  "srv.pay.wallets.insNote":
    "Отправьте сумму из цифровых кошельков, таких как Papara или Paycell. Баланс пополнится после подтверждения оплаты.",
  "srv.pay.crypto.title": "Оплата криптовалютой",
  "srv.pay.crypto.desc": "Быстрый и глобальный способ оплаты через крипто-кошельки",
  "srv.pay.crypto.insTitle": "Пополнение криптовалютой",
  "srv.pay.crypto.insNote":
    "Отправьте USDT на адрес кошелька ниже (TRC-20). Баланс пополнится после подтверждения сети.",
  "srv.pay.localBank.title": "Локальные банковские системы",
  "srv.pay.localBank.desc":
    "Оплата через специальную банковскую инфраструктуру, используемую в некоторых странах",
  "srv.pay.localBank.insTitle": "Пополнение через локальный банк",
  "srv.pay.localBank.insNote":
    "Оплатите через банковскую инфраструктуру вашей страны. За деталями обратитесь в службу поддержки.",
  "srv.pay.cash.title": "Наличные / физические точки оплаты",
  "srv.pay.cash.desc": "Платежи наличными в физических магазинах или точках оплаты",
  "srv.pay.cash.insTitle": "Точка оплаты наличными",
  "srv.pay.cash.insNote":
    "Пополняйте наличными в партнёрских точках оплаты (дилер/магазин), назвав свой номер участника.",
  "srv.pay.giftCard.title": "Подарочная карта и цифровые маркетплейсы",
  "srv.pay.giftCard.desc":
    "Вы можете оплатить ранее купленными подарочными картами",
  "srv.pay.giftCard.insTitle": "Пополнение подарочной картой",
  "srv.pay.giftCard.insNote":
    "Отправьте код подарочной карты, открыв обращение в поддержку; он будет зачислен на баланс после проверки.",
  "srv.pay.steam.title": "Оплата через Steam",
  "srv.pay.steam.desc": "Вы можете оплатить скинами Steam",
  "srv.pay.steam.insTitle": "Пополнение скинами Steam",
  "srv.pay.steam.insNote":
    "Свяжитесь со службой поддержки, чтобы оплатить скинами из вашего инвентаря Steam.",

  // ── favorites-notify (in-app) ──
  "srv.fn.priceDropTitle": "Цена на ваш избранный товар снизилась 🎉",
  "srv.fn.priceDropBody": "{name} теперь {next} (было {old}). Не упустите!",
  "srv.fn.priceUpTitle": "Цена на ваш избранный товар обновлена",
  "srv.fn.priceUpBody": "Цена {name} обновлена до {next} (было {old}).",
  "srv.fn.backInStockTitle": "Ваш избранный товар снова в наличии 🛒",
  "srv.fn.backInStockBody":
    "{name} снова в продаже. Загляните, пока товар не закончился!",

  // ── relative-time ──
  "srv.rt.justNow": "только что",
  "srv.rt.minAgo": "{n} мин назад",
  "srv.rt.hourAgo": "{n} ч назад",
  "srv.rt.dayAgo": "{n} дн назад",
  "srv.rt.monthAgo": "{n} мес назад",
  "srv.rt.yearAgo": "{n} г назад",
};
