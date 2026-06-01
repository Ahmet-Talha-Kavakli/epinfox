import type { Dict } from "./core";

// i18n parça dosyası. dictionaries.ts birleştirir.
// PREFIX: legal.refund.* (refund/page.tsx), legal.dist.* (distance-sales/page.tsx)

export const tr: Dict = {
  // ── İade & Cayma Hakkı ──
  "legal.refund.title": "İade & Cayma Hakkı",
  "legal.refund.updated": "31.05.2026",
  "legal.refund.intro.1":
    " üzerinden satılan tüm ürünler dijital içerik (e-pin, oyun bakiyesi, dijital kod, abonelik, lisans) niteliğindedir ve teslimat, ödeme onaylandığı anda elektronik ortamda gerçekleşir. İşbu politika, iade ve cayma hakkına ilişkin koşulları açıklar ve ",
  "legal.refund.intro.link": "Mesafeli Satış Sözleşmesi",
  "legal.refund.intro.2": " ile birlikte uygulanır.",

  "legal.refund.s1.title": "1. Cayma Hakkının Bulunmadığı Haller",
  "legal.refund.s1.body":
    "Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca, elektronik ortamda anında ifa edilen ve tüketiciye anında teslim edilen gayri maddi mallarda (dijital kodlar, e-pinler, bakiyeler) cayma hakkı kullanılamaz. Kod görüntülendikten / teslim edildikten sonra iade kabul edilmez. Kullanıcı, sipariş sırasında bu hususu açıkça onaylar.",

  "legal.refund.s2.title": "2. İade Kabul Edilen İstisnai Durumlar",
  "legal.refund.s2.lead.1": "Aşağıdaki durumlarda, kod henüz ",
  "legal.refund.s2.lead.strong": "kullanılmamış ve görüntülenmemiş",
  "legal.refund.s2.lead.2": " olmak kaydıyla iade veya değişim talebi değerlendirilir:",
  "legal.refund.s2.li1": "Teslim edilen kodun hatalı, geçersiz veya daha önce kullanılmış olması,",
  "legal.refund.s2.li2": "Sipariş edilenden farklı (yanlış) ürünün teslim edilmiş olması,",
  "legal.refund.s2.li3": "Teknik bir hata nedeniyle ürünün hiç teslim edilememesi,",
  "legal.refund.s2.li4": "Çift (mükerrer) tahsilat yapılması,",
  "legal.refund.s2.li5": "Ürünün ilan edilen temel niteliklerini açıkça karşılamaması.",
  "legal.refund.s21.title": "2.1. Değerlendirme Kriteri",
  "legal.refund.s21.body":
    "İade talebi, kodun kullanım/aktivasyon durumu ve ilgili yayıncı/sağlayıcı kayıtları üzerinden incelenir. Kodun Kullanıcı tarafında kullanıldığı tespit edilirse iade reddedilebilir.",

  "legal.refund.s3.title": "3. İade Talebi Nasıl Oluşturulur?",
  "legal.refund.s3.lead.1": "İade talepleri, sipariş tarihinden itibaren ",
  "legal.refund.s3.lead.strong": "48 saat",
  "legal.refund.s3.lead.2": " içinde, ",
  "legal.refund.s3.lead.link1": "Destek Talebi",
  "legal.refund.s3.lead.3": " oluşturularak veya ",
  "legal.refund.s3.lead.link2": "İletişim",
  "legal.refund.s3.lead.4":
    " sayfası üzerinden iletilmelidir. Talebinizde şunları belirtmeniz işlemi hızlandırır:",
  "legal.refund.s3.li1": "Sipariş numarası,",
  "legal.refund.s3.li2": "Sorunun açık tanımı (hata mesajı, ekran görüntüsü vb.),",
  "legal.refund.s3.li3": "İade tercihi (cüzdan bakiyesi veya ödeme kaynağı).",

  "legal.refund.s4.title": "4. İade Süreci ve Yöntemi",
  "legal.refund.s4.body.1": "Talebin alınmasının ardından, sorun en geç ",
  "legal.refund.s4.body.strong": "3 iş günü",
  "legal.refund.s4.body.2":
    " içinde incelenir. Uygun bulunan iade tutarları, kural olarak mağaza bakiyesine (cüzdan) iade edilir ve anında kullanılabilir. Talebiniz halinde ve ödeme yönteminin elverdiği durumlarda iade, ödemenin yapıldığı kaynağa da gerçekleştirilebilir; bu durumda bankaya bağlı olarak süre 14 güne kadar uzayabilir.",

  "legal.refund.s5.title": "5. Cüzdan Bakiyesi İadesi",
  "legal.refund.s5.body":
    "Cüzdana yüklenmiş ancak harcanmamış bakiyenin iadesine ilişkin talepler, dolandırıcılık kontrolleri tamamlandıktan sonra değerlendirilir. Bonus olarak tanımlanan promosyon bakiyeleri iade/nakit kapsamı dışındadır.",

  "legal.refund.s6.title": "6. Abonelik Ürünleri",
  "legal.refund.s6.body":
    "Abonelik kodları (ör. Nitro, Game Pass) teslim/aktivasyon sonrası iade edilemez. Aktivasyon öncesi tespit edilen hatalı veya geçersiz abonelik kodları, 2. maddedeki istisna kapsamında değerlendirilir.",

  "legal.refund.s7.title": "7. Bayi Siparişleri",
  "legal.refund.s7.body":
    "API veya toptan kanaldan verilen bayi siparişlerinde de işbu politika geçerlidir. Toplu siparişlerde hatalı kodlar, sipariş bazında ve aynı süre koşullarıyla değerlendirilir.",

  "legal.refund.s8.title": "8. Tüketici Hakları ve Başvuru",
  "legal.refund.s8.body":
    "İşbu politika, tüketicinin 6502 sayılı Kanun'dan doğan haklarını ortadan kaldırmaz. Çözüme ulaşılamayan durumlarda, parasal sınırlara göre Tüketici Hakem Heyetleri veya Tüketici Mahkemeleri'ne başvurabilirsiniz.",

  "legal.refund.s9.title": "9. İletişim",
  "legal.refund.s9.body.1":
    "İade ve geri ödeme süreçlerine ilişkin her türlü soru için ",
  "legal.refund.s9.body.2":
    " adresinden veya Destek Talebi üzerinden bize ulaşabilirsiniz.",

  // ── Mesafeli Satış Sözleşmesi ──
  "legal.dist.title": "Mesafeli Satış Sözleşmesi",
  "legal.dist.updated": "31.05.2026",
  "legal.dist.intro":
    "İşbu Mesafeli Satış Sözleşmesi (“Sözleşme”), 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, aşağıda bilgileri yer alan Satıcı ile Alıcı arasında, elektronik ortamda kurulmuştur. Alıcı, siparişini onayladığında bu Sözleşme'nin tüm koşullarını okuduğunu ve kabul ettiğini beyan eder.",

  "legal.dist.s1.title": "1. Taraflar",
  "legal.dist.s1.seller": "Satıcı",
  "legal.dist.s1.row.company": "Unvan",
  "legal.dist.s1.row.address": "Adres",
  "legal.dist.s1.row.tax": "Vergi Dairesi / No",
  "legal.dist.s1.row.mersis": "MERSİS No",
  "legal.dist.s1.row.etbis": "ETBİS Kayıt No",
  "legal.dist.s1.row.email": "E-posta",
  "legal.dist.s1.row.phone": "Telefon",
  "legal.dist.s1.buyer.strong": "Alıcı:",
  "legal.dist.s1.buyer.body":
    " Platforma üye olan ve sipariş veren, bilgileri sipariş kaydında ve üyelik hesabında yer alan kullanıcıdır.",

  "legal.dist.s2.title": "2. Sözleşmenin Konusu",
  "legal.dist.s2.body.1":
    "İşbu Sözleşme'nin konusu, Alıcı'nın ",
  "legal.dist.s2.body.2":
    " üzerinden elektronik ortamda sipariş verdiği, nitelikleri ve satış fiyatı Platform'da belirtilen dijital ürünün (e-pin, oyun bakiyesi, dijital kod, abonelik, lisans) satışı ve teslimine ilişkin, tarafların hak ve yükümlülüklerinin belirlenmesidir.",

  "legal.dist.s3.title": "3. Ürün Bilgileri ve Fiyat",
  "legal.dist.s3.body.1":
    "Ürünün temel nitelikleri, satış fiyatı (vergiler dahil) ve geçerli komisyonlar, sipariş aşamasında Platform'da Alıcı'ya açıkça gösterilir. İlan edilen fiyatlar, güncellenene kadar geçerlidir; tamamlanmış siparişlerin fiyatı değişmez. Fiyatlandırmadaki açık maddi hatalar (örn. sistemsel hatayla sıfır/çok düşük fiyat) halinde ",
  "legal.dist.s3.body.2":
    " siparişi iptal edip ödemeyi iade etme hakkını saklı tutar.",

  "legal.dist.s4.title": "4. Sipariş Süreci",
  "legal.dist.s4.li1": "Alıcı, ürünü sepete ekler ve sipariş bilgilerini onaylar.",
  "legal.dist.s4.li2": "Ödeme, cüzdan bakiyesi veya güvenli ödeme yöntemiyle alınır.",
  "legal.dist.s4.li3": "Ödeme onaylanınca ürün anında teslim edilir ve sipariş kaydı oluşturulur.",
  "legal.dist.s4.li4": "Sipariş özeti ve teslim bilgisi “Siparişlerim” sayfasında ve e-posta ile sunulur.",

  "legal.dist.s5.title": "5. Ödeme",
  "legal.dist.s5.body.1":
    "Ödemeler, mağaza bakiyesi (cüzdan) üzerinden veya Platform'da sunulan güvenli ödeme yöntemleriyle gerçekleştirilir. Cüzdana yüklenen bakiye yalnızca ",
  "legal.dist.s5.body.2":
    " üzerinden ürün alımında kullanılır. Ödeme onaylanmadan sipariş ifa edilmez. Kart bilgileri ",
  "legal.dist.s5.body.3":
    " tarafından saklanmaz; ödeme kuruluşu tarafından işlenir.",

  "legal.dist.s6.title": "6. Teslimat",
  "legal.dist.s6.body":
    "Satışa konu ürünler dijital içeriktir ve fiziki teslimat içermez. Ödeme onaylandıktan sonra ürün kodu, Alıcı'nın “Siparişlerim” sayfasında anında görüntülenir ve kayıtlı e-posta adresine iletilir. Teslimat, kodun bu şekilde Alıcı'nın erişimine sunulmasıyla tamamlanmış sayılır.",
  "legal.dist.s61.title": "6.1. Manuel / Hizmet Teslimi",
  "legal.dist.s61.body":
    "Bazı ürünlerde (oyuncu hesabına yükleme veya sosyal medya hizmeti) teslim, Alıcı'nın sağladığı bilgilerin doğruluğuna bağlıdır ve kısa bir işlem süresi gerektirebilir. Yanlış bilgi nedeniyle ifa edilemeyen siparişlerden Satıcı sorumlu değildir.",

  "legal.dist.s7.title": "7. Cayma Hakkı",
  "legal.dist.s7.body.1":
    "Mesafeli Sözleşmeler Yönetmeliği md. 15/1-ğ uyarınca, elektronik ortamda anında ifa edilen ve Alıcı'ya anında teslim edilen dijital içeriklere ilişkin sözleşmelerde cayma hakkı bulunmamaktadır. Alıcı, sipariş sırasında bu hususu kabul ettiğini beyan eder. Detaylar için ",
  "legal.dist.s7.link": "İade & Cayma Hakkı",
  "legal.dist.s7.body.2": " sayfasına bakınız.",

  "legal.dist.s8.title": "8. Alıcının Beyan ve Taahhütleri",
  "legal.dist.s8.body":
    "Alıcı, ürünü satın almadan önce temel niteliklerini, satış fiyatını ve ödeme bilgilerini okuyup teyit ettiğini; verdiği bilgilerin doğru olduğunu ve ürünü hukuka uygun amaçlarla kullanacağını kabul eder.",

  "legal.dist.s9.title": "9. Temerrüt Hükümleri",
  "legal.dist.s9.body":
    "Ödemenin kredi kartı/banka üzerinden yapıldığı ve sonradan iptal/ret edildiği (ör. haksız chargeback) hallerde, teslim edilmiş dijital ürün bedeli Alıcı'dan talep edilebilir ve hesap askıya alınabilir.",

  "legal.dist.s10.title": "10. Kişisel Verilerin Korunması",
  "legal.dist.s10.body.1": "Alıcı'nın kişisel verileri, ",
  "legal.dist.s10.link": "Gizlilik Politikası & KVKK Aydınlatma Metni",
  "legal.dist.s10.body.2": " kapsamında işlenir.",

  "legal.dist.s11.title": "11. Mücbir Sebep ve Genel Hükümler",
  "legal.dist.s11.body.2":
    ", mücbir sebep veya üçüncü taraf platform kaynaklı aksaklıklardan doğrudan sorumlu tutulamaz; bu hallerde Alıcı'ya çözüm sağlamak için makul çabayı gösterir. Tarafların sistem kayıtları, işbu Sözleşme'den doğacak uyuşmazlıklarda delil teşkil eder.",

  "legal.dist.s12.title": "12. Uyuşmazlıkların Çözümü",
  "legal.dist.s12.body":
    "İşbu Sözleşme'den doğabilecek uyuşmazlıklarda, Ticaret Bakanlığınca her yıl ilan edilen parasal sınıra kadar Tüketici Hakem Heyetleri, bu sınırın üzerindeki uyuşmazlıklarda Tüketici Mahkemeleri yetkilidir.",

  "legal.dist.s13.title": "13. Yürürlük",
  "legal.dist.s13.body":
    "İşbu Sözleşme, Alıcı'nın siparişini elektronik ortamda onaylaması ile kurulmuş ve yürürlüğe girmiş sayılır.",
};

export const en: Dict = {
  // ── Refund & Right of Withdrawal ──
  "legal.refund.title": "Refund & Right of Withdrawal",
  "legal.refund.updated": "05/31/2026",
  "legal.refund.intro.1":
    " consist entirely of digital content (e-pins, game balance, digital codes, subscriptions, licenses), and delivery takes place electronically the moment payment is confirmed. This policy sets out the terms regarding refunds and the right of withdrawal, and applies together with the ",
  "legal.refund.intro.link": "Distance Sales Agreement",
  "legal.refund.intro.2": ".",

  "legal.refund.s1.title": "1. Cases Where No Right of Withdrawal Exists",
  "legal.refund.s1.body":
    "Pursuant to Article 15/1-ğ of the Regulation on Distance Contracts, the right of withdrawal cannot be exercised for intangible goods that are performed instantly in the electronic environment and delivered to the consumer instantly (digital codes, e-pins, balances). No refund is accepted after the code has been viewed / delivered. The User expressly acknowledges this matter during the order.",

  "legal.refund.s2.title": "2. Exceptional Cases Where Refunds Are Accepted",
  "legal.refund.s2.lead.1": "In the following cases, a refund or exchange request is evaluated, provided that the code has not yet been ",
  "legal.refund.s2.lead.strong": "used and viewed",
  "legal.refund.s2.lead.2": ":",
  "legal.refund.s2.li1": "The delivered code being faulty, invalid, or previously used,",
  "legal.refund.s2.li2": "A different (wrong) product being delivered than the one ordered,",
  "legal.refund.s2.li3": "The product not being delivered at all due to a technical error,",
  "legal.refund.s2.li4": "A duplicate (double) charge being made,",
  "legal.refund.s2.li5": "The product clearly failing to meet its advertised essential qualities.",
  "legal.refund.s21.title": "2.1. Evaluation Criterion",
  "legal.refund.s21.body":
    "The refund request is examined based on the usage/activation status of the code and the records of the relevant publisher/provider. If it is determined that the code was used on the User's side, the refund may be rejected.",

  "legal.refund.s3.title": "3. How to Create a Refund Request",
  "legal.refund.s3.lead.1": "Refund requests must be submitted within ",
  "legal.refund.s3.lead.strong": "48 hours",
  "legal.refund.s3.lead.2": " of the order date, by creating a ",
  "legal.refund.s3.lead.link1": "Support Request",
  "legal.refund.s3.lead.3": " or via the ",
  "legal.refund.s3.lead.link2": "Contact",
  "legal.refund.s3.lead.4":
    " page. Specifying the following in your request will speed up the process:",
  "legal.refund.s3.li1": "Order number,",
  "legal.refund.s3.li2": "A clear description of the issue (error message, screenshot, etc.),",
  "legal.refund.s3.li3": "Refund preference (wallet balance or payment source).",

  "legal.refund.s4.title": "4. Refund Process and Method",
  "legal.refund.s4.body.1": "After the request is received, the issue is reviewed within ",
  "legal.refund.s4.body.strong": "3 business days",
  "legal.refund.s4.body.2":
    " at the latest. Refund amounts deemed eligible are, as a rule, returned to the store balance (wallet) and can be used immediately. Upon your request and where the payment method permits, the refund may also be made to the source from which payment was made; in this case, depending on the bank, the period may extend up to 14 days.",

  "legal.refund.s5.title": "5. Wallet Balance Refund",
  "legal.refund.s5.body":
    "Requests regarding the refund of balance loaded onto the wallet but not spent are evaluated after fraud checks are completed. Promotional balances defined as bonuses are excluded from the scope of refund/cash withdrawal.",

  "legal.refund.s6.title": "6. Subscription Products",
  "legal.refund.s6.body":
    "Subscription codes (e.g. Nitro, Game Pass) cannot be refunded after delivery/activation. Faulty or invalid subscription codes detected before activation are evaluated within the scope of the exception in Article 2.",

  "legal.refund.s7.title": "7. Reseller Orders",
  "legal.refund.s7.body":
    "This policy also applies to reseller orders placed through the API or wholesale channel. In bulk orders, faulty codes are evaluated on an order basis and under the same time conditions.",

  "legal.refund.s8.title": "8. Consumer Rights and Application",
  "legal.refund.s8.body":
    "This policy does not eliminate the consumer's rights arising from Law No. 6502. In cases where no resolution is reached, you may apply to the Consumer Arbitration Committees or Consumer Courts according to the monetary limits.",

  "legal.refund.s9.title": "9. Contact",
  "legal.refund.s9.body.1": "For any questions regarding refund and reimbursement processes, you can reach us at ",
  "legal.refund.s9.body.2": " or through a Support Request.",

  // ── Distance Sales Agreement ──
  "legal.dist.title": "Distance Sales Agreement",
  "legal.dist.updated": "05/31/2026",
  "legal.dist.intro":
    "This Distance Sales Agreement (the “Agreement”) has been established electronically between the Seller, whose information is set out below, and the Buyer, pursuant to Law No. 6502 on the Protection of the Consumer and the Regulation on Distance Contracts. When the Buyer confirms their order, they declare that they have read and accepted all the terms of this Agreement.",

  "legal.dist.s1.title": "1. Parties",
  "legal.dist.s1.seller": "Seller",
  "legal.dist.s1.row.company": "Title",
  "legal.dist.s1.row.address": "Address",
  "legal.dist.s1.row.tax": "Tax Office / No",
  "legal.dist.s1.row.mersis": "MERSIS No",
  "legal.dist.s1.row.etbis": "ETBIS Registration No",
  "legal.dist.s1.row.email": "E-mail",
  "legal.dist.s1.row.phone": "Phone",
  "legal.dist.s1.buyer.strong": "Buyer:",
  "legal.dist.s1.buyer.body":
    " The user who is a member of the Platform and places an order, whose information is recorded in the order record and membership account.",

  "legal.dist.s2.title": "2. Subject of the Agreement",
  "legal.dist.s2.body.1": "The subject of this Agreement is the determination of the parties' rights and obligations regarding the sale and delivery of the digital product (e-pin, game balance, digital code, subscription, license) ordered by the Buyer electronically through ",
  "legal.dist.s2.body.2":
    ", whose qualities and sales price are specified on the Platform.",

  "legal.dist.s3.title": "3. Product Information and Price",
  "legal.dist.s3.body.1":
    "The essential qualities of the product, the sales price (including taxes), and applicable commissions are clearly shown to the Buyer on the Platform at the order stage. The advertised prices are valid until updated; the price of completed orders does not change. In the event of obvious material errors in pricing (e.g. a zero/very low price due to a system error), ",
  "legal.dist.s3.body.2":
    " reserves the right to cancel the order and refund the payment.",

  "legal.dist.s4.title": "4. Order Process",
  "legal.dist.s4.li1": "The Buyer adds the product to the cart and confirms the order details.",
  "legal.dist.s4.li2": "Payment is taken via wallet balance or a secure payment method.",
  "legal.dist.s4.li3": "Once payment is confirmed, the product is delivered instantly and an order record is created.",
  "legal.dist.s4.li4": "The order summary and delivery information are provided on the “My Orders” page and by e-mail.",

  "legal.dist.s5.title": "5. Payment",
  "legal.dist.s5.body.1":
    "Payments are made via store balance (wallet) or the secure payment methods offered on the Platform. The balance loaded onto the wallet is used only for product purchases through ",
  "legal.dist.s5.body.2":
    ". The order is not performed before payment is confirmed. Card details are not stored by ",
  "legal.dist.s5.body.3":
    "; they are processed by the payment institution.",

  "legal.dist.s6.title": "6. Delivery",
  "legal.dist.s6.body":
    "The products subject to sale are digital content and do not involve physical delivery. After payment is confirmed, the product code is displayed instantly on the Buyer's “My Orders” page and sent to the registered e-mail address. Delivery is deemed completed once the code is thus made available to the Buyer's access.",
  "legal.dist.s61.title": "6.1. Manual / Service Delivery",
  "legal.dist.s61.body":
    "For some products (top-up to a player account or social media service), delivery depends on the accuracy of the information provided by the Buyer and may require a short processing time. The Seller is not responsible for orders that cannot be performed due to incorrect information.",

  "legal.dist.s7.title": "7. Right of Withdrawal",
  "legal.dist.s7.body.1":
    "Pursuant to Article 15/1-ğ of the Regulation on Distance Contracts, there is no right of withdrawal in contracts concerning digital content performed instantly in the electronic environment and delivered to the Buyer instantly. The Buyer declares that they accept this matter during the order. For details, see the ",
  "legal.dist.s7.link": "Refund & Right of Withdrawal",
  "legal.dist.s7.body.2": " page.",

  "legal.dist.s8.title": "8. Buyer's Declarations and Undertakings",
  "legal.dist.s8.body":
    "The Buyer accepts that, before purchasing the product, they have read and confirmed its essential qualities, sales price, and payment information; that the information they provided is correct; and that they will use the product for lawful purposes.",

  "legal.dist.s9.title": "9. Default Provisions",
  "legal.dist.s9.body":
    "In cases where payment is made via credit card/bank and is subsequently cancelled/rejected (e.g. an unjustified chargeback), the price of the delivered digital product may be claimed from the Buyer and the account may be suspended.",

  "legal.dist.s10.title": "10. Protection of Personal Data",
  "legal.dist.s10.body.1": "The Buyer's personal data is processed within the scope of the ",
  "legal.dist.s10.link": "Privacy Policy & KVKK Disclosure Text",
  "legal.dist.s10.body.2": ".",

  "legal.dist.s11.title": "11. Force Majeure and General Provisions",
  "legal.dist.s11.body.2":
    " cannot be held directly responsible for disruptions arising from force majeure or third-party platforms; in such cases, it makes reasonable efforts to provide a solution to the Buyer. The parties' system records constitute evidence in disputes arising from this Agreement.",

  "legal.dist.s12.title": "12. Resolution of Disputes",
  "legal.dist.s12.body":
    "In disputes that may arise from this Agreement, the Consumer Arbitration Committees are competent up to the monetary limit announced annually by the Ministry of Trade, and the Consumer Courts are competent for disputes above this limit.",

  "legal.dist.s13.title": "13. Entry into Force",
  "legal.dist.s13.body":
    "This Agreement is deemed established and entered into force upon the Buyer's confirmation of their order electronically.",
};

export const de: Dict = {
  // ── Rückerstattung & Widerrufsrecht ──
  "legal.refund.title": "Rückerstattung & Widerrufsrecht",
  "legal.refund.updated": "31.05.2026",
  "legal.refund.intro.1":
    " verkauften Produkte sind digitale Inhalte (E-Pins, Spielguthaben, digitale Codes, Abonnements, Lizenzen), und die Lieferung erfolgt elektronisch in dem Moment, in dem die Zahlung bestätigt wird. Diese Richtlinie erläutert die Bedingungen in Bezug auf Rückerstattung und Widerrufsrecht und gilt zusammen mit dem ",
  "legal.refund.intro.link": "Fernabsatzvertrag",
  "legal.refund.intro.2": ".",

  "legal.refund.s1.title": "1. Fälle, in denen kein Widerrufsrecht besteht",
  "legal.refund.s1.body":
    "Gemäß Art. 15/1-ğ der Verordnung über Fernabsatzverträge kann das Widerrufsrecht bei immateriellen Gütern, die in der elektronischen Umgebung sofort erbracht und dem Verbraucher sofort geliefert werden (digitale Codes, E-Pins, Guthaben), nicht ausgeübt werden. Nach Ansicht / Lieferung des Codes wird keine Rückerstattung akzeptiert. Der Nutzer bestätigt diesen Sachverhalt ausdrücklich während der Bestellung.",

  "legal.refund.s2.title": "2. Ausnahmefälle, in denen Rückerstattungen akzeptiert werden",
  "legal.refund.s2.lead.1": "In den folgenden Fällen wird ein Rückerstattungs- oder Umtauschantrag geprüft, sofern der Code noch nicht ",
  "legal.refund.s2.lead.strong": "verwendet und angesehen",
  "legal.refund.s2.lead.2": " wurde:",
  "legal.refund.s2.li1": "Der gelieferte Code ist fehlerhaft, ungültig oder wurde bereits verwendet,",
  "legal.refund.s2.li2": "Es wurde ein anderes (falsches) Produkt als das bestellte geliefert,",
  "legal.refund.s2.li3": "Das Produkt wurde aufgrund eines technischen Fehlers überhaupt nicht geliefert,",
  "legal.refund.s2.li4": "Es wurde eine doppelte (mehrfache) Abbuchung vorgenommen,",
  "legal.refund.s2.li5": "Das Produkt erfüllt offensichtlich nicht seine angekündigten wesentlichen Eigenschaften.",
  "legal.refund.s21.title": "2.1. Bewertungskriterium",
  "legal.refund.s21.body":
    "Der Rückerstattungsantrag wird anhand des Nutzungs-/Aktivierungsstatus des Codes und der Aufzeichnungen des betreffenden Herausgebers/Anbieters geprüft. Wird festgestellt, dass der Code auf der Seite des Nutzers verwendet wurde, kann die Rückerstattung abgelehnt werden.",

  "legal.refund.s3.title": "3. Wie wird ein Rückerstattungsantrag erstellt?",
  "legal.refund.s3.lead.1": "Rückerstattungsanträge müssen innerhalb von ",
  "legal.refund.s3.lead.strong": "48 Stunden",
  "legal.refund.s3.lead.2": " ab dem Bestelldatum eingereicht werden, indem eine ",
  "legal.refund.s3.lead.link1": "Support-Anfrage",
  "legal.refund.s3.lead.3": " erstellt wird oder über die Seite ",
  "legal.refund.s3.lead.link2": "Kontakt",
  "legal.refund.s3.lead.4":
    ". Die Angabe der folgenden Informationen in Ihrem Antrag beschleunigt den Vorgang:",
  "legal.refund.s3.li1": "Bestellnummer,",
  "legal.refund.s3.li2": "Eine klare Beschreibung des Problems (Fehlermeldung, Screenshot usw.),",
  "legal.refund.s3.li3": "Rückerstattungspräferenz (Wallet-Guthaben oder Zahlungsquelle).",

  "legal.refund.s4.title": "4. Rückerstattungsprozess und -methode",
  "legal.refund.s4.body.1": "Nach Eingang des Antrags wird das Problem spätestens innerhalb von ",
  "legal.refund.s4.body.strong": "3 Werktagen",
  "legal.refund.s4.body.2":
    " geprüft. Als berechtigt erachtete Rückerstattungsbeträge werden in der Regel auf das Ladenguthaben (Wallet) zurückerstattet und können sofort verwendet werden. Auf Ihren Wunsch und sofern die Zahlungsmethode dies zulässt, kann die Rückerstattung auch an die Quelle erfolgen, von der die Zahlung geleistet wurde; in diesem Fall kann sich der Zeitraum je nach Bank auf bis zu 14 Tage verlängern.",

  "legal.refund.s5.title": "5. Rückerstattung des Wallet-Guthabens",
  "legal.refund.s5.body":
    "Anträge auf Rückerstattung des auf die Wallet geladenen, aber nicht ausgegebenen Guthabens werden nach Abschluss der Betrugsprüfungen geprüft. Als Bonus definierte Aktionsguthaben sind vom Umfang der Rückerstattung/Auszahlung ausgeschlossen.",

  "legal.refund.s6.title": "6. Abonnementprodukte",
  "legal.refund.s6.body":
    "Abonnementcodes (z. B. Nitro, Game Pass) können nach Lieferung/Aktivierung nicht zurückerstattet werden. Vor der Aktivierung festgestellte fehlerhafte oder ungültige Abonnementcodes werden im Rahmen der Ausnahme in Artikel 2 geprüft.",

  "legal.refund.s7.title": "7. Händlerbestellungen",
  "legal.refund.s7.body":
    "Diese Richtlinie gilt auch für Händlerbestellungen, die über die API oder den Großhandelskanal aufgegeben werden. Bei Sammelbestellungen werden fehlerhafte Codes auf Bestellbasis und unter denselben Fristbedingungen geprüft.",

  "legal.refund.s8.title": "8. Verbraucherrechte und Antragstellung",
  "legal.refund.s8.body":
    "Diese Richtlinie hebt die Rechte des Verbrauchers aus dem Gesetz Nr. 6502 nicht auf. In Fällen, in denen keine Lösung erzielt wird, können Sie sich je nach den monetären Grenzen an die Verbraucherschiedsausschüsse oder die Verbrauchergerichte wenden.",

  "legal.refund.s9.title": "9. Kontakt",
  "legal.refund.s9.body.1": "Bei Fragen zu Rückerstattungs- und Erstattungsprozessen erreichen Sie uns unter ",
  "legal.refund.s9.body.2": " oder über eine Support-Anfrage.",

  // ── Fernabsatzvertrag ──
  "legal.dist.title": "Fernabsatzvertrag",
  "legal.dist.updated": "31.05.2026",
  "legal.dist.intro":
    "Dieser Fernabsatzvertrag (der „Vertrag“) wurde gemäß dem Gesetz Nr. 6502 über den Schutz des Verbrauchers und der Verordnung über Fernabsatzverträge zwischen dem nachstehend aufgeführten Verkäufer und dem Käufer elektronisch geschlossen. Mit der Bestätigung seiner Bestellung erklärt der Käufer, dass er alle Bedingungen dieses Vertrags gelesen und akzeptiert hat.",

  "legal.dist.s1.title": "1. Parteien",
  "legal.dist.s1.seller": "Verkäufer",
  "legal.dist.s1.row.company": "Firmenname",
  "legal.dist.s1.row.address": "Adresse",
  "legal.dist.s1.row.tax": "Finanzamt / Nr.",
  "legal.dist.s1.row.mersis": "MERSIS-Nr.",
  "legal.dist.s1.row.etbis": "ETBIS-Registrierungsnr.",
  "legal.dist.s1.row.email": "E-Mail",
  "legal.dist.s1.row.phone": "Telefon",
  "legal.dist.s1.buyer.strong": "Käufer:",
  "legal.dist.s1.buyer.body":
    " Der Nutzer, der Mitglied der Plattform ist und eine Bestellung aufgibt und dessen Daten im Bestelldatensatz und im Mitgliedskonto erfasst sind.",

  "legal.dist.s2.title": "2. Gegenstand des Vertrags",
  "legal.dist.s2.body.1": "Gegenstand dieses Vertrags ist die Festlegung der Rechte und Pflichten der Parteien in Bezug auf den Verkauf und die Lieferung des digitalen Produkts (E-Pin, Spielguthaben, digitaler Code, Abonnement, Lizenz), das der Käufer elektronisch über ",
  "legal.dist.s2.body.2":
    " bestellt hat und dessen Eigenschaften und Verkaufspreis auf der Plattform angegeben sind.",

  "legal.dist.s3.title": "3. Produktinformationen und Preis",
  "legal.dist.s3.body.1":
    "Die wesentlichen Eigenschaften des Produkts, der Verkaufspreis (einschließlich Steuern) und die geltenden Provisionen werden dem Käufer in der Bestellphase auf der Plattform deutlich angezeigt. Die angekündigten Preise gelten bis zur Aktualisierung; der Preis abgeschlossener Bestellungen ändert sich nicht. Im Falle offensichtlicher materieller Fehler bei der Preisgestaltung (z. B. ein Null-/sehr niedriger Preis aufgrund eines Systemfehlers) behält sich ",
  "legal.dist.s3.body.2":
    " das Recht vor, die Bestellung zu stornieren und die Zahlung zu erstatten.",

  "legal.dist.s4.title": "4. Bestellprozess",
  "legal.dist.s4.li1": "Der Käufer legt das Produkt in den Warenkorb und bestätigt die Bestelldaten.",
  "legal.dist.s4.li2": "Die Zahlung erfolgt über das Wallet-Guthaben oder eine sichere Zahlungsmethode.",
  "legal.dist.s4.li3": "Sobald die Zahlung bestätigt ist, wird das Produkt sofort geliefert und ein Bestelldatensatz erstellt.",
  "legal.dist.s4.li4": "Die Bestellübersicht und die Lieferinformationen werden auf der Seite „Meine Bestellungen“ und per E-Mail bereitgestellt.",

  "legal.dist.s5.title": "5. Zahlung",
  "legal.dist.s5.body.1":
    "Zahlungen erfolgen über das Ladenguthaben (Wallet) oder die auf der Plattform angebotenen sicheren Zahlungsmethoden. Das auf die Wallet geladene Guthaben wird nur für Produktkäufe über ",
  "legal.dist.s5.body.2":
    " verwendet. Die Bestellung wird nicht ausgeführt, bevor die Zahlung bestätigt ist. Kartendaten werden nicht von ",
  "legal.dist.s5.body.3":
    " gespeichert; sie werden vom Zahlungsinstitut verarbeitet.",

  "legal.dist.s6.title": "6. Lieferung",
  "legal.dist.s6.body":
    "Die zum Verkauf stehenden Produkte sind digitale Inhalte und beinhalten keine physische Lieferung. Nach Bestätigung der Zahlung wird der Produktcode sofort auf der Seite „Meine Bestellungen“ des Käufers angezeigt und an die registrierte E-Mail-Adresse gesendet. Die Lieferung gilt als abgeschlossen, sobald der Code auf diese Weise dem Zugriff des Käufers zur Verfügung gestellt wird.",
  "legal.dist.s61.title": "6.1. Manuelle / Dienstleistungslieferung",
  "legal.dist.s61.body":
    "Bei einigen Produkten (Aufladung auf ein Spielerkonto oder Social-Media-Dienst) hängt die Lieferung von der Richtigkeit der vom Käufer bereitgestellten Informationen ab und kann eine kurze Bearbeitungszeit erfordern. Der Verkäufer ist nicht für Bestellungen verantwortlich, die aufgrund falscher Informationen nicht ausgeführt werden können.",

  "legal.dist.s7.title": "7. Widerrufsrecht",
  "legal.dist.s7.body.1":
    "Gemäß Art. 15/1-ğ der Verordnung über Fernabsatzverträge besteht bei Verträgen über digitale Inhalte, die in der elektronischen Umgebung sofort erbracht und dem Käufer sofort geliefert werden, kein Widerrufsrecht. Der Käufer erklärt, dass er diesen Sachverhalt während der Bestellung akzeptiert. Einzelheiten finden Sie auf der Seite ",
  "legal.dist.s7.link": "Rückerstattung & Widerrufsrecht",
  "legal.dist.s7.body.2": ".",

  "legal.dist.s8.title": "8. Erklärungen und Zusicherungen des Käufers",
  "legal.dist.s8.body":
    "Der Käufer akzeptiert, dass er vor dem Kauf des Produkts dessen wesentliche Eigenschaften, den Verkaufspreis und die Zahlungsinformationen gelesen und bestätigt hat; dass die von ihm angegebenen Informationen korrekt sind; und dass er das Produkt für rechtmäßige Zwecke verwenden wird.",

  "legal.dist.s9.title": "9. Verzugsbestimmungen",
  "legal.dist.s9.body":
    "In Fällen, in denen die Zahlung per Kreditkarte/Bank erfolgt und anschließend storniert/abgelehnt wird (z. B. ein ungerechtfertigtes Chargeback), kann der Preis des gelieferten digitalen Produkts vom Käufer gefordert und das Konto gesperrt werden.",

  "legal.dist.s10.title": "10. Schutz personenbezogener Daten",
  "legal.dist.s10.body.1": "Die personenbezogenen Daten des Käufers werden im Rahmen der ",
  "legal.dist.s10.link": "Datenschutzrichtlinie & KVKK-Informationstext",
  "legal.dist.s10.body.2": " verarbeitet.",

  "legal.dist.s11.title": "11. Höhere Gewalt und Allgemeine Bestimmungen",
  "legal.dist.s11.body.2":
    " kann nicht direkt für Störungen verantwortlich gemacht werden, die durch höhere Gewalt oder Drittplattformen verursacht werden; in solchen Fällen unternimmt es angemessene Anstrengungen, um dem Käufer eine Lösung zu bieten. Die Systemaufzeichnungen der Parteien stellen ein Beweismittel bei Streitigkeiten aus diesem Vertrag dar.",

  "legal.dist.s12.title": "12. Beilegung von Streitigkeiten",
  "legal.dist.s12.body":
    "Bei Streitigkeiten, die aus diesem Vertrag entstehen können, sind bis zu der vom Handelsministerium jährlich bekannt gegebenen monetären Grenze die Verbraucherschiedsausschüsse und bei Streitigkeiten über dieser Grenze die Verbrauchergerichte zuständig.",

  "legal.dist.s13.title": "13. Inkrafttreten",
  "legal.dist.s13.body":
    "Dieser Vertrag gilt mit der elektronischen Bestätigung der Bestellung durch den Käufer als geschlossen und in Kraft getreten.",
};

export const ar: Dict = {
  // ── الاسترداد وحق الانسحاب ──
  "legal.refund.title": "الاسترداد وحق الانسحاب",
  "legal.refund.updated": "31.05.2026",
  "legal.refund.intro.1":
    " هي محتوى رقمي (شحنات إلكترونية، رصيد ألعاب، أكواد رقمية، اشتراكات، تراخيص)، ويتم التسليم إلكترونياً في اللحظة التي يتم فيها تأكيد الدفع. توضّح هذه السياسة الشروط المتعلقة بالاسترداد وحق الانسحاب، وتُطبَّق مع ",
  "legal.refund.intro.link": "عقد البيع عن بُعد",
  "legal.refund.intro.2": ".",

  "legal.refund.s1.title": "1. الحالات التي لا يوجد فيها حق انسحاب",
  "legal.refund.s1.body":
    "وفقاً للمادة 15/1-غ من لائحة عقود البيع عن بُعد، لا يمكن ممارسة حق الانسحاب في السلع غير المادية التي يتم تنفيذها فوراً في البيئة الإلكترونية وتُسلَّم إلى المستهلك فوراً (الأكواد الرقمية، الشحنات الإلكترونية، الأرصدة). لا يُقبل أي استرداد بعد عرض الكود / تسليمه. يُقرّ المستخدم بهذا الأمر صراحةً أثناء الطلب.",

  "legal.refund.s2.title": "2. الحالات الاستثنائية التي يُقبل فيها الاسترداد",
  "legal.refund.s2.lead.1": "في الحالات التالية، يُقيَّم طلب الاسترداد أو الاستبدال، بشرط ألا يكون الكود قد ",
  "legal.refund.s2.lead.strong": "استُخدم أو عُرض",
  "legal.refund.s2.lead.2": " بعد:",
  "legal.refund.s2.li1": "أن يكون الكود المُسلَّم معيباً أو غير صالح أو مستخدماً من قبل،",
  "legal.refund.s2.li2": "أن يكون قد تم تسليم منتج مختلف (خاطئ) عن المطلوب،",
  "legal.refund.s2.li3": "عدم تسليم المنتج إطلاقاً بسبب خطأ تقني،",
  "legal.refund.s2.li4": "إجراء خصم مزدوج (مكرر)،",
  "legal.refund.s2.li5": "عدم استيفاء المنتج بوضوح لخصائصه الأساسية المُعلَنة.",
  "legal.refund.s21.title": "2.1. معيار التقييم",
  "legal.refund.s21.body":
    "يُفحَص طلب الاسترداد بناءً على حالة استخدام/تفعيل الكود وسجلات الناشر/المزوّد المعني. إذا تبيّن أن الكود قد استُخدم من جانب المستخدم، فقد يُرفَض الاسترداد.",

  "legal.refund.s3.title": "3. كيفية إنشاء طلب استرداد؟",
  "legal.refund.s3.lead.1": "يجب تقديم طلبات الاسترداد خلال ",
  "legal.refund.s3.lead.strong": "48 ساعة",
  "legal.refund.s3.lead.2": " من تاريخ الطلب، عن طريق إنشاء ",
  "legal.refund.s3.lead.link1": "طلب دعم",
  "legal.refund.s3.lead.3": " أو عبر صفحة ",
  "legal.refund.s3.lead.link2": "الاتصال",
  "legal.refund.s3.lead.4":
    ". إن تحديد ما يلي في طلبك يُسرّع العملية:",
  "legal.refund.s3.li1": "رقم الطلب،",
  "legal.refund.s3.li2": "وصف واضح للمشكلة (رسالة الخطأ، لقطة شاشة، إلخ)،",
  "legal.refund.s3.li3": "تفضيل الاسترداد (رصيد المحفظة أو مصدر الدفع).",

  "legal.refund.s4.title": "4. عملية الاسترداد وطريقته",
  "legal.refund.s4.body.1": "بعد استلام الطلب، تُراجَع المشكلة خلال ",
  "legal.refund.s4.body.strong": "3 أيام عمل",
  "legal.refund.s4.body.2":
    " كحدّ أقصى. تُعاد مبالغ الاسترداد المؤهَّلة، كقاعدة، إلى رصيد المتجر (المحفظة) ويمكن استخدامها فوراً. بناءً على طلبك وحيثما تسمح طريقة الدفع، يمكن أيضاً إجراء الاسترداد إلى المصدر الذي تم الدفع منه؛ وفي هذه الحالة قد تمتد المدة حتى 14 يوماً حسب البنك.",

  "legal.refund.s5.title": "5. استرداد رصيد المحفظة",
  "legal.refund.s5.body":
    "تُقيَّم طلبات استرداد الرصيد المُحمَّل إلى المحفظة وغير المُنفَق بعد إتمام فحوصات الاحتيال. تُستثنى أرصدة العروض الترويجية المُعرَّفة كمكافآت من نطاق الاسترداد/السحب النقدي.",

  "legal.refund.s6.title": "6. منتجات الاشتراك",
  "legal.refund.s6.body":
    "لا يمكن استرداد أكواد الاشتراك (مثل Nitro وGame Pass) بعد التسليم/التفعيل. أما أكواد الاشتراك المعيبة أو غير الصالحة المُكتشَفة قبل التفعيل فتُقيَّم ضمن نطاق الاستثناء الوارد في المادة 2.",

  "legal.refund.s7.title": "7. طلبات الموزّعين",
  "legal.refund.s7.body":
    "تنطبق هذه السياسة أيضاً على طلبات الموزّعين المُقدَّمة عبر واجهة برمجة التطبيقات (API) أو قناة الجملة. في الطلبات المجمَّعة، تُقيَّم الأكواد المعيبة على أساس كل طلب وبنفس شروط المدة.",

  "legal.refund.s8.title": "8. حقوق المستهلك والتقدّم بطلب",
  "legal.refund.s8.body":
    "لا تُلغي هذه السياسة حقوق المستهلك الناشئة عن القانون رقم 6502. في الحالات التي لا يتم فيها التوصل إلى حل، يمكنك التقدّم بطلب إلى لجان التحكيم الاستهلاكي أو محاكم المستهلك وفقاً للحدود المالية.",

  "legal.refund.s9.title": "9. الاتصال",
  "legal.refund.s9.body.1": "لأي أسئلة بخصوص عمليات الاسترداد والتعويض، يمكنك التواصل معنا عبر ",
  "legal.refund.s9.body.2": " أو من خلال طلب دعم.",

  // ── عقد البيع عن بُعد ──
  "legal.dist.title": "عقد البيع عن بُعد",
  "legal.dist.updated": "31.05.2026",
  "legal.dist.intro":
    "تم إبرام عقد البيع عن بُعد هذا (“العقد”) إلكترونياً بين البائع الوارد بياناته أدناه والمشتري، وفقاً للقانون رقم 6502 بشأن حماية المستهلك ولائحة عقود البيع عن بُعد. يُقرّ المشتري عند تأكيد طلبه بأنه قد قرأ جميع شروط هذا العقد وقبلها.",

  "legal.dist.s1.title": "1. الأطراف",
  "legal.dist.s1.seller": "البائع",
  "legal.dist.s1.row.company": "الاسم التجاري",
  "legal.dist.s1.row.address": "العنوان",
  "legal.dist.s1.row.tax": "مكتب الضرائب / الرقم",
  "legal.dist.s1.row.mersis": "رقم MERSIS",
  "legal.dist.s1.row.etbis": "رقم تسجيل ETBIS",
  "legal.dist.s1.row.email": "البريد الإلكتروني",
  "legal.dist.s1.row.phone": "الهاتف",
  "legal.dist.s1.buyer.strong": "المشتري:",
  "legal.dist.s1.buyer.body":
    " المستخدم العضو في المنصة الذي يقدّم طلباً، والمُسجَّلة بياناته في سجل الطلب وحساب العضوية.",

  "legal.dist.s2.title": "2. موضوع العقد",
  "legal.dist.s2.body.1": "موضوع هذا العقد هو تحديد حقوق والتزامات الأطراف فيما يتعلق ببيع وتسليم المنتج الرقمي (شحنة إلكترونية، رصيد ألعاب، كود رقمي، اشتراك، ترخيص) الذي طلبه المشتري إلكترونياً عبر ",
  "legal.dist.s2.body.2":
    "، والمحدَّدة خصائصه وسعر بيعه على المنصة.",

  "legal.dist.s3.title": "3. معلومات المنتج والسعر",
  "legal.dist.s3.body.1":
    "تُعرَض الخصائص الأساسية للمنتج وسعر البيع (شامل الضرائب) والعمولات السارية بوضوح على المشتري في مرحلة الطلب على المنصة. الأسعار المُعلَنة سارية حتى تحديثها؛ ولا يتغيّر سعر الطلبات المكتملة. وفي حال وجود أخطاء مادية واضحة في التسعير (مثل سعر صفري/منخفض جداً بسبب خطأ في النظام)، تحتفظ ",
  "legal.dist.s3.body.2":
    " بالحق في إلغاء الطلب وردّ المبلغ.",

  "legal.dist.s4.title": "4. عملية الطلب",
  "legal.dist.s4.li1": "يضيف المشتري المنتج إلى السلة ويؤكّد بيانات الطلب.",
  "legal.dist.s4.li2": "يتم تحصيل الدفع عبر رصيد المحفظة أو طريقة دفع آمنة.",
  "legal.dist.s4.li3": "عند تأكيد الدفع، يُسلَّم المنتج فوراً ويُنشَأ سجل للطلب.",
  "legal.dist.s4.li4": "يُقدَّم ملخص الطلب ومعلومات التسليم في صفحة “طلباتي” وعبر البريد الإلكتروني.",

  "legal.dist.s5.title": "5. الدفع",
  "legal.dist.s5.body.1":
    "تتم المدفوعات عبر رصيد المتجر (المحفظة) أو طرق الدفع الآمنة المتاحة على المنصة. يُستخدَم الرصيد المُحمَّل إلى المحفظة فقط لشراء المنتجات عبر ",
  "legal.dist.s5.body.2":
    ". لا يُنفَّذ الطلب قبل تأكيد الدفع. لا تُخزَّن بيانات البطاقة بواسطة ",
  "legal.dist.s5.body.3":
    "؛ بل تُعالَج من قِبل مؤسسة الدفع.",

  "legal.dist.s6.title": "6. التسليم",
  "legal.dist.s6.body":
    "المنتجات محل البيع هي محتوى رقمي ولا تتضمن تسليماً مادياً. بعد تأكيد الدفع، يُعرَض كود المنتج فوراً في صفحة “طلباتي” الخاصة بالمشتري ويُرسَل إلى عنوان البريد الإلكتروني المُسجَّل. يُعتبَر التسليم مكتملاً بمجرد إتاحة الكود على هذا النحو لوصول المشتري.",
  "legal.dist.s61.title": "6.1. التسليم اليدوي / تسليم الخدمة",
  "legal.dist.s61.body":
    "في بعض المنتجات (الشحن إلى حساب لاعب أو خدمة وسائل تواصل اجتماعي)، يعتمد التسليم على صحة المعلومات التي يقدّمها المشتري وقد يتطلّب وقت معالجة قصير. لا يتحمّل البائع المسؤولية عن الطلبات التي يتعذّر تنفيذها بسبب معلومات خاطئة.",

  "legal.dist.s7.title": "7. حق الانسحاب",
  "legal.dist.s7.body.1":
    "وفقاً للمادة 15/1-غ من لائحة عقود البيع عن بُعد، لا يوجد حق انسحاب في العقود المتعلقة بالمحتوى الرقمي الذي يُنفَّذ فوراً في البيئة الإلكترونية ويُسلَّم إلى المشتري فوراً. يُقرّ المشتري بقبوله هذا الأمر أثناء الطلب. للتفاصيل، راجع صفحة ",
  "legal.dist.s7.link": "الاسترداد وحق الانسحاب",
  "legal.dist.s7.body.2": ".",

  "legal.dist.s8.title": "8. إقرارات المشتري وتعهداته",
  "legal.dist.s8.body":
    "يُقرّ المشتري بأنه قبل شراء المنتج قد قرأ وأكّد خصائصه الأساسية وسعر بيعه ومعلومات الدفع؛ وأن المعلومات التي قدّمها صحيحة؛ وأنه سيستخدم المنتج لأغراض مشروعة.",

  "legal.dist.s9.title": "9. أحكام التخلّف عن السداد",
  "legal.dist.s9.body":
    "في الحالات التي يتم فيها الدفع عبر بطاقة الائتمان/البنك ثم يُلغى/يُرفَض لاحقاً (مثل ردّ مبالغ غير مُبرَّر)، يجوز المطالبة بقيمة المنتج الرقمي المُسلَّم من المشتري وقد يُعلَّق الحساب.",

  "legal.dist.s10.title": "10. حماية البيانات الشخصية",
  "legal.dist.s10.body.1": "تُعالَج البيانات الشخصية للمشتري في نطاق ",
  "legal.dist.s10.link": "سياسة الخصوصية ونص إفصاح KVKK",
  "legal.dist.s10.body.2": ".",

  "legal.dist.s11.title": "11. القوة القاهرة والأحكام العامة",
  "legal.dist.s11.body.2":
    " لا يمكن تحميلها المسؤولية المباشرة عن الاضطرابات الناشئة عن القوة القاهرة أو منصات الأطراف الثالثة؛ وفي مثل هذه الحالات، تبذل جهداً معقولاً لتوفير حل للمشتري. تشكّل السجلات النظامية للأطراف دليلاً في المنازعات الناشئة عن هذا العقد.",

  "legal.dist.s12.title": "12. تسوية المنازعات",
  "legal.dist.s12.body":
    "في المنازعات التي قد تنشأ عن هذا العقد، تختصّ لجان التحكيم الاستهلاكي حتى الحد المالي الذي تعلنه وزارة التجارة سنوياً، وتختصّ محاكم المستهلك بالمنازعات التي تتجاوز هذا الحد.",

  "legal.dist.s13.title": "13. النفاذ",
  "legal.dist.s13.body":
    "يُعتبَر هذا العقد مُبرَماً ونافذاً بمجرد تأكيد المشتري لطلبه إلكترونياً.",
};

export const ru: Dict = {
  // ── Возврат и право на отказ ──
  "legal.refund.title": "Возврат и право на отказ",
  "legal.refund.updated": "31.05.2026",
  "legal.refund.intro.1":
    ", являются цифровым контентом (e-pin, игровой баланс, цифровые коды, подписки, лицензии), и доставка осуществляется в электронном виде в момент подтверждения оплаты. Настоящая политика разъясняет условия, касающиеся возврата и права на отказ, и применяется вместе с ",
  "legal.refund.intro.link": "Договором дистанционной продажи",
  "legal.refund.intro.2": ".",

  "legal.refund.s1.title": "1. Случаи, когда право на отказ отсутствует",
  "legal.refund.s1.body":
    "Согласно ст. 15/1-ğ Положения о дистанционных договорах, право на отказ не может быть реализовано в отношении нематериальных товаров, исполняемых мгновенно в электронной среде и доставляемых потребителю мгновенно (цифровые коды, e-pin, балансы). После просмотра / доставки кода возврат не принимается. Пользователь прямо подтверждает данный факт при оформлении заказа.",

  "legal.refund.s2.title": "2. Исключительные случаи, когда возврат принимается",
  "legal.refund.s2.lead.1": "В следующих случаях запрос на возврат или обмен рассматривается при условии, что код ещё не был ",
  "legal.refund.s2.lead.strong": "использован и просмотрен",
  "legal.refund.s2.lead.2": ":",
  "legal.refund.s2.li1": "доставленный код является неисправным, недействительным или ранее использованным,",
  "legal.refund.s2.li2": "был доставлен иной (неправильный) товар, отличный от заказанного,",
  "legal.refund.s2.li3": "товар вообще не был доставлен из-за технической ошибки,",
  "legal.refund.s2.li4": "произведено двойное (повторное) списание,",
  "legal.refund.s2.li5": "товар явно не соответствует заявленным основным характеристикам.",
  "legal.refund.s21.title": "2.1. Критерий оценки",
  "legal.refund.s21.body":
    "Запрос на возврат рассматривается на основе статуса использования/активации кода и записей соответствующего издателя/поставщика. Если установлено, что код был использован на стороне Пользователя, в возврате может быть отказано.",

  "legal.refund.s3.title": "3. Как создать запрос на возврат?",
  "legal.refund.s3.lead.1": "Запросы на возврат должны быть поданы в течение ",
  "legal.refund.s3.lead.strong": "48 часов",
  "legal.refund.s3.lead.2": " с даты заказа путём создания ",
  "legal.refund.s3.lead.link1": "Запроса в поддержку",
  "legal.refund.s3.lead.3": " или через страницу ",
  "legal.refund.s3.lead.link2": "Контакты",
  "legal.refund.s3.lead.4":
    ". Указание следующего в вашем запросе ускоряет процесс:",
  "legal.refund.s3.li1": "номер заказа,",
  "legal.refund.s3.li2": "чёткое описание проблемы (сообщение об ошибке, скриншот и т. д.),",
  "legal.refund.s3.li3": "предпочтительный способ возврата (баланс кошелька или источник оплаты).",

  "legal.refund.s4.title": "4. Процесс и способ возврата",
  "legal.refund.s4.body.1": "После получения запроса проблема рассматривается не позднее чем в течение ",
  "legal.refund.s4.body.strong": "3 рабочих дней",
  "legal.refund.s4.body.2":
    ". Признанные правомерными суммы возврата, как правило, возвращаются на баланс магазина (кошелёк) и могут быть использованы немедленно. По вашему запросу и если это позволяет способ оплаты, возврат может быть произведён также на источник, с которого была произведена оплата; в этом случае в зависимости от банка срок может увеличиться до 14 дней.",

  "legal.refund.s5.title": "5. Возврат баланса кошелька",
  "legal.refund.s5.body":
    "Запросы на возврат загруженного на кошелёк, но не израсходованного баланса рассматриваются после завершения проверок на мошенничество. Промоакционные балансы, определённые как бонусы, исключены из сферы возврата/обналичивания.",

  "legal.refund.s6.title": "6. Подписочные продукты",
  "legal.refund.s6.body":
    "Коды подписок (например, Nitro, Game Pass) не подлежат возврату после доставки/активации. Неисправные или недействительные коды подписок, обнаруженные до активации, рассматриваются в рамках исключения, предусмотренного статьёй 2.",

  "legal.refund.s7.title": "7. Дилерские заказы",
  "legal.refund.s7.body":
    "Настоящая политика также применяется к дилерским заказам, размещённым через API или оптовый канал. В оптовых заказах неисправные коды рассматриваются по каждому заказу и на тех же условиях по срокам.",

  "legal.refund.s8.title": "8. Права потребителя и обращение",
  "legal.refund.s8.body":
    "Настоящая политика не отменяет права потребителя, вытекающие из Закона № 6502. В случаях, когда решение не достигнуто, вы можете обратиться в Комиссии по арбитражу потребителей или в Суды по делам потребителей в зависимости от денежных пределов.",

  "legal.refund.s9.title": "9. Контакты",
  "legal.refund.s9.body.1": "По любым вопросам, касающимся процессов возврата и возмещения, вы можете связаться с нами по адресу ",
  "legal.refund.s9.body.2": " или через Запрос в поддержку.",

  // ── Договор дистанционной продажи ──
  "legal.dist.title": "Договор дистанционной продажи",
  "legal.dist.updated": "31.05.2026",
  "legal.dist.intro":
    "Настоящий Договор дистанционной продажи (“Договор”) заключён в электронной форме между Продавцом, сведения о котором приведены ниже, и Покупателем в соответствии с Законом № 6502 о защите потребителя и Положением о дистанционных договорах. Подтверждая свой заказ, Покупатель заявляет, что прочитал и принял все условия настоящего Договора.",

  "legal.dist.s1.title": "1. Стороны",
  "legal.dist.s1.seller": "Продавец",
  "legal.dist.s1.row.company": "Наименование",
  "legal.dist.s1.row.address": "Адрес",
  "legal.dist.s1.row.tax": "Налоговая инспекция / №",
  "legal.dist.s1.row.mersis": "Номер MERSIS",
  "legal.dist.s1.row.etbis": "Регистрационный номер ETBIS",
  "legal.dist.s1.row.email": "Эл. почта",
  "legal.dist.s1.row.phone": "Телефон",
  "legal.dist.s1.buyer.strong": "Покупатель:",
  "legal.dist.s1.buyer.body":
    " Пользователь, являющийся участником Платформы и оформляющий заказ, сведения о котором содержатся в записи заказа и учётной записи участника.",

  "legal.dist.s2.title": "2. Предмет Договора",
  "legal.dist.s2.body.1": "Предметом настоящего Договора является определение прав и обязанностей сторон в отношении продажи и доставки цифрового продукта (e-pin, игровой баланс, цифровой код, подписка, лицензия), заказанного Покупателем в электронной форме через ",
  "legal.dist.s2.body.2":
    ", характеристики и цена продажи которого указаны на Платформе.",

  "legal.dist.s3.title": "3. Информация о товаре и цена",
  "legal.dist.s3.body.1":
    "Основные характеристики товара, цена продажи (включая налоги) и применимые комиссии чётко отображаются Покупателю на этапе оформления заказа на Платформе. Объявленные цены действительны до их обновления; цена завершённых заказов не изменяется. В случае явных существенных ошибок в ценообразовании (например, нулевая/очень низкая цена из-за системной ошибки) ",
  "legal.dist.s3.body.2":
    " оставляет за собой право отменить заказ и вернуть оплату.",

  "legal.dist.s4.title": "4. Процесс заказа",
  "legal.dist.s4.li1": "Покупатель добавляет товар в корзину и подтверждает данные заказа.",
  "legal.dist.s4.li2": "Оплата производится с баланса кошелька или безопасным способом оплаты.",
  "legal.dist.s4.li3": "После подтверждения оплаты товар доставляется мгновенно и создаётся запись о заказе.",
  "legal.dist.s4.li4": "Сводка заказа и информация о доставке предоставляются на странице “Мои заказы” и по электронной почте.",

  "legal.dist.s5.title": "5. Оплата",
  "legal.dist.s5.body.1":
    "Платежи производятся через баланс магазина (кошелёк) или безопасными способами оплаты, предлагаемыми на Платформе. Загруженный на кошелёк баланс используется только для покупки товаров через ",
  "legal.dist.s5.body.2":
    ". Заказ не исполняется до подтверждения оплаты. Данные карты не хранятся ",
  "legal.dist.s5.body.3":
    "; они обрабатываются платёжной организацией.",

  "legal.dist.s6.title": "6. Доставка",
  "legal.dist.s6.body":
    "Товары, являющиеся предметом продажи, представляют собой цифровой контент и не предполагают физической доставки. После подтверждения оплаты код товара мгновенно отображается на странице “Мои заказы” Покупателя и отправляется на зарегистрированный адрес электронной почты. Доставка считается завершённой, как только код таким образом предоставлен для доступа Покупателя.",
  "legal.dist.s61.title": "6.1. Ручная доставка / доставка услуги",
  "legal.dist.s61.body":
    "Для некоторых товаров (пополнение на счёт игрока или услуга в социальных сетях) доставка зависит от точности предоставленной Покупателем информации и может потребовать небольшого времени на обработку. Продавец не несёт ответственности за заказы, которые не могут быть исполнены из-за неверной информации.",

  "legal.dist.s7.title": "7. Право на отказ",
  "legal.dist.s7.body.1":
    "Согласно ст. 15/1-ğ Положения о дистанционных договорах, в договорах, касающихся цифрового контента, исполняемого мгновенно в электронной среде и доставляемого Покупателю мгновенно, право на отказ отсутствует. Покупатель заявляет, что принимает данный факт при оформлении заказа. Подробнее см. на странице ",
  "legal.dist.s7.link": "Возврат и право на отказ",
  "legal.dist.s7.body.2": ".",

  "legal.dist.s8.title": "8. Заявления и обязательства Покупателя",
  "legal.dist.s8.body":
    "Покупатель принимает, что перед покупкой товара он прочитал и подтвердил его основные характеристики, цену продажи и платёжную информацию; что предоставленная им информация является верной; и что он будет использовать товар в законных целях.",

  "legal.dist.s9.title": "9. Положения о просрочке",
  "legal.dist.s9.body":
    "В случаях, когда оплата производится с помощью кредитной карты/банка и впоследствии отменяется/отклоняется (например, необоснованный chargeback), стоимость доставленного цифрового товара может быть истребована с Покупателя, а учётная запись может быть приостановлена.",

  "legal.dist.s10.title": "10. Защита персональных данных",
  "legal.dist.s10.body.1": "Персональные данные Покупателя обрабатываются в рамках ",
  "legal.dist.s10.link": "Политики конфиденциальности и Текста информирования KVKK",
  "legal.dist.s10.body.2": ".",

  "legal.dist.s11.title": "11. Форс-мажор и общие положения",
  "legal.dist.s11.body.2":
    " не может нести прямую ответственность за сбои, вызванные форс-мажорными обстоятельствами или сторонними платформами; в таких случаях она прилагает разумные усилия для предоставления Покупателю решения. Системные записи сторон являются доказательством в спорах, вытекающих из настоящего Договора.",

  "legal.dist.s12.title": "12. Разрешение споров",
  "legal.dist.s12.body":
    "В спорах, которые могут возникнуть из настоящего Договора, до денежного предела, ежегодно объявляемого Министерством торговли, компетентны Комиссии по арбитражу потребителей, а в спорах, превышающих этот предел, — Суды по делам потребителей.",

  "legal.dist.s13.title": "13. Вступление в силу",
  "legal.dist.s13.body":
    "Настоящий Договор считается заключённым и вступившим в силу с момента подтверждения Покупателем своего заказа в электронной форме.",
};
