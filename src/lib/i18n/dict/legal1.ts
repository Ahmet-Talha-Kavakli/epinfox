import type { Dict } from "./core";

// i18n parça dosyası. dictionaries.ts birleştirir.
// legal.priv.* → Gizlilik & KVKK   |   legal.terms.* → Kullanıcı Sözleşmesi
// NOT: SITE.* dinamik değerleri JSX'te {token} ile birleştirilir, burada çevrilmez.

export const tr: Dict = {
  "legal.updatedLabel": "Son güncelleme",
  // ── Gizlilik Politikası & KVKK ──
  "legal.priv.pageTitle": "Gizlilik Politikası & KVKK Aydınlatma Metni",
  "legal.priv.intro":
    "olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin güvenliğine azami önem veriyoruz. İşbu metin; hangi verilerinizi, hangi amaçla, hangi hukuki sebebe dayanarak işlediğimizi, kimlerle paylaştığımızı ve haklarınızı açıklar.",

  "legal.priv.s1.title": "1. Veri Sorumlusu",
  "legal.priv.s1.row.title": "Unvan",
  "legal.priv.s1.row.address": "Adres",
  "legal.priv.s1.row.email": "E-posta",
  "legal.priv.s1.row.kep": "KEP",

  "legal.priv.s2.title": "2. İşlenen Kişisel Veriler",
  "legal.priv.s2.li1.label": "Kimlik ve iletişim:",
  "legal.priv.s2.li1.text": "Ad-soyad, kullanıcı adı, e-posta adresi, telefon (varsa).",
  "legal.priv.s2.li2.label": "İşlem verileri:",
  "legal.priv.s2.li2.text": "Sipariş ve teslimat geçmişi, cüzdan hareketleri, fatura ve adres bilgileri.",
  "legal.priv.s2.li3.label": "Ödeme verileri:",
  "legal.priv.s2.li3.text1": "Ödeme yöntemi bilgileri (kart bilgileri",
  "legal.priv.s2.li3.text2": "tarafından saklanmaz, ödeme kuruluşunca işlenir).",
  "legal.priv.s2.li4.label": "Teknik veriler:",
  "legal.priv.s2.li4.text": "IP adresi, oturum/cihaz bilgisi, tarayıcı bilgisi ve log kayıtları.",
  "legal.priv.s2.li5.label": "Doğrulama verileri (KYC):",
  "legal.priv.s2.li5.text": "İlgili durumlarda kimlik doğrulama amacıyla istenen belge ve bilgiler.",
  "legal.priv.s2.li6.label": "Pazarlama verileri:",
  "legal.priv.s2.li6.text": "İzin verdiyseniz iletişim tercihleri ve kampanya etkileşimleri.",

  "legal.priv.s3.title": "3. İşleme Amaçları",
  "legal.priv.s3.li1": "Üyelik oluşturma ve hesap yönetimi,",
  "legal.priv.s3.li2": "Sipariş, teslimat ve cüzdan işlemlerinin yürütülmesi,",
  "legal.priv.s3.li3": "Ödeme güvenliği, dolandırıcılık ve kötüye kullanımın önlenmesi,",
  "legal.priv.s3.li4": "Yasal yükümlülüklerin yerine getirilmesi (faturalama, mevzuata uyum),",
  "legal.priv.s3.li5": "Destek taleplerinin yanıtlanması ve hizmet kalitesinin iyileştirilmesi,",
  "legal.priv.s3.li6": "İzin verdiğiniz takdirde kampanya ve bilgilendirmelerin iletilmesi.",

  "legal.priv.s4.title": "4. Hukuki Sebepler",
  "legal.priv.s4.body":
    "Verileriniz; sözleşmenin kurulması/ifası, hukuki yükümlülük, bir hakkın tesisi/korunması, meşru menfaat ve gerektiğinde açık rızanız hukuki sebeplerine dayanılarak işlenir (KVKK md. 5 ve 6).",

  "legal.priv.s5.title": "5. Toplama Yöntemi",
  "legal.priv.s5.body":
    "Kişisel verileriniz; üyelik ve sipariş formları, cüzdan işlemleri, destek kanalları, çerezler ve otomatik sistem kayıtları aracılığıyla, elektronik ortamda toplanır.",

  "legal.priv.s6.title": "6. Verilerin Aktarımı",
  "legal.priv.s6.body":
    "Verileriniz; hizmetin sağlanması için ödeme kuruluşları, e-posta/bildirim sağlayıcıları, barındırma ve altyapı hizmet sağlayıcıları ile yasal olarak yetkili kamu kurumlarıyla, yalnızca gerekli ölçüde ve mevzuata uygun olarak paylaşılır.",
  "legal.priv.s6.sub.title": "6.1. Yurt Dışına Aktarım",
  "legal.priv.s6.sub.body":
    "Bulut altyapısı ve bazı hizmet sağlayıcıların yurt dışında bulunması halinde verileriniz, KVKK md. 9'daki şartlara ve gerekli güvenlik tedbirlerine uygun olarak yurt dışına aktarılabilir.",

  "legal.priv.s7.title": "7. Saklama Süresi",
  "legal.priv.s7.body":
    "Kişisel verileriniz, işleme amacının gerektirdiği süre ve ilgili mevzuatta öngörülen yasal saklama süreleri (ör. ticari ve vergisel kayıtlar) boyunca muhafaza edilir; sürenin sonunda silinir, yok edilir veya anonimleştirilir.",

  "legal.priv.s8.title": "8. Veri Güvenliği",
  "legal.priv.s8.body":
    "Ürün kodları ve hassas veriler şifrelenerek saklanır. Verilere erişim yetkilendirme ile sınırlandırılır; veri aktarımları SSL/TLS ile şifrelenir. Yetkisiz erişimi önlemek için teknik ve idari tedbirler uygulanır; düzenli olarak gözden geçirilir.",

  "legal.priv.s9.title": "9. Çerezler",
  "legal.priv.s9.body":
    "Platform; oturum yönetimi, güvenlik ve deneyim iyileştirme amacıyla çerez kullanır:",
  "legal.priv.s9.li1.label": "Zorunlu çerezler:",
  "legal.priv.s9.li1.text": "Oturum, güvenlik ve sepet gibi temel işlevler için gereklidir.",
  "legal.priv.s9.li2.label": "İşlevsel çerezler:",
  "legal.priv.s9.li2.text": "Dil/para birimi gibi tercihlerinizi hatırlar.",
  "legal.priv.s9.li3.label": "Analitik çerezler:",
  "legal.priv.s9.li3.text": "Kullanım istatistiklerini anonim olarak ölçer (kullanıldığı ölçüde).",
  "legal.priv.s9.note":
    "Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz; ancak zorunlu çerezlerin devre dışı bırakılması bazı özelliklerin çalışmamasına yol açabilir.",

  "legal.priv.s10.title": "10. Haklarınız (KVKK md. 11)",
  "legal.priv.s10.li1": "Kişisel verilerinizin işlenip işlenmediğini öğrenme,",
  "legal.priv.s10.li2": "İşlenmişse buna ilişkin bilgi talep etme,",
  "legal.priv.s10.li3": "İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
  "legal.priv.s10.li4": "Eksik/yanlış işlenmişse düzeltilmesini isteme,",
  "legal.priv.s10.li5": "Silinmesini veya yok edilmesini isteme,",
  "legal.priv.s10.li6": "Düzeltme/silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,",
  "legal.priv.s10.li7": "Otomatik analizle aleyhinize bir sonuç çıkmasına itiraz etme,",
  "legal.priv.s10.li8": "Hukuka aykırı işleme nedeniyle doğan zararın giderilmesini talep etme.",

  "legal.priv.s11.title": "11. Başvuru Yöntemi",
  "legal.priv.s11.body1": "Yukarıdaki haklarınıza ilişkin taleplerinizi",
  "legal.priv.s11.link": "İletişim",
  "legal.priv.s11.body2":
    "sayfası üzerinden veya {email} adresine, kimliğinizi tevsik edici bilgilerle iletebilirsiniz. Talepleriniz, mevzuatta öngörülen süre içinde (kural olarak en geç 30 gün) ücretsiz olarak sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi halinde Kurul'ca belirlenen tarife uygulanabilir.",

  "legal.priv.s12.title": "12. Değişiklikler",
  "legal.priv.s12.body":
    "İşbu Aydınlatma Metni, mevzuat ve hizmetlerdeki değişikliklere göre güncellenebilir. Güncel sürüm bu sayfada yayımlandığı anda yürürlüğe girer.",

  // ── Kullanıcı Sözleşmesi ──
  "legal.terms.pageTitle": "Kullanıcı Sözleşmesi",
  "legal.terms.intro1": "İşbu Kullanıcı Sözleşmesi (“Sözleşme”),",
  "legal.terms.intro2": "platformunu (“Platform”) kullanan üyeler (“Kullanıcı”) ile Platform işletmecisi",
  "legal.terms.intro3":
    "arasındaki hak ve yükümlülükleri düzenler. Platforma üye olarak, hizmetlere erişerek veya bunları kullanarak bu Sözleşme'yi okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan etmiş sayılırsınız. Sözleşme'yi kabul etmiyorsanız Platform'u kullanmamanız gerekir.",

  "legal.terms.s1.title": "1. Tanımlar",
  "legal.terms.s1.li1.label": "Platform:",
  "legal.terms.s1.li1.text": "web sitesi, mobil arayüzleri ve uygulamaları.",
  "legal.terms.s1.li2.label": "Dijital Ürün:",
  "legal.terms.s1.li2.text": "Oyun e-pini, platform bakiyesi, dijital kod, abonelik, lisans ve benzeri gayri maddi mallar.",
  "legal.terms.s1.li3.label": "Cüzdan:",
  "legal.terms.s1.li3.text": "Kullanıcının Platform içinde bakiye tuttuğu ve ödeme yaptığı sanal hesap.",
  "legal.terms.s1.li4.label": "Kod:",
  "legal.terms.s1.li4.text": "Satın alınan dijital ürünün tek kullanımlık aktivasyon bilgisi.",
  "legal.terms.s1.li5.label": "Bayi:",
  "legal.terms.s1.li5.text": "Onaylı toptan satış hesabına ve gerektiğinde API erişimine sahip Kullanıcı.",
  "legal.terms.s1.li6.label": "İçerik:",
  "legal.terms.s1.li6.text": "Platform'da yer alan tüm metin, görsel, yazılım, marka ve veriler.",

  "legal.terms.s2.title": "2. Üyelik Koşulları",
  "legal.terms.s2.body":
    "Üyelik için 18 yaşını doldurmuş olmak veya yasal temsilcinizin onayını almış olmak gerekir. Üyelik sırasında verdiğiniz bilgilerin doğru, güncel ve eksiksiz olması zorunludur. Hesap güvenliğinden, şifrenizin gizliliğinden ve hesabınızla yapılan tüm işlemlerden Kullanıcı sorumludur.",
  "legal.terms.s2.sub1.title": "2.1. Hesap Güvenliği",
  "legal.terms.s2.sub1.body1": "Şifrenizi üçüncü kişilerle paylaşmamanız ve hesabınıza yetkisiz erişim şüphesinde derhal",
  "legal.terms.s2.sub1.body2": "a bildirmeniz gerekir.",
  "legal.terms.s2.sub1.body3":
    "ek güvenlik amacıyla iki adımlı doğrulama ve izinli IP gibi tedbirler sunar; bu tedbirlerin kullanılması Kullanıcı'nın sorumluluğundadır.",
  "legal.terms.s2.sub2.title": "2.2. Tek Hesap İlkesi",
  "legal.terms.s2.sub2.body":
    "Kural olarak her gerçek kişi tek hesap açabilir. Promosyon istismarı veya yaptırımlardan kaçınma amacıyla çoklu hesap açılması yasaktır.",

  "legal.terms.s3.title": "3. Hizmetlerin Kullanımı",
  "legal.terms.s3.li1.text1": "Dijital ürünler ve kodlar tek kullanımlıktır; teslim sonrası iade koşulları",
  "legal.terms.s3.li1.link": "İade & Cayma Hakkı",
  "legal.terms.s3.li1.text2": "politikasına tabidir.",
  "legal.terms.s3.li2": "Platform yalnızca yasal amaçlarla kullanılabilir.",
  "legal.terms.s3.li3": "Kodların yeniden satışı (bayilik kapsamı dışında), otomasyon/bot kullanımı, hile veya sistem açıklarının istismarı yasaktır.",
  "legal.terms.s3.li4": "Sahte işlem, dolandırıcılık, chargeback istismarı, kara para aklama veya kötüye kullanım hesabın askıya alınmasına ve yasal işleme yol açar.",
  "legal.terms.s3.li5": "Platform üzerinden başkalarını rahatsız edici, hakaret içeren veya yanıltıcı içerik paylaşılamaz.",

  "legal.terms.s4.title": "4. Cüzdan ve Bakiye",
  "legal.terms.s4.body1": "Cüzdana yüklenen bakiye yalnızca",
  "legal.terms.s4.body2":
    "üzerinden dijital ürün alımında kullanılır; nakde çevrilemez ve üçüncü kişilere devredilemez. Bakiye yüklemeleri ve harcamaları işlem geçmişinde kayıt altına alınır. Şüpheli işlem tespit edilmesi halinde",
  "legal.terms.s4.body3": "ilgili bakiyeyi geçici olarak bloke etme hakkını saklı tutar.",
  "legal.terms.s4.sub1.title": "4.1. Bonus ve Promosyon Bakiyesi",
  "legal.terms.s4.sub1.body1":
    "Kampanya kapsamında tanımlanan bonus bakiyeler promosyon niteliğindedir; nakde çevrilemez, iade kapsamı dışındadır ve kampanya koşullarına tabidir.",
  "legal.terms.s4.sub1.body2": "promosyon istismarı halinde bonusları iptal edebilir.",

  "legal.terms.s5.title": "5. Ücretlendirme ve Ödeme",
  "legal.terms.s5.body1":
    "Ürün fiyatları ve uygulanan komisyonlar Platform'da satış anında belirtildiği şekildedir. Fiyatlar haber verilmeksizin güncellenebilir; ancak tamamlanmış siparişlerin fiyatı değişmez. Tüm ödemeler güvenli ödeme altyapıları üzerinden alınır ve kart bilgileri",
  "legal.terms.s5.body2": "tarafından saklanmaz.",

  "legal.terms.s6.title": "6. Kimlik Doğrulama (KYC)",
  "legal.terms.s6.body1": "Dolandırıcılığın önlenmesi, yasal yükümlülükler veya yüksek tutarlı işlemler kapsamında",
  "legal.terms.s6.body2":
    "Kullanıcı'dan kimlik doğrulama bilgisi/belgesi talep edebilir. Doğrulamanın tamamlanmaması halinde ilgili işlemler veya hesap özellikleri kısıtlanabilir. Doğrulama verileri",
  "legal.terms.s6.link": "Gizlilik Politikası",
  "legal.terms.s6.body3": "kapsamında işlenir.",

  "legal.terms.s7.title": "7. Bayilik ve API Kullanımı",
  "legal.terms.s7.body1":
    "Onaylı bayiler, toptan fiyatlardan yararlanabilir ve sunulduğu takdirde API erişimi kullanabilir. API anahtarının gizliliğinden ve anahtarla yapılan tüm işlemlerden bayi sorumludur.",
  "legal.terms.s7.body2": "kötüye kullanım halinde bayilik ve API erişimini askıya alma hakkını saklı tutar.",

  "legal.terms.s8.title": "8. Fikri Mülkiyet",
  "legal.terms.s8.body1": "Platform üzerindeki marka, logo, tasarım, yazılım ve içerikler",
  "legal.terms.s8.body2":
    "ya veya lisans verenlerine aittir. İzinsiz kopyalanamaz, çoğaltılamaz, türev çalışma oluşturulamaz veya ticari amaçla kullanılamaz. Üçüncü taraf marka ve ürün adları yalnızca tanımlama amacıyla kullanılır.",

  "legal.terms.s9.title": "9. Sorumluluğun Sınırlandırılması",
  "legal.terms.s9.body1":
    "üçüncü taraf platformlardan (oyun yayıncıları, ödeme sağlayıcılar vb.) kaynaklanan kesinti, gecikme veya kod geçersizliklerinden doğrudan sorumlu tutulamaz; ancak bu tür durumlarda Kullanıcı'ya çözüm sağlamak için makul çabayı gösterir. Hizmetler “olduğu gibi” sunulur; dolaylı veya beklenmeyen zararlardan",
  "legal.terms.s9.body2": "sorumlu değildir.",

  "legal.terms.s10.title": "10. Mücbir Sebepler",
  "legal.terms.s10.body":
    "Doğal afet, salgın, siber saldırı, altyapı/internet kesintisi, kamu otoritesi kararları ve tarafların kontrolü dışındaki benzeri haller mücbir sebep sayılır. Mücbir sebep süresince yükümlülüklerin ifası askıya alınır.",

  "legal.terms.s11.title": "11. Hesabın Askıya Alınması ve Fesih",
  "legal.terms.s11.body1": "Bu Sözleşme'ye aykırılık halinde",
  "legal.terms.s11.body2":
    "Kullanıcı'nın hesabını askıya alma veya kapatma hakkına sahiptir. Kullanıcı da dilediği zaman hesabını kapatma talebinde bulunabilir. Hesabın kapatılması, doğmuş yasal yükümlülükleri ve devam eden işlemleri ortadan kaldırmaz.",

  "legal.terms.s12.title": "12. Sözleşmenin Devri ve Bölünebilirlik",
  "legal.terms.s12.body1": "Kullanıcı, bu Sözleşme'den doğan hak ve yükümlülüklerini",
  "legal.terms.s12.body2":
    "ın yazılı onayı olmadan devredemez. Sözleşme'nin herhangi bir hükmünün geçersiz sayılması, diğer hükümlerin geçerliliğini etkilemez.",

  "legal.terms.s13.title": "13. Bildirimler",
  "legal.terms.s13.body1":
    "Kullanıcı'ya bildirimlerini Platform içi bildirimler, kayıtlı e-posta adresi veya Platform üzerinde yayımlama yoluyla yapar. Kullanıcı, iletişim bilgilerini güncel tutmakla yükümlüdür.",

  "legal.terms.s14.title": "14. Sözleşme Değişiklikleri",
  "legal.terms.s14.body1":
    "bu Sözleşme'yi güncelleme hakkını saklı tutar. Güncel sürüm bu sayfada yayımlandığı anda yürürlüğe girer. Önemli değişikliklerde Kullanıcı uygun yöntemlerle bilgilendirilir.",

  "legal.terms.s15.title": "15. Uygulanacak Hukuk ve Yetki",
  "legal.terms.s15.body":
    "İşbu Sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda, Ticaret Bakanlığınca ilan edilen parasal sınırlara göre Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.",

  "legal.terms.s16.title": "16. İletişim",
  "legal.terms.s16.body1": "Sözleşme'ye ilişkin sorularınız için",
  "legal.terms.s16.link": "İletişim",
  "legal.terms.s16.body2": "sayfasından veya {email} adresinden bize ulaşabilirsiniz.",
};

export const en: Dict = {
  "legal.updatedLabel": "Last updated",
  // ── Privacy Policy & KVKK ──
  "legal.priv.pageTitle": "Privacy Policy & KVKK Disclosure Statement",
  "legal.priv.intro":
    "as the data controller under Law No. 6698 on the Protection of Personal Data (the “KVKK”), attaches the utmost importance to the security of your personal data. This statement explains which of your data we process, for what purpose, on which legal basis, with whom we share it, and what your rights are.",

  "legal.priv.s1.title": "1. Data Controller",
  "legal.priv.s1.row.title": "Trade Name",
  "legal.priv.s1.row.address": "Address",
  "legal.priv.s1.row.email": "E-mail",
  "legal.priv.s1.row.kep": "Registered E-mail (KEP)",

  "legal.priv.s2.title": "2. Personal Data Processed",
  "legal.priv.s2.li1.label": "Identity and contact:",
  "legal.priv.s2.li1.text": "Full name, username, e-mail address, phone (if any).",
  "legal.priv.s2.li2.label": "Transaction data:",
  "legal.priv.s2.li2.text": "Order and delivery history, wallet movements, invoice and address information.",
  "legal.priv.s2.li3.label": "Payment data:",
  "legal.priv.s2.li3.text1": "Payment method information (card details are not stored by",
  "legal.priv.s2.li3.text2": "and are processed by the payment institution).",
  "legal.priv.s2.li4.label": "Technical data:",
  "legal.priv.s2.li4.text": "IP address, session/device information, browser information and log records.",
  "legal.priv.s2.li5.label": "Verification data (KYC):",
  "legal.priv.s2.li5.text": "Documents and information requested for identity verification where applicable.",
  "legal.priv.s2.li6.label": "Marketing data:",
  "legal.priv.s2.li6.text": "Communication preferences and campaign interactions, if you have consented.",

  "legal.priv.s3.title": "3. Purposes of Processing",
  "legal.priv.s3.li1": "Creating membership and managing accounts,",
  "legal.priv.s3.li2": "Carrying out order, delivery and wallet transactions,",
  "legal.priv.s3.li3": "Ensuring payment security and preventing fraud and abuse,",
  "legal.priv.s3.li4": "Fulfilling legal obligations (invoicing, regulatory compliance),",
  "legal.priv.s3.li5": "Responding to support requests and improving service quality,",
  "legal.priv.s3.li6": "Sending campaigns and notifications where you have consented.",

  "legal.priv.s4.title": "4. Legal Grounds",
  "legal.priv.s4.body":
    "Your data is processed on the legal grounds of the establishment/performance of a contract, legal obligation, the establishment/protection of a right, legitimate interest and, where necessary, your explicit consent (Articles 5 and 6 of the KVKK).",

  "legal.priv.s5.title": "5. Method of Collection",
  "legal.priv.s5.body":
    "Your personal data is collected electronically through membership and order forms, wallet transactions, support channels, cookies and automated system records.",

  "legal.priv.s6.title": "6. Transfer of Data",
  "legal.priv.s6.body":
    "Your data is shared, only to the extent necessary and in compliance with the legislation, with payment institutions, e-mail/notification providers, hosting and infrastructure service providers required to deliver the service, as well as with legally authorized public authorities.",
  "legal.priv.s6.sub.title": "6.1. Transfer Abroad",
  "legal.priv.s6.sub.body":
    "Where the cloud infrastructure and certain service providers are located abroad, your data may be transferred abroad in accordance with the conditions set out in Article 9 of the KVKK and the requisite security measures.",

  "legal.priv.s7.title": "7. Retention Period",
  "legal.priv.s7.body":
    "Your personal data is retained for as long as the purpose of processing requires and throughout the legal retention periods stipulated in the relevant legislation (e.g. commercial and tax records); at the end of that period it is deleted, destroyed or anonymized.",

  "legal.priv.s8.title": "8. Data Security",
  "legal.priv.s8.body":
    "Product codes and sensitive data are stored encrypted. Access to data is restricted through authorization; data transfers are encrypted with SSL/TLS. Technical and administrative measures are applied to prevent unauthorized access and are reviewed regularly.",

  "legal.priv.s9.title": "9. Cookies",
  "legal.priv.s9.body":
    "The Platform uses cookies for session management, security and to improve the experience:",
  "legal.priv.s9.li1.label": "Strictly necessary cookies:",
  "legal.priv.s9.li1.text": "Required for core functions such as session, security and cart.",
  "legal.priv.s9.li2.label": "Functional cookies:",
  "legal.priv.s9.li2.text": "Remember your preferences such as language/currency.",
  "legal.priv.s9.li3.label": "Analytical cookies:",
  "legal.priv.s9.li3.text": "Measure usage statistics anonymously (to the extent used).",
  "legal.priv.s9.note":
    "You can manage your cookie preferences from your browser settings; however, disabling strictly necessary cookies may cause some features not to work.",

  "legal.priv.s10.title": "10. Your Rights (Article 11 of the KVKK)",
  "legal.priv.s10.li1": "To learn whether your personal data is being processed,",
  "legal.priv.s10.li2": "To request information if it has been processed,",
  "legal.priv.s10.li3": "To learn the purpose of processing and whether it is used in accordance with that purpose,",
  "legal.priv.s10.li4": "To request correction if it has been processed incompletely/incorrectly,",
  "legal.priv.s10.li5": "To request its deletion or destruction,",
  "legal.priv.s10.li6": "To request that correction/deletion be notified to third parties to whom the data was transferred,",
  "legal.priv.s10.li7": "To object to a result against you arising from automated analysis,",
  "legal.priv.s10.li8": "To claim compensation for damage arising from unlawful processing.",

  "legal.priv.s11.title": "11. Application Method",
  "legal.priv.s11.body1": "You can submit requests regarding the above rights via the",
  "legal.priv.s11.link": "Contact",
  "legal.priv.s11.body2":
    "page or to {email}, together with information verifying your identity. Your requests are concluded free of charge within the period stipulated in the legislation (as a rule, no later than 30 days); where the process additionally entails a cost, the tariff determined by the Board may be applied.",

  "legal.priv.s12.title": "12. Changes",
  "legal.priv.s12.body":
    "This Disclosure Statement may be updated in line with changes in legislation and services. The current version takes effect the moment it is published on this page.",

  // ── User Agreement ──
  "legal.terms.pageTitle": "User Agreement",
  "legal.terms.intro1": "This User Agreement (the “Agreement”) governs the rights and obligations between the members (“User”) who use the",
  "legal.terms.intro2": "platform (the “Platform”) and the Platform operator",
  "legal.terms.intro3":
    "By becoming a member of the Platform and by accessing or using the services, you are deemed to have declared that you have read, understood and accepted this Agreement. If you do not accept the Agreement, you must not use the Platform.",

  "legal.terms.s1.title": "1. Definitions",
  "legal.terms.s1.li1.label": "Platform:",
  "legal.terms.s1.li1.text": "website, mobile interfaces and applications.",
  "legal.terms.s1.li2.label": "Digital Product:",
  "legal.terms.s1.li2.text": "Game e-pins, platform balance, digital codes, subscriptions, licenses and similar intangible goods.",
  "legal.terms.s1.li3.label": "Wallet:",
  "legal.terms.s1.li3.text": "The virtual account in which the User holds a balance and makes payments within the Platform.",
  "legal.terms.s1.li4.label": "Code:",
  "legal.terms.s1.li4.text": "The single-use activation information of the purchased digital product.",
  "legal.terms.s1.li5.label": "Reseller:",
  "legal.terms.s1.li5.text": "A User with an approved wholesale account and, where applicable, API access.",
  "legal.terms.s1.li6.label": "Content:",
  "legal.terms.s1.li6.text": "All text, visuals, software, trademarks and data on the Platform.",

  "legal.terms.s2.title": "2. Membership Conditions",
  "legal.terms.s2.body":
    "To become a member you must be at least 18 years old or have obtained the consent of your legal representative. The information you provide during membership must be accurate, current and complete. The User is responsible for account security, the confidentiality of their password and all transactions carried out with their account.",
  "legal.terms.s2.sub1.title": "2.1. Account Security",
  "legal.terms.s2.sub1.body1": "You must not share your password with third parties and must immediately notify",
  "legal.terms.s2.sub1.body2": "if you suspect unauthorized access to your account.",
  "legal.terms.s2.sub1.body3":
    "offers measures such as two-step verification and allowed IPs for additional security; the use of these measures is the User's responsibility.",
  "legal.terms.s2.sub2.title": "2.2. Single Account Principle",
  "legal.terms.s2.sub2.body":
    "As a rule, each natural person may open a single account. Opening multiple accounts to abuse promotions or evade sanctions is prohibited.",

  "legal.terms.s3.title": "3. Use of the Services",
  "legal.terms.s3.li1.text1": "Digital products and codes are single-use; post-delivery refund conditions are subject to the",
  "legal.terms.s3.li1.link": "Refund & Right of Withdrawal",
  "legal.terms.s3.li1.text2": "policy.",
  "legal.terms.s3.li2": "The Platform may be used only for lawful purposes.",
  "legal.terms.s3.li3": "Reselling codes (outside the scope of reseller status), using automation/bots, cheating or exploiting system vulnerabilities is prohibited.",
  "legal.terms.s3.li4": "Fake transactions, fraud, chargeback abuse, money laundering or misuse will lead to suspension of the account and legal action.",
  "legal.terms.s3.li5": "Content that harasses, insults or misleads others may not be shared through the Platform.",

  "legal.terms.s4.title": "4. Wallet and Balance",
  "legal.terms.s4.body1": "The balance loaded into the wallet may only be used to purchase digital products through",
  "legal.terms.s4.body2":
    "it cannot be converted into cash and cannot be transferred to third parties. Balance top-ups and expenditures are recorded in the transaction history. In the event that a suspicious transaction is detected,",
  "legal.terms.s4.body3": "reserves the right to temporarily block the relevant balance.",
  "legal.terms.s4.sub1.title": "4.1. Bonus and Promotional Balance",
  "legal.terms.s4.sub1.body1":
    "Bonus balances granted within campaigns are promotional in nature; they cannot be converted into cash, are outside the scope of refunds and are subject to the campaign conditions.",
  "legal.terms.s4.sub1.body2": "may cancel bonuses in the event of promotion abuse.",

  "legal.terms.s5.title": "5. Pricing and Payment",
  "legal.terms.s5.body1":
    "Product prices and applicable commissions are as stated on the Platform at the time of sale. Prices may be updated without notice; however, the price of completed orders does not change. All payments are collected through secure payment infrastructures and card details are not stored by",
  "legal.terms.s5.body2": ".",

  "legal.terms.s6.title": "6. Identity Verification (KYC)",
  "legal.terms.s6.body1": "For the prevention of fraud, legal obligations or high-value transactions,",
  "legal.terms.s6.body2":
    "may request identity verification information/documents from the User. If verification is not completed, the relevant transactions or account features may be restricted. Verification data is processed within the scope of the",
  "legal.terms.s6.link": "Privacy Policy",
  "legal.terms.s6.body3": ".",

  "legal.terms.s7.title": "7. Reseller and API Use",
  "legal.terms.s7.body1":
    "Approved resellers may benefit from wholesale prices and, where offered, use API access. The reseller is responsible for the confidentiality of the API key and all transactions carried out with the key.",
  "legal.terms.s7.body2": "reserves the right to suspend reseller status and API access in the event of misuse.",

  "legal.terms.s8.title": "8. Intellectual Property",
  "legal.terms.s8.body1": "The trademarks, logos, designs, software and content on the Platform belong to",
  "legal.terms.s8.body2":
    "or its licensors. They may not be copied, reproduced, made into derivative works or used for commercial purposes without permission. Third-party trademark and product names are used solely for identification purposes.",

  "legal.terms.s9.title": "9. Limitation of Liability",
  "legal.terms.s9.body1":
    "cannot be held directly liable for interruptions, delays or code invalidities arising from third-party platforms (game publishers, payment providers, etc.); however, in such cases it makes reasonable efforts to provide the User with a solution. The services are provided “as is”;",
  "legal.terms.s9.body2": "is not liable for indirect or unforeseen damages.",

  "legal.terms.s10.title": "10. Force Majeure",
  "legal.terms.s10.body":
    "Natural disasters, epidemics, cyber-attacks, infrastructure/internet outages, decisions of public authorities and similar circumstances beyond the parties' control are deemed force majeure. The performance of obligations is suspended for the duration of the force majeure.",

  "legal.terms.s11.title": "11. Suspension and Termination of the Account",
  "legal.terms.s11.body1": "In the event of a breach of this Agreement,",
  "legal.terms.s11.body2":
    "has the right to suspend or close the User's account. The User may also request the closure of their account at any time. Closure of the account does not eliminate accrued legal obligations and ongoing transactions.",

  "legal.terms.s12.title": "12. Assignment and Severability of the Agreement",
  "legal.terms.s12.body1": "The User may not assign the rights and obligations arising from this Agreement without the written consent of",
  "legal.terms.s12.body2":
    "The invalidity of any provision of the Agreement does not affect the validity of the other provisions.",

  "legal.terms.s13.title": "13. Notices",
  "legal.terms.s13.body1":
    "makes its notices to the User through in-Platform notifications, the registered e-mail address or publication on the Platform. The User is obliged to keep their contact information up to date.",

  "legal.terms.s14.title": "14. Amendments to the Agreement",
  "legal.terms.s14.body1":
    "reserves the right to update this Agreement. The current version takes effect the moment it is published on this page. In the case of significant changes, the User is informed by appropriate means.",

  "legal.terms.s15.title": "15. Governing Law and Jurisdiction",
  "legal.terms.s15.body":
    "This Agreement is governed by the laws of the Republic of Türkiye. In disputes, the Consumer Arbitration Committees and Consumer Courts have jurisdiction in accordance with the monetary limits announced by the Ministry of Trade.",

  "legal.terms.s16.title": "16. Contact",
  "legal.terms.s16.body1": "For your questions regarding the Agreement, you can reach us via the",
  "legal.terms.s16.link": "Contact",
  "legal.terms.s16.body2": "page or at {email}.",
};

export const de: Dict = {
  "legal.updatedLabel": "Zuletzt aktualisiert",
  // ── Datenschutzerklärung & KVKK ──
  "legal.priv.pageTitle": "Datenschutzerklärung & KVKK-Informationstext",
  "legal.priv.intro":
    "misst als Verantwortlicher im Sinne des Gesetzes Nr. 6698 zum Schutz personenbezogener Daten (das „KVKK“) der Sicherheit Ihrer personenbezogenen Daten höchste Bedeutung bei. Dieser Text erläutert, welche Ihrer Daten wir zu welchem Zweck und auf welcher Rechtsgrundlage verarbeiten, an wen wir sie weitergeben und welche Rechte Sie haben.",

  "legal.priv.s1.title": "1. Verantwortlicher",
  "legal.priv.s1.row.title": "Firmenname",
  "legal.priv.s1.row.address": "Anschrift",
  "legal.priv.s1.row.email": "E-Mail",
  "legal.priv.s1.row.kep": "Registrierte E-Mail (KEP)",

  "legal.priv.s2.title": "2. Verarbeitete personenbezogene Daten",
  "legal.priv.s2.li1.label": "Identität und Kontakt:",
  "legal.priv.s2.li1.text": "Vor- und Nachname, Benutzername, E-Mail-Adresse, Telefon (falls vorhanden).",
  "legal.priv.s2.li2.label": "Transaktionsdaten:",
  "legal.priv.s2.li2.text": "Bestell- und Lieferhistorie, Wallet-Bewegungen, Rechnungs- und Adressdaten.",
  "legal.priv.s2.li3.label": "Zahlungsdaten:",
  "legal.priv.s2.li3.text1": "Informationen zur Zahlungsmethode (Kartendaten werden von",
  "legal.priv.s2.li3.text2": "nicht gespeichert und vom Zahlungsdienstleister verarbeitet).",
  "legal.priv.s2.li4.label": "Technische Daten:",
  "legal.priv.s2.li4.text": "IP-Adresse, Sitzungs-/Geräteinformationen, Browserinformationen und Protokolldaten.",
  "legal.priv.s2.li5.label": "Verifizierungsdaten (KYC):",
  "legal.priv.s2.li5.text": "In den betreffenden Fällen zur Identitätsprüfung angeforderte Unterlagen und Informationen.",
  "legal.priv.s2.li6.label": "Marketingdaten:",
  "legal.priv.s2.li6.text": "Kommunikationspräferenzen und Kampagneninteraktionen, sofern Sie eingewilligt haben.",

  "legal.priv.s3.title": "3. Verarbeitungszwecke",
  "legal.priv.s3.li1": "Erstellung der Mitgliedschaft und Kontoverwaltung,",
  "legal.priv.s3.li2": "Durchführung von Bestell-, Liefer- und Wallet-Vorgängen,",
  "legal.priv.s3.li3": "Zahlungssicherheit sowie Verhinderung von Betrug und Missbrauch,",
  "legal.priv.s3.li4": "Erfüllung rechtlicher Verpflichtungen (Rechnungsstellung, regulatorische Compliance),",
  "legal.priv.s3.li5": "Beantwortung von Supportanfragen und Verbesserung der Servicequalität,",
  "legal.priv.s3.li6": "Versand von Kampagnen und Mitteilungen, sofern Sie eingewilligt haben.",

  "legal.priv.s4.title": "4. Rechtsgrundlagen",
  "legal.priv.s4.body":
    "Ihre Daten werden auf den Rechtsgrundlagen der Begründung/Erfüllung eines Vertrags, einer rechtlichen Verpflichtung, der Begründung/Wahrung eines Rechts, des berechtigten Interesses und erforderlichenfalls Ihrer ausdrücklichen Einwilligung verarbeitet (Art. 5 und 6 KVKK).",

  "legal.priv.s5.title": "5. Erhebungsmethode",
  "legal.priv.s5.body":
    "Ihre personenbezogenen Daten werden elektronisch über Mitgliedschafts- und Bestellformulare, Wallet-Vorgänge, Supportkanäle, Cookies und automatische Systemaufzeichnungen erhoben.",

  "legal.priv.s6.title": "6. Übermittlung der Daten",
  "legal.priv.s6.body":
    "Ihre Daten werden nur im erforderlichen Umfang und in Übereinstimmung mit den Rechtsvorschriften mit Zahlungsdienstleistern, E-Mail-/Benachrichtigungsanbietern, Hosting- und Infrastrukturdienstleistern, die für die Erbringung der Leistung erforderlich sind, sowie mit gesetzlich befugten Behörden geteilt.",
  "legal.priv.s6.sub.title": "6.1. Übermittlung ins Ausland",
  "legal.priv.s6.sub.body":
    "Sofern sich die Cloud-Infrastruktur und einige Dienstleister im Ausland befinden, können Ihre Daten gemäß den in Art. 9 KVKK festgelegten Voraussetzungen und den erforderlichen Sicherheitsmaßnahmen ins Ausland übermittelt werden.",

  "legal.priv.s7.title": "7. Aufbewahrungsdauer",
  "legal.priv.s7.body":
    "Ihre personenbezogenen Daten werden für die vom Verarbeitungszweck erforderliche Dauer sowie während der in den einschlägigen Rechtsvorschriften vorgesehenen gesetzlichen Aufbewahrungsfristen (z. B. handels- und steuerrechtliche Aufzeichnungen) aufbewahrt; nach Ablauf der Frist werden sie gelöscht, vernichtet oder anonymisiert.",

  "legal.priv.s8.title": "8. Datensicherheit",
  "legal.priv.s8.body":
    "Produktcodes und sensible Daten werden verschlüsselt gespeichert. Der Zugriff auf Daten wird durch Berechtigungen eingeschränkt; Datenübertragungen werden mit SSL/TLS verschlüsselt. Zur Verhinderung unbefugten Zugriffs werden technische und organisatorische Maßnahmen umgesetzt und regelmäßig überprüft.",

  "legal.priv.s9.title": "9. Cookies",
  "legal.priv.s9.body":
    "Die Plattform verwendet Cookies zur Sitzungsverwaltung, zur Sicherheit und zur Verbesserung des Erlebnisses:",
  "legal.priv.s9.li1.label": "Notwendige Cookies:",
  "legal.priv.s9.li1.text": "Erforderlich für Kernfunktionen wie Sitzung, Sicherheit und Warenkorb.",
  "legal.priv.s9.li2.label": "Funktionale Cookies:",
  "legal.priv.s9.li2.text": "Merken sich Ihre Präferenzen wie Sprache/Währung.",
  "legal.priv.s9.li3.label": "Analytische Cookies:",
  "legal.priv.s9.li3.text": "Messen Nutzungsstatistiken anonym (soweit verwendet).",
  "legal.priv.s9.note":
    "Sie können Ihre Cookie-Präferenzen in den Browsereinstellungen verwalten; das Deaktivieren notwendiger Cookies kann jedoch dazu führen, dass einige Funktionen nicht funktionieren.",

  "legal.priv.s10.title": "10. Ihre Rechte (Art. 11 KVKK)",
  "legal.priv.s10.li1": "Zu erfahren, ob Ihre personenbezogenen Daten verarbeitet werden,",
  "legal.priv.s10.li2": "Sofern verarbeitet, diesbezügliche Informationen zu verlangen,",
  "legal.priv.s10.li3": "Den Verarbeitungszweck zu erfahren und ob die Daten zweckentsprechend verwendet werden,",
  "legal.priv.s10.li4": "Bei unvollständiger/fehlerhafter Verarbeitung die Berichtigung zu verlangen,",
  "legal.priv.s10.li5": "Die Löschung oder Vernichtung zu verlangen,",
  "legal.priv.s10.li6": "Zu verlangen, dass die Berichtigung/Löschung den Dritten mitgeteilt wird, an die die Daten übermittelt wurden,",
  "legal.priv.s10.li7": "Einem für Sie nachteiligen Ergebnis aus einer automatisierten Analyse zu widersprechen,",
  "legal.priv.s10.li8": "Den Ersatz des durch rechtswidrige Verarbeitung entstandenen Schadens zu verlangen.",

  "legal.priv.s11.title": "11. Antragsmethode",
  "legal.priv.s11.body1": "Anträge zu den oben genannten Rechten können Sie über die Seite",
  "legal.priv.s11.link": "Kontakt",
  "legal.priv.s11.body2":
    "oder an {email} zusammen mit Ihre Identität bestätigenden Informationen übermitteln. Ihre Anträge werden innerhalb der gesetzlich vorgesehenen Frist (in der Regel spätestens 30 Tage) kostenlos bearbeitet; sofern der Vorgang zusätzliche Kosten verursacht, kann der von der Behörde festgelegte Tarif angewendet werden.",

  "legal.priv.s12.title": "12. Änderungen",
  "legal.priv.s12.body":
    "Dieser Informationstext kann entsprechend Änderungen der Rechtsvorschriften und der Dienste aktualisiert werden. Die aktuelle Fassung tritt in Kraft, sobald sie auf dieser Seite veröffentlicht wird.",

  // ── Nutzungsvereinbarung ──
  "legal.terms.pageTitle": "Nutzungsvereinbarung",
  "legal.terms.intro1": "Diese Nutzungsvereinbarung (die „Vereinbarung“) regelt die Rechte und Pflichten zwischen den Mitgliedern („Nutzer“), die die Plattform",
  "legal.terms.intro2": "(die „Plattform“) nutzen, und dem Plattformbetreiber",
  "legal.terms.intro3":
    "Indem Sie Mitglied der Plattform werden und auf die Dienste zugreifen oder sie nutzen, gelten Sie als erklärend, dass Sie diese Vereinbarung gelesen, verstanden und akzeptiert haben. Wenn Sie die Vereinbarung nicht akzeptieren, dürfen Sie die Plattform nicht nutzen.",

  "legal.terms.s1.title": "1. Definitionen",
  "legal.terms.s1.li1.label": "Plattform:",
  "legal.terms.s1.li1.text": "Website, mobile Oberflächen und Anwendungen.",
  "legal.terms.s1.li2.label": "Digitales Produkt:",
  "legal.terms.s1.li2.text": "Spiel-E-Pins, Plattformguthaben, digitale Codes, Abonnements, Lizenzen und ähnliche immaterielle Güter.",
  "legal.terms.s1.li3.label": "Wallet:",
  "legal.terms.s1.li3.text": "Das virtuelle Konto, in dem der Nutzer innerhalb der Plattform ein Guthaben hält und Zahlungen vornimmt.",
  "legal.terms.s1.li4.label": "Code:",
  "legal.terms.s1.li4.text": "Die einmalig verwendbare Aktivierungsinformation des erworbenen digitalen Produkts.",
  "legal.terms.s1.li5.label": "Händler:",
  "legal.terms.s1.li5.text": "Ein Nutzer mit einem genehmigten Großhandelskonto und gegebenenfalls API-Zugang.",
  "legal.terms.s1.li6.label": "Inhalt:",
  "legal.terms.s1.li6.text": "Alle Texte, Grafiken, Software, Marken und Daten auf der Plattform.",

  "legal.terms.s2.title": "2. Mitgliedschaftsbedingungen",
  "legal.terms.s2.body":
    "Für die Mitgliedschaft müssen Sie mindestens 18 Jahre alt sein oder die Zustimmung Ihres gesetzlichen Vertreters eingeholt haben. Die bei der Mitgliedschaft angegebenen Informationen müssen richtig, aktuell und vollständig sein. Der Nutzer ist für die Kontosicherheit, die Vertraulichkeit seines Passworts und alle mit seinem Konto durchgeführten Transaktionen verantwortlich.",
  "legal.terms.s2.sub1.title": "2.1. Kontosicherheit",
  "legal.terms.s2.sub1.body1": "Sie dürfen Ihr Passwort nicht an Dritte weitergeben und müssen bei Verdacht auf unbefugten Zugriff auf Ihr Konto unverzüglich",
  "legal.terms.s2.sub1.body2": "benachrichtigen.",
  "legal.terms.s2.sub1.body3":
    "bietet zur zusätzlichen Sicherheit Maßnahmen wie eine zweistufige Verifizierung und zugelassene IPs an; die Nutzung dieser Maßnahmen liegt in der Verantwortung des Nutzers.",
  "legal.terms.s2.sub2.title": "2.2. Grundsatz des Einzelkontos",
  "legal.terms.s2.sub2.body":
    "In der Regel darf jede natürliche Person ein einziges Konto eröffnen. Das Eröffnen mehrerer Konten zum Missbrauch von Aktionen oder zur Umgehung von Sanktionen ist untersagt.",

  "legal.terms.s3.title": "3. Nutzung der Dienste",
  "legal.terms.s3.li1.text1": "Digitale Produkte und Codes sind einmalig verwendbar; die Rückgabebedingungen nach der Lieferung unterliegen der Richtlinie",
  "legal.terms.s3.li1.link": "Rückgabe & Widerrufsrecht",
  "legal.terms.s3.li1.text2": ".",
  "legal.terms.s3.li2": "Die Plattform darf nur zu rechtmäßigen Zwecken genutzt werden.",
  "legal.terms.s3.li3": "Der Weiterverkauf von Codes (außerhalb des Händlerstatus), die Nutzung von Automatisierung/Bots, Betrug oder die Ausnutzung von Systemschwachstellen sind untersagt.",
  "legal.terms.s3.li4": "Scheintransaktionen, Betrug, Chargeback-Missbrauch, Geldwäsche oder Missbrauch führen zur Sperrung des Kontos und zu rechtlichen Schritten.",
  "legal.terms.s3.li5": "Über die Plattform dürfen keine andere belästigenden, beleidigenden oder irreführenden Inhalte geteilt werden.",

  "legal.terms.s4.title": "4. Wallet und Guthaben",
  "legal.terms.s4.body1": "Das in das Wallet geladene Guthaben kann nur zum Kauf digitaler Produkte über",
  "legal.terms.s4.body2":
    "verwendet werden; es kann nicht in Bargeld umgewandelt und nicht an Dritte übertragen werden. Guthabenaufladungen und -ausgaben werden im Transaktionsverlauf erfasst. Bei Feststellung einer verdächtigen Transaktion behält sich",
  "legal.terms.s4.body3": "das Recht vor, das betreffende Guthaben vorübergehend zu sperren.",
  "legal.terms.s4.sub1.title": "4.1. Bonus- und Aktionsguthaben",
  "legal.terms.s4.sub1.body1":
    "Im Rahmen von Aktionen gewährte Bonusguthaben haben Aktionscharakter; sie können nicht in Bargeld umgewandelt werden, sind von der Rückgabe ausgeschlossen und unterliegen den Aktionsbedingungen.",
  "legal.terms.s4.sub1.body2": "kann Boni im Falle eines Aktionsmissbrauchs stornieren.",

  "legal.terms.s5.title": "5. Preisgestaltung und Zahlung",
  "legal.terms.s5.body1":
    "Die Produktpreise und die angewandten Provisionen entsprechen den zum Verkaufszeitpunkt auf der Plattform angegebenen. Preise können ohne Vorankündigung aktualisiert werden; der Preis abgeschlossener Bestellungen ändert sich jedoch nicht. Alle Zahlungen werden über sichere Zahlungsinfrastrukturen eingezogen, und Kartendaten werden von",
  "legal.terms.s5.body2": "nicht gespeichert.",

  "legal.terms.s6.title": "6. Identitätsprüfung (KYC)",
  "legal.terms.s6.body1": "Zur Betrugsprävention, aufgrund rechtlicher Verpflichtungen oder bei Transaktionen mit hohem Wert kann",
  "legal.terms.s6.body2":
    "vom Nutzer Informationen/Unterlagen zur Identitätsprüfung anfordern. Wird die Prüfung nicht abgeschlossen, können die betreffenden Transaktionen oder Kontofunktionen eingeschränkt werden. Verifizierungsdaten werden im Rahmen der",
  "legal.terms.s6.link": "Datenschutzerklärung",
  "legal.terms.s6.body3": "verarbeitet.",

  "legal.terms.s7.title": "7. Händlerschaft und API-Nutzung",
  "legal.terms.s7.body1":
    "Genehmigte Händler können von Großhandelspreisen profitieren und, sofern angeboten, API-Zugang nutzen. Der Händler ist für die Vertraulichkeit des API-Schlüssels und alle mit dem Schlüssel durchgeführten Transaktionen verantwortlich.",
  "legal.terms.s7.body2": "behält sich das Recht vor, die Händlerschaft und den API-Zugang im Falle eines Missbrauchs auszusetzen.",

  "legal.terms.s8.title": "8. Geistiges Eigentum",
  "legal.terms.s8.body1": "Die Marken, Logos, Designs, Software und Inhalte auf der Plattform gehören",
  "legal.terms.s8.body2":
    "oder seinen Lizenzgebern. Sie dürfen ohne Genehmigung nicht kopiert, vervielfältigt, zu abgeleiteten Werken verarbeitet oder zu kommerziellen Zwecken genutzt werden. Marken- und Produktnamen Dritter werden ausschließlich zu Identifikationszwecken verwendet.",

  "legal.terms.s9.title": "9. Haftungsbeschränkung",
  "legal.terms.s9.body1":
    "kann nicht unmittelbar für Unterbrechungen, Verzögerungen oder Ungültigkeit von Codes haftbar gemacht werden, die von Drittplattformen (Spielepublisher, Zahlungsdienstleister usw.) ausgehen; in solchen Fällen unternimmt es jedoch angemessene Anstrengungen, um dem Nutzer eine Lösung zu bieten. Die Dienste werden „wie besehen“ angeboten;",
  "legal.terms.s9.body2": "haftet nicht für mittelbare oder unvorhergesehene Schäden.",

  "legal.terms.s10.title": "10. Höhere Gewalt",
  "legal.terms.s10.body":
    "Naturkatastrophen, Epidemien, Cyberangriffe, Infrastruktur-/Internetausfälle, Entscheidungen von Behörden und ähnliche, außerhalb der Kontrolle der Parteien liegende Umstände gelten als höhere Gewalt. Während der Dauer der höheren Gewalt wird die Erfüllung der Verpflichtungen ausgesetzt.",

  "legal.terms.s11.title": "11. Sperrung und Kündigung des Kontos",
  "legal.terms.s11.body1": "Bei einem Verstoß gegen diese Vereinbarung hat",
  "legal.terms.s11.body2":
    "das Recht, das Konto des Nutzers zu sperren oder zu schließen. Der Nutzer kann ebenfalls jederzeit die Schließung seines Kontos beantragen. Die Schließung des Kontos beseitigt entstandene rechtliche Verpflichtungen und laufende Transaktionen nicht.",

  "legal.terms.s12.title": "12. Übertragung und Salvatorische Klausel",
  "legal.terms.s12.body1": "Der Nutzer darf die aus dieser Vereinbarung entstehenden Rechte und Pflichten nicht ohne die schriftliche Zustimmung von",
  "legal.terms.s12.body2":
    "übertragen. Die Unwirksamkeit einer Bestimmung der Vereinbarung berührt nicht die Gültigkeit der übrigen Bestimmungen.",

  "legal.terms.s13.title": "13. Mitteilungen",
  "legal.terms.s13.body1":
    "richtet seine Mitteilungen an den Nutzer über plattforminterne Benachrichtigungen, die registrierte E-Mail-Adresse oder durch Veröffentlichung auf der Plattform. Der Nutzer ist verpflichtet, seine Kontaktdaten aktuell zu halten.",

  "legal.terms.s14.title": "14. Änderungen der Vereinbarung",
  "legal.terms.s14.body1":
    "behält sich das Recht vor, diese Vereinbarung zu aktualisieren. Die aktuelle Fassung tritt in Kraft, sobald sie auf dieser Seite veröffentlicht wird. Bei wesentlichen Änderungen wird der Nutzer auf geeignete Weise informiert.",

  "legal.terms.s15.title": "15. Anwendbares Recht und Gerichtsstand",
  "legal.terms.s15.body":
    "Diese Vereinbarung unterliegt dem Recht der Republik Türkei. Bei Streitigkeiten sind die Verbraucherschiedsausschüsse und die Verbrauchergerichte gemäß den vom Handelsministerium bekannt gegebenen Wertgrenzen zuständig.",

  "legal.terms.s16.title": "16. Kontakt",
  "legal.terms.s16.body1": "Bei Fragen zur Vereinbarung erreichen Sie uns über die Seite",
  "legal.terms.s16.link": "Kontakt",
  "legal.terms.s16.body2": "oder unter {email}.",
};

export const ar: Dict = {
  "legal.updatedLabel": "آخر تحديث",
  // ── سياسة الخصوصية و KVKK ──
  "legal.priv.pageTitle": "سياسة الخصوصية ونص الإفصاح بموجب قانون KVKK",
  "legal.priv.intro":
    "بصفتنا المسؤول عن البيانات بموجب القانون رقم 6698 بشأن حماية البيانات الشخصية (“KVKK”)، نولي أهمية قصوى لأمن بياناتك الشخصية. يوضح هذا النص: أي بيانات نعالجها، ولأي غرض، واستناداً إلى أي أساس قانوني، ومع من نشاركها، وما هي حقوقك.",

  "legal.priv.s1.title": "1. المسؤول عن البيانات",
  "legal.priv.s1.row.title": "الاسم التجاري",
  "legal.priv.s1.row.address": "العنوان",
  "legal.priv.s1.row.email": "البريد الإلكتروني",
  "legal.priv.s1.row.kep": "البريد الإلكتروني المسجّل (KEP)",

  "legal.priv.s2.title": "2. البيانات الشخصية المعالَجة",
  "legal.priv.s2.li1.label": "الهوية والتواصل:",
  "legal.priv.s2.li1.text": "الاسم واللقب، اسم المستخدم، عنوان البريد الإلكتروني، الهاتف (إن وُجد).",
  "legal.priv.s2.li2.label": "بيانات المعاملات:",
  "legal.priv.s2.li2.text": "سجل الطلبات والتسليم، حركات المحفظة، بيانات الفاتورة والعنوان.",
  "legal.priv.s2.li3.label": "بيانات الدفع:",
  "legal.priv.s2.li3.text1": "معلومات وسيلة الدفع (لا تُخزَّن بيانات البطاقة من قِبل",
  "legal.priv.s2.li3.text2": "بل تعالَج من قِبل مؤسسة الدفع).",
  "legal.priv.s2.li4.label": "البيانات التقنية:",
  "legal.priv.s2.li4.text": "عنوان IP، معلومات الجلسة/الجهاز، معلومات المتصفح وسجلات الدخول.",
  "legal.priv.s2.li5.label": "بيانات التحقق (KYC):",
  "legal.priv.s2.li5.text": "المستندات والمعلومات المطلوبة لغرض التحقق من الهوية في الحالات ذات الصلة.",
  "legal.priv.s2.li6.label": "بيانات التسويق:",
  "legal.priv.s2.li6.text": "تفضيلات التواصل وتفاعلات الحملات في حال موافقتك.",

  "legal.priv.s3.title": "3. أغراض المعالجة",
  "legal.priv.s3.li1": "إنشاء العضوية وإدارة الحساب،",
  "legal.priv.s3.li2": "تنفيذ معاملات الطلب والتسليم والمحفظة،",
  "legal.priv.s3.li3": "أمن الدفع ومنع الاحتيال وإساءة الاستخدام،",
  "legal.priv.s3.li4": "الوفاء بالالتزامات القانونية (إصدار الفواتير، الامتثال للتشريعات)،",
  "legal.priv.s3.li5": "الرد على طلبات الدعم وتحسين جودة الخدمة،",
  "legal.priv.s3.li6": "إرسال الحملات والإشعارات في حال موافقتك.",

  "legal.priv.s4.title": "4. الأسس القانونية",
  "legal.priv.s4.body":
    "تُعالَج بياناتك استناداً إلى الأسس القانونية المتمثلة في إبرام/تنفيذ العقد، والالتزام القانوني، وإقرار/حماية حق، والمصلحة المشروعة، وعند الاقتضاء موافقتك الصريحة (المادتان 5 و6 من قانون KVKK).",

  "legal.priv.s5.title": "5. طريقة الجمع",
  "legal.priv.s5.body":
    "تُجمَع بياناتك الشخصية إلكترونياً عبر نماذج العضوية والطلب، ومعاملات المحفظة، وقنوات الدعم، وملفات تعريف الارتباط، وسجلات النظام التلقائية.",

  "legal.priv.s6.title": "6. نقل البيانات",
  "legal.priv.s6.body":
    "تُشارَك بياناتك بالقدر اللازم فقط وبما يتوافق مع التشريعات مع مؤسسات الدفع، ومزوّدي البريد الإلكتروني/الإشعارات، ومزوّدي خدمات الاستضافة والبنية التحتية اللازمين لتقديم الخدمة، إضافةً إلى الجهات العامة المخوّلة قانوناً.",
  "legal.priv.s6.sub.title": "6.1. النقل إلى الخارج",
  "legal.priv.s6.sub.body":
    "في حال وجود البنية التحتية السحابية وبعض مزوّدي الخدمات في الخارج، يجوز نقل بياناتك إلى الخارج وفقاً للشروط الواردة في المادة 9 من قانون KVKK والتدابير الأمنية اللازمة.",

  "legal.priv.s7.title": "7. مدة الاحتفاظ",
  "legal.priv.s7.body":
    "يُحتفَظ ببياناتك الشخصية طوال المدة التي يقتضيها غرض المعالجة وطوال فترات الاحتفاظ القانونية المنصوص عليها في التشريعات ذات الصلة (مثل السجلات التجارية والضريبية)؛ وعند انتهاء المدة تُحذَف أو تُتلَف أو تُجهَّل هويتها.",

  "legal.priv.s8.title": "8. أمن البيانات",
  "legal.priv.s8.body":
    "تُخزَّن أكواد المنتجات والبيانات الحساسة بشكل مشفّر. ويُقيَّد الوصول إلى البيانات عبر التفويض؛ وتُشفَّر عمليات نقل البيانات باستخدام SSL/TLS. وتُطبَّق تدابير تقنية وإدارية لمنع الوصول غير المصرّح به وتُراجَع بانتظام.",

  "legal.priv.s9.title": "9. ملفات تعريف الارتباط",
  "legal.priv.s9.body":
    "تستخدم المنصة ملفات تعريف الارتباط لأغراض إدارة الجلسة والأمن وتحسين التجربة:",
  "legal.priv.s9.li1.label": "ملفات تعريف الارتباط الضرورية:",
  "legal.priv.s9.li1.text": "ضرورية للوظائف الأساسية مثل الجلسة والأمن والسلة.",
  "legal.priv.s9.li2.label": "ملفات تعريف الارتباط الوظيفية:",
  "legal.priv.s9.li2.text": "تتذكّر تفضيلاتك مثل اللغة/العملة.",
  "legal.priv.s9.li3.label": "ملفات تعريف الارتباط التحليلية:",
  "legal.priv.s9.li3.text": "تقيس إحصاءات الاستخدام بشكل مجهول (بالقدر المستخدم).",
  "legal.priv.s9.note":
    "يمكنك إدارة تفضيلات ملفات تعريف الارتباط من إعدادات متصفحك؛ غير أن تعطيل ملفات تعريف الارتباط الضرورية قد يؤدي إلى عدم عمل بعض الميزات.",

  "legal.priv.s10.title": "10. حقوقك (المادة 11 من قانون KVKK)",
  "legal.priv.s10.li1": "معرفة ما إذا كانت بياناتك الشخصية تُعالَج،",
  "legal.priv.s10.li2": "طلب معلومات بشأنها إذا كانت قد عُولِجت،",
  "legal.priv.s10.li3": "معرفة غرض المعالجة وما إذا كانت تُستخدَم وفقاً لغرضها،",
  "legal.priv.s10.li4": "طلب تصحيحها إذا عُولِجت بشكل ناقص/خاطئ،",
  "legal.priv.s10.li5": "طلب حذفها أو إتلافها،",
  "legal.priv.s10.li6": "طلب إبلاغ الأطراف الثالثة التي نُقِلت إليها البيانات بعمليات التصحيح/الحذف،",
  "legal.priv.s10.li7": "الاعتراض على نتيجة في غير صالحك ناتجة عن تحليل آلي،",
  "legal.priv.s10.li8": "المطالبة بالتعويض عن الضرر الناشئ عن المعالجة غير المشروعة.",

  "legal.priv.s11.title": "11. طريقة التقديم",
  "legal.priv.s11.body1": "يمكنك تقديم طلباتك المتعلقة بالحقوق المذكورة أعلاه عبر صفحة",
  "legal.priv.s11.link": "التواصل",
  "legal.priv.s11.body2":
    "أو إلى {email} مع معلومات تثبت هويتك. تُنجَز طلباتك مجاناً خلال المدة المنصوص عليها في التشريعات (كقاعدة عامة خلال 30 يوماً كحد أقصى)؛ وفي حال استلزمت العملية تكلفة إضافية، يجوز تطبيق التعرفة التي تحددها الهيئة.",

  "legal.priv.s12.title": "12. التغييرات",
  "legal.priv.s12.body":
    "يجوز تحديث نص الإفصاح هذا بما يتوافق مع التغييرات في التشريعات والخدمات. وتدخل النسخة الحالية حيز التنفيذ فور نشرها على هذه الصفحة.",

  // ── اتفاقية المستخدم ──
  "legal.terms.pageTitle": "اتفاقية المستخدم",
  "legal.terms.intro1": "تنظّم اتفاقية المستخدم هذه (“الاتفاقية”) الحقوق والالتزامات بين الأعضاء (“المستخدم”) الذين يستخدمون منصة",
  "legal.terms.intro2": "(“المنصة”) ومشغّل المنصة",
  "legal.terms.intro3":
    "بانضمامك إلى المنصة كعضو وبوصولك إلى الخدمات أو استخدامها، تُعدّ مُقِرّاً بأنك قرأت هذه الاتفاقية وفهمتها وقبلتها. إذا كنت لا تقبل الاتفاقية، فيتعيّن عليك عدم استخدام المنصة.",

  "legal.terms.s1.title": "1. التعريفات",
  "legal.terms.s1.li1.label": "المنصة:",
  "legal.terms.s1.li1.text": "الموقع الإلكتروني والواجهات والتطبيقات المحمولة.",
  "legal.terms.s1.li2.label": "المنتج الرقمي:",
  "legal.terms.s1.li2.text": "بطاقات الشحن (E-pin) للألعاب، ورصيد المنصة، والأكواد الرقمية، والاشتراكات، والتراخيص، والسلع غير المادية المماثلة.",
  "legal.terms.s1.li3.label": "المحفظة:",
  "legal.terms.s1.li3.text": "الحساب الافتراضي الذي يحتفظ فيه المستخدم برصيد ويجري عبره المدفوعات داخل المنصة.",
  "legal.terms.s1.li4.label": "الكود:",
  "legal.terms.s1.li4.text": "معلومة التفعيل ذات الاستخدام الواحد للمنتج الرقمي المُشترى.",
  "legal.terms.s1.li5.label": "الموزّع:",
  "legal.terms.s1.li5.text": "مستخدم يملك حساب بيع بالجملة معتمداً، وعند الاقتضاء وصولاً إلى واجهة برمجة التطبيقات (API).",
  "legal.terms.s1.li6.label": "المحتوى:",
  "legal.terms.s1.li6.text": "جميع النصوص والصور والبرمجيات والعلامات التجارية والبيانات الموجودة على المنصة.",

  "legal.terms.s2.title": "2. شروط العضوية",
  "legal.terms.s2.body":
    "يشترط للعضوية أن تكون قد أتممت سن 18 عاماً أو حصلت على موافقة ممثلك القانوني. ويجب أن تكون المعلومات التي تقدمها أثناء العضوية صحيحة ومحدّثة وكاملة. ويتحمل المستخدم المسؤولية عن أمن الحساب وسرية كلمة المرور وجميع المعاملات التي تُجرى بحسابه.",
  "legal.terms.s2.sub1.title": "2.1. أمن الحساب",
  "legal.terms.s2.sub1.body1": "يجب ألّا تشارك كلمة مرورك مع أطراف ثالثة، وعند الاشتباه في وصول غير مصرّح به إلى حسابك يجب إبلاغ",
  "legal.terms.s2.sub1.body2": "فوراً.",
  "legal.terms.s2.sub1.body3":
    "تقدّم لأغراض الأمن الإضافي تدابير مثل التحقق بخطوتين وعناوين IP المسموح بها؛ ويقع استخدام هذه التدابير على مسؤولية المستخدم.",
  "legal.terms.s2.sub2.title": "2.2. مبدأ الحساب الواحد",
  "legal.terms.s2.sub2.body":
    "كقاعدة عامة، يجوز لكل شخص طبيعي فتح حساب واحد. ويُحظَر فتح حسابات متعددة بغرض إساءة استخدام العروض الترويجية أو التهرب من العقوبات.",

  "legal.terms.s3.title": "3. استخدام الخدمات",
  "legal.terms.s3.li1.text1": "المنتجات الرقمية والأكواد ذات استخدام واحد؛ وتخضع شروط الاسترداد بعد التسليم لسياسة",
  "legal.terms.s3.li1.link": "الاسترداد وحق الانسحاب",
  "legal.terms.s3.li1.text2": ".",
  "legal.terms.s3.li2": "لا يجوز استخدام المنصة إلا للأغراض المشروعة.",
  "legal.terms.s3.li3": "يُحظَر إعادة بيع الأكواد (خارج نطاق صفة الموزّع)، واستخدام الأتمتة/الروبوتات، والغش، أو استغلال الثغرات الأمنية في النظام.",
  "legal.terms.s3.li4": "تؤدي المعاملات الوهمية والاحتيال وإساءة استخدام ردّ المبالغ (chargeback) وغسل الأموال أو سوء الاستخدام إلى تعليق الحساب واتخاذ الإجراءات القانونية.",
  "legal.terms.s3.li5": "لا يجوز عبر المنصة مشاركة محتوى يضايق الآخرين أو يتضمّن إهانة أو يكون مضلِّلاً.",

  "legal.terms.s4.title": "4. المحفظة والرصيد",
  "legal.terms.s4.body1": "الرصيد المُحمَّل في المحفظة يُستخدَم فقط لشراء المنتجات الرقمية عبر",
  "legal.terms.s4.body2":
    "ولا يمكن تحويله إلى نقد ولا نقله إلى أطراف ثالثة. وتُسجَّل عمليات شحن الرصيد والإنفاق في سجل المعاملات. وفي حال اكتشاف معاملة مشبوهة، تحتفظ",
  "legal.terms.s4.body3": "بالحق في حظر الرصيد المعني بشكل مؤقت.",
  "legal.terms.s4.sub1.title": "4.1. رصيد المكافآت والعروض الترويجية",
  "legal.terms.s4.sub1.body1":
    "أرصدة المكافآت المُمنوحة ضمن الحملات ذات طابع ترويجي؛ فلا يمكن تحويلها إلى نقد، وهي خارج نطاق الاسترداد، وتخضع لشروط الحملة.",
  "legal.terms.s4.sub1.body2": "يجوز لها إلغاء المكافآت في حال إساءة استخدام العروض الترويجية.",

  "legal.terms.s5.title": "5. التسعير والدفع",
  "legal.terms.s5.body1":
    "أسعار المنتجات والعمولات المطبَّقة هي على النحو المبيّن على المنصة وقت البيع. ويجوز تحديث الأسعار دون إشعار؛ غير أن سعر الطلبات المكتملة لا يتغيّر. وتُحصَّل جميع المدفوعات عبر بنى تحتية آمنة للدفع، ولا تُخزَّن بيانات البطاقة من قِبل",
  "legal.terms.s5.body2": ".",

  "legal.terms.s6.title": "6. التحقق من الهوية (KYC)",
  "legal.terms.s6.body1": "في إطار منع الاحتيال أو الالتزامات القانونية أو المعاملات ذات القيمة العالية، يجوز لـ",
  "legal.terms.s6.body2":
    "طلب معلومات/مستندات للتحقق من هوية المستخدم. وفي حال عدم إتمام التحقق، يجوز تقييد المعاملات المعنية أو خصائص الحساب. وتُعالَج بيانات التحقق في إطار",
  "legal.terms.s6.link": "سياسة الخصوصية",
  "legal.terms.s6.body3": ".",

  "legal.terms.s7.title": "7. الموزّعون واستخدام واجهة برمجة التطبيقات (API)",
  "legal.terms.s7.body1":
    "يجوز للموزّعين المعتمدين الاستفادة من أسعار الجملة، واستخدام الوصول إلى API عند توفّره. ويتحمل الموزّع المسؤولية عن سرية مفتاح API وجميع المعاملات التي تُجرى بالمفتاح.",
  "legal.terms.s7.body2": "تحتفظ بالحق في تعليق صفة الموزّع والوصول إلى API في حال إساءة الاستخدام.",

  "legal.terms.s8.title": "8. الملكية الفكرية",
  "legal.terms.s8.body1": "العلامات التجارية والشعارات والتصاميم والبرمجيات والمحتويات الموجودة على المنصة تعود ملكيتها إلى",
  "legal.terms.s8.body2":
    "أو إلى المرخِّصين لها. ولا يجوز نسخها أو إعادة إنتاجها أو إنشاء أعمال مشتقة منها أو استخدامها لأغراض تجارية دون إذن. وتُستخدَم العلامات التجارية وأسماء منتجات الأطراف الثالثة لأغراض التعريف فقط.",

  "legal.terms.s9.title": "9. تحديد المسؤولية",
  "legal.terms.s9.body1":
    "لا يمكن أن تُحمَّل المسؤولية المباشرة عن الانقطاعات أو التأخيرات أو بطلان الأكواد الناشئة عن منصات الأطراف الثالثة (ناشرو الألعاب، مزوّدو الدفع، إلخ)؛ غير أنها في مثل هذه الحالات تبذل جهداً معقولاً لتقديم حل للمستخدم. وتُقدَّم الخدمات “كما هي”؛ ولا تتحمل",
  "legal.terms.s9.body2": "المسؤولية عن الأضرار غير المباشرة أو غير المتوقعة.",

  "legal.terms.s10.title": "10. القوة القاهرة",
  "legal.terms.s10.body":
    "تُعَدّ الكوارث الطبيعية والأوبئة والهجمات السيبرانية وانقطاعات البنية التحتية/الإنترنت وقرارات السلطات العامة والحالات المماثلة الخارجة عن سيطرة الأطراف قوة قاهرة. ويُعلَّق تنفيذ الالتزامات طوال مدة القوة القاهرة.",

  "legal.terms.s11.title": "11. تعليق الحساب وإنهاؤه",
  "legal.terms.s11.body1": "في حال مخالفة هذه الاتفاقية، يحق لـ",
  "legal.terms.s11.body2":
    "تعليق حساب المستخدم أو إغلاقه. ويجوز للمستخدم أيضاً طلب إغلاق حسابه في أي وقت. ولا يُلغي إغلاق الحساب الالتزامات القانونية المترتبة والمعاملات الجارية.",

  "legal.terms.s12.title": "12. التنازل عن الاتفاقية وقابلية الفصل",
  "legal.terms.s12.body1": "لا يجوز للمستخدم التنازل عن الحقوق والالتزامات الناشئة عن هذه الاتفاقية دون موافقة كتابية من",
  "legal.terms.s12.body2":
    "ولا يؤثر بطلان أي حكم من أحكام الاتفاقية على صحة الأحكام الأخرى.",

  "legal.terms.s13.title": "13. الإشعارات",
  "legal.terms.s13.body1":
    "توجّه إشعاراتها إلى المستخدم عبر الإشعارات داخل المنصة، أو عنوان البريد الإلكتروني المسجّل، أو النشر على المنصة. ويلتزم المستخدم بإبقاء بيانات التواصل الخاصة به محدّثة.",

  "legal.terms.s14.title": "14. تعديلات الاتفاقية",
  "legal.terms.s14.body1":
    "تحتفظ بالحق في تحديث هذه الاتفاقية. وتدخل النسخة الحالية حيز التنفيذ فور نشرها على هذه الصفحة. وفي حال التغييرات الجوهرية، يُبلَّغ المستخدم بالوسائل المناسبة.",

  "legal.terms.s15.title": "15. القانون الواجب التطبيق والاختصاص",
  "legal.terms.s15.body":
    "تخضع هذه الاتفاقية لقوانين جمهورية تركيا. وفي النزاعات، تختص لجان التحكيم الاستهلاكية والمحاكم الاستهلاكية وفقاً للحدود المالية التي تعلنها وزارة التجارة.",

  "legal.terms.s16.title": "16. التواصل",
  "legal.terms.s16.body1": "لأي أسئلة بشأن الاتفاقية، يمكنك التواصل معنا عبر صفحة",
  "legal.terms.s16.link": "التواصل",
  "legal.terms.s16.body2": "أو عبر {email}.",
};

export const ru: Dict = {
  "legal.updatedLabel": "Последнее обновление",
  // ── Политика конфиденциальности и KVKK ──
  "legal.priv.pageTitle": "Политика конфиденциальности и информационный текст KVKK",
  "legal.priv.intro":
    "как оператор данных в соответствии с Законом № 6698 о защите персональных данных («KVKK») придаёт первостепенное значение безопасности ваших персональных данных. Настоящий текст разъясняет: какие ваши данные, с какой целью и на каком правовом основании мы обрабатываем, с кем делимся и каковы ваши права.",

  "legal.priv.s1.title": "1. Оператор данных",
  "legal.priv.s1.row.title": "Наименование",
  "legal.priv.s1.row.address": "Адрес",
  "legal.priv.s1.row.email": "Электронная почта",
  "legal.priv.s1.row.kep": "Зарегистрированная эл. почта (KEP)",

  "legal.priv.s2.title": "2. Обрабатываемые персональные данные",
  "legal.priv.s2.li1.label": "Идентификация и контакты:",
  "legal.priv.s2.li1.text": "Имя и фамилия, имя пользователя, адрес электронной почты, телефон (при наличии).",
  "legal.priv.s2.li2.label": "Данные о транзакциях:",
  "legal.priv.s2.li2.text": "История заказов и доставки, движения по кошельку, данные счёта-фактуры и адреса.",
  "legal.priv.s2.li3.label": "Платёжные данные:",
  "legal.priv.s2.li3.text1": "Сведения о способе оплаты (данные карты не хранятся",
  "legal.priv.s2.li3.text2": "и обрабатываются платёжной организацией).",
  "legal.priv.s2.li4.label": "Технические данные:",
  "legal.priv.s2.li4.text": "IP-адрес, сведения о сессии/устройстве, сведения о браузере и журналы записей.",
  "legal.priv.s2.li5.label": "Данные верификации (KYC):",
  "legal.priv.s2.li5.text": "Документы и сведения, запрашиваемые для подтверждения личности в соответствующих случаях.",
  "legal.priv.s2.li6.label": "Маркетинговые данные:",
  "legal.priv.s2.li6.text": "Предпочтения в коммуникации и взаимодействие с кампаниями, если вы дали согласие.",

  "legal.priv.s3.title": "3. Цели обработки",
  "legal.priv.s3.li1": "Создание членства и управление учётной записью,",
  "legal.priv.s3.li2": "Осуществление операций заказа, доставки и кошелька,",
  "legal.priv.s3.li3": "Безопасность платежей, предотвращение мошенничества и злоупотреблений,",
  "legal.priv.s3.li4": "Выполнение правовых обязательств (выставление счетов, соответствие законодательству),",
  "legal.priv.s3.li5": "Ответы на запросы в поддержку и повышение качества обслуживания,",
  "legal.priv.s3.li6": "Отправка кампаний и уведомлений при наличии вашего согласия.",

  "legal.priv.s4.title": "4. Правовые основания",
  "legal.priv.s4.body":
    "Ваши данные обрабатываются на правовых основаниях заключения/исполнения договора, правового обязательства, установления/защиты права, законного интереса и, при необходимости, вашего явного согласия (ст. 5 и 6 KVKK).",

  "legal.priv.s5.title": "5. Способ сбора",
  "legal.priv.s5.body":
    "Ваши персональные данные собираются в электронном виде посредством форм членства и заказа, операций кошелька, каналов поддержки, файлов cookie и автоматических системных записей.",

  "legal.priv.s6.title": "6. Передача данных",
  "legal.priv.s6.body":
    "Ваши данные передаются только в необходимом объёме и в соответствии с законодательством платёжным организациям, поставщикам услуг электронной почты/уведомлений, поставщикам услуг хостинга и инфраструктуры, необходимым для оказания услуги, а также законно уполномоченным государственным органам.",
  "legal.priv.s6.sub.title": "6.1. Передача за рубеж",
  "legal.priv.s6.sub.body":
    "В случае нахождения облачной инфраструктуры и некоторых поставщиков услуг за рубежом ваши данные могут быть переданы за рубеж в соответствии с условиями ст. 9 KVKK и необходимыми мерами безопасности.",

  "legal.priv.s7.title": "7. Срок хранения",
  "legal.priv.s7.body":
    "Ваши персональные данные хранятся в течение срока, необходимого для цели обработки, и на протяжении установленных соответствующим законодательством сроков хранения (например, коммерческие и налоговые записи); по истечении срока они удаляются, уничтожаются или анонимизируются.",

  "legal.priv.s8.title": "8. Безопасность данных",
  "legal.priv.s8.body":
    "Коды продуктов и конфиденциальные данные хранятся в зашифрованном виде. Доступ к данным ограничивается посредством авторизации; передача данных шифруется по SSL/TLS. Для предотвращения несанкционированного доступа применяются технические и организационные меры, которые регулярно пересматриваются.",

  "legal.priv.s9.title": "9. Файлы cookie",
  "legal.priv.s9.body":
    "Платформа использует файлы cookie в целях управления сессией, безопасности и улучшения опыта:",
  "legal.priv.s9.li1.label": "Обязательные файлы cookie:",
  "legal.priv.s9.li1.text": "Необходимы для основных функций, таких как сессия, безопасность и корзина.",
  "legal.priv.s9.li2.label": "Функциональные файлы cookie:",
  "legal.priv.s9.li2.text": "Запоминают ваши предпочтения, такие как язык/валюта.",
  "legal.priv.s9.li3.label": "Аналитические файлы cookie:",
  "legal.priv.s9.li3.text": "Анонимно измеряют статистику использования (в той мере, в какой используются).",
  "legal.priv.s9.note":
    "Вы можете управлять настройками файлов cookie в настройках браузера; однако отключение обязательных файлов cookie может привести к тому, что некоторые функции перестанут работать.",

  "legal.priv.s10.title": "10. Ваши права (ст. 11 KVKK)",
  "legal.priv.s10.li1": "Узнать, обрабатываются ли ваши персональные данные,",
  "legal.priv.s10.li2": "Запросить информацию об этом, если они обрабатывались,",
  "legal.priv.s10.li3": "Узнать цель обработки и используются ли данные в соответствии с этой целью,",
  "legal.priv.s10.li4": "Требовать исправления, если они обработаны неполно/неверно,",
  "legal.priv.s10.li5": "Требовать их удаления или уничтожения,",
  "legal.priv.s10.li6": "Требовать уведомления о исправлении/удалении третьих лиц, которым были переданы данные,",
  "legal.priv.s10.li7": "Возражать против результата не в вашу пользу, возникшего вследствие автоматизированного анализа,",
  "legal.priv.s10.li8": "Требовать возмещения ущерба, возникшего вследствие неправомерной обработки.",

  "legal.priv.s11.title": "11. Способ обращения",
  "legal.priv.s11.body1": "Запросы относительно вышеуказанных прав вы можете подать через страницу",
  "legal.priv.s11.link": "Контакты",
  "legal.priv.s11.body2":
    "или на адрес {email} вместе со сведениями, подтверждающими вашу личность. Ваши запросы рассматриваются бесплатно в течение срока, предусмотренного законодательством (как правило, не позднее 30 дней); в случае если операция дополнительно требует затрат, может применяться тариф, установленный Комитетом.",

  "legal.priv.s12.title": "12. Изменения",
  "legal.priv.s12.body":
    "Настоящий информационный текст может обновляться в соответствии с изменениями законодательства и услуг. Актуальная версия вступает в силу в момент её публикации на этой странице.",

  // ── Пользовательское соглашение ──
  "legal.terms.pageTitle": "Пользовательское соглашение",
  "legal.terms.intro1": "Настоящее Пользовательское соглашение («Соглашение») регулирует права и обязанности между участниками («Пользователь»), использующими платформу",
  "legal.terms.intro2": "(«Платформа»), и оператором Платформы",
  "legal.terms.intro3":
    "Становясь участником Платформы и получая доступ к услугам или используя их, вы считаетесь заявившим, что прочитали, поняли и приняли настоящее Соглашение. Если вы не принимаете Соглашение, вам не следует пользоваться Платформой.",

  "legal.terms.s1.title": "1. Определения",
  "legal.terms.s1.li1.label": "Платформа:",
  "legal.terms.s1.li1.text": "веб-сайт, мобильные интерфейсы и приложения.",
  "legal.terms.s1.li2.label": "Цифровой продукт:",
  "legal.terms.s1.li2.text": "Игровые e-pin, баланс платформы, цифровые коды, подписки, лицензии и аналогичные нематериальные товары.",
  "legal.terms.s1.li3.label": "Кошелёк:",
  "legal.terms.s1.li3.text": "Виртуальный счёт, на котором Пользователь хранит баланс и осуществляет платежи в рамках Платформы.",
  "legal.terms.s1.li4.label": "Код:",
  "legal.terms.s1.li4.text": "Одноразовая активационная информация приобретённого цифрового продукта.",
  "legal.terms.s1.li5.label": "Дилер:",
  "legal.terms.s1.li5.text": "Пользователь, имеющий одобренный оптовый аккаунт и, при необходимости, доступ к API.",
  "legal.terms.s1.li6.label": "Контент:",
  "legal.terms.s1.li6.text": "Весь текст, изображения, программное обеспечение, товарные знаки и данные на Платформе.",

  "legal.terms.s2.title": "2. Условия членства",
  "legal.terms.s2.body":
    "Для членства необходимо достичь 18 лет или получить согласие вашего законного представителя. Сведения, предоставляемые при регистрации, должны быть достоверными, актуальными и полными. Пользователь несёт ответственность за безопасность учётной записи, конфиденциальность своего пароля и все операции, совершённые с его учётной записью.",
  "legal.terms.s2.sub1.title": "2.1. Безопасность учётной записи",
  "legal.terms.s2.sub1.body1": "Вы не должны передавать свой пароль третьим лицам и при подозрении на несанкционированный доступ к вашей учётной записи обязаны незамедлительно уведомить",
  "legal.terms.s2.sub1.body2": ".",
  "legal.terms.s2.sub1.body3":
    "в целях дополнительной безопасности предлагает такие меры, как двухэтапная верификация и разрешённые IP-адреса; использование этих мер является ответственностью Пользователя.",
  "legal.terms.s2.sub2.title": "2.2. Принцип единой учётной записи",
  "legal.terms.s2.sub2.body":
    "Как правило, каждое физическое лицо может открыть одну учётную запись. Открытие нескольких учётных записей с целью злоупотребления акциями или уклонения от санкций запрещено.",

  "legal.terms.s3.title": "3. Использование услуг",
  "legal.terms.s3.li1.text1": "Цифровые продукты и коды являются одноразовыми; условия возврата после доставки регулируются политикой",
  "legal.terms.s3.li1.link": "Возврат и право отказа",
  "legal.terms.s3.li1.text2": ".",
  "legal.terms.s3.li2": "Платформа может использоваться только в законных целях.",
  "legal.terms.s3.li3": "Перепродажа кодов (вне рамок статуса дилера), использование автоматизации/ботов, мошенничество или эксплуатация уязвимостей системы запрещены.",
  "legal.terms.s3.li4": "Фиктивные операции, мошенничество, злоупотребление возвратными платежами (chargeback), отмывание денег или злоупотребления влекут приостановление учётной записи и правовые меры.",
  "legal.terms.s3.li5": "Через Платформу нельзя распространять контент, причиняющий беспокойство другим, содержащий оскорбления или вводящий в заблуждение.",

  "legal.terms.s4.title": "4. Кошелёк и баланс",
  "legal.terms.s4.body1": "Баланс, загруженный в кошелёк, используется только для покупки цифровых продуктов через",
  "legal.terms.s4.body2":
    "он не может быть обналичен и не может быть передан третьим лицам. Пополнения и расходы баланса фиксируются в истории операций. В случае выявления подозрительной операции",
  "legal.terms.s4.body3": "оставляет за собой право временно заблокировать соответствующий баланс.",
  "legal.terms.s4.sub1.title": "4.1. Бонусный и акционный баланс",
  "legal.terms.s4.sub1.body1":
    "Бонусные балансы, начисленные в рамках кампаний, носят акционный характер; они не могут быть обналичены, не подлежат возврату и регулируются условиями кампании.",
  "legal.terms.s4.sub1.body2": "может аннулировать бонусы в случае злоупотребления акциями.",

  "legal.terms.s5.title": "5. Ценообразование и оплата",
  "legal.terms.s5.body1":
    "Цены на продукты и применяемые комиссии соответствуют указанным на Платформе в момент продажи. Цены могут обновляться без предварительного уведомления; однако цена завершённых заказов не меняется. Все платежи принимаются через защищённые платёжные инфраструктуры, и данные карт не хранятся",
  "legal.terms.s5.body2": ".",

  "legal.terms.s6.title": "6. Подтверждение личности (KYC)",
  "legal.terms.s6.body1": "В рамках предотвращения мошенничества, правовых обязательств или операций на крупные суммы",
  "legal.terms.s6.body2":
    "может запросить у Пользователя сведения/документы для подтверждения личности. В случае незавершения проверки соответствующие операции или функции учётной записи могут быть ограничены. Данные верификации обрабатываются в рамках",
  "legal.terms.s6.link": "Политики конфиденциальности",
  "legal.terms.s6.body3": ".",

  "legal.terms.s7.title": "7. Дилерство и использование API",
  "legal.terms.s7.body1":
    "Одобренные дилеры могут пользоваться оптовыми ценами и, если это предлагается, использовать доступ к API. Дилер несёт ответственность за конфиденциальность ключа API и все операции, совершённые с ключом.",
  "legal.terms.s7.body2": "оставляет за собой право приостановить дилерство и доступ к API в случае злоупотребления.",

  "legal.terms.s8.title": "8. Интеллектуальная собственность",
  "legal.terms.s8.body1": "Товарные знаки, логотипы, дизайн, программное обеспечение и контент на Платформе принадлежат",
  "legal.terms.s8.body2":
    "или её лицензиарам. Их нельзя копировать, воспроизводить, создавать на их основе производные работы или использовать в коммерческих целях без разрешения. Товарные знаки и наименования продуктов третьих лиц используются исключительно в целях идентификации.",

  "legal.terms.s9.title": "9. Ограничение ответственности",
  "legal.terms.s9.body1":
    "не может нести прямую ответственность за перебои, задержки или недействительность кодов, возникающие со стороны сторонних платформ (издатели игр, поставщики платежей и т. п.); однако в таких случаях прилагает разумные усилия для предоставления Пользователю решения. Услуги предоставляются «как есть»;",
  "legal.terms.s9.body2": "не несёт ответственности за косвенные или непредвиденные убытки.",

  "legal.terms.s10.title": "10. Форс-мажор",
  "legal.terms.s10.body":
    "Стихийные бедствия, эпидемии, кибератаки, сбои инфраструктуры/интернета, решения государственных органов и аналогичные обстоятельства, находящиеся вне контроля сторон, считаются форс-мажором. На время действия форс-мажора исполнение обязательств приостанавливается.",

  "legal.terms.s11.title": "11. Приостановление и прекращение учётной записи",
  "legal.terms.s11.body1": "В случае нарушения настоящего Соглашения",
  "legal.terms.s11.body2":
    "имеет право приостановить или закрыть учётную запись Пользователя. Пользователь также может в любое время подать запрос на закрытие своей учётной записи. Закрытие учётной записи не отменяет возникших правовых обязательств и текущих операций.",

  "legal.terms.s12.title": "12. Уступка Соглашения и делимость",
  "legal.terms.s12.body1": "Пользователь не может уступать права и обязанности, вытекающие из настоящего Соглашения, без письменного согласия",
  "legal.terms.s12.body2":
    "Недействительность какого-либо положения Соглашения не влияет на действительность остальных положений.",

  "legal.terms.s13.title": "13. Уведомления",
  "legal.terms.s13.body1":
    "направляет свои уведомления Пользователю посредством внутриплатформенных уведомлений, зарегистрированного адреса электронной почты или публикации на Платформе. Пользователь обязан поддерживать свои контактные данные в актуальном состоянии.",

  "legal.terms.s14.title": "14. Изменения Соглашения",
  "legal.terms.s14.body1":
    "оставляет за собой право обновлять настоящее Соглашение. Актуальная версия вступает в силу в момент её публикации на этой странице. При существенных изменениях Пользователь информируется надлежащими способами.",

  "legal.terms.s15.title": "15. Применимое право и юрисдикция",
  "legal.terms.s15.body":
    "Настоящее Соглашение регулируется законодательством Турецкой Республики. В спорах юрисдикцией обладают Потребительские арбитражные комитеты и Потребительские суды в соответствии с денежными лимитами, объявленными Министерством торговли.",

  "legal.terms.s16.title": "16. Контакты",
  "legal.terms.s16.body1": "По вопросам, связанным с Соглашением, вы можете связаться с нами через страницу",
  "legal.terms.s16.link": "Контакты",
  "legal.terms.s16.body2": "или по адресу {email}.",
};
