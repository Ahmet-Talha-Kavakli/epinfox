import type { Dict } from "./core";

// i18n parça dosyası — kullanıcıya görünen metinler. dictionaries.ts birleştirir.

export const tr: Dict = {
  // referral
  "p2.referral.title": "Referans",
  "p2.referral.description":
    "Arkadaşını davet et — ilk yüklemesini yaptığında ikiniz de {bonus}₺ bonus kazanın. Daha çok davet = kademe ödülleri.",
  "p2.referral.totalInvites": "Toplam Davet",
  "p2.referral.completed": "Tamamlanan",
  "p2.referral.totalEarned": "Toplam Kazanç",
  "p2.referral.tiersTitle": "Ödül Kademeleri",
  "p2.referral.nextTier": "Sıradaki: {n} davette",
  "p2.referral.allTiersDone": "Tüm kademeler tamam 🎉",
  "p2.referral.vip": "VIP",
  "p2.referral.motivationPre": "{n} başarılı davet daha →",
  "p2.referral.motivationReward": "{reward} ekstra bonus",
  "p2.referral.motivationPost": "kazanırsın!",
  "p2.referral.howTitle": "Nasıl çalışır?",
  "p2.referral.step1": "Davet linkini arkadaşınla paylaş.",
  "p2.referral.step2":
    "Arkadaşın bu linkle kayıt olup ilk bakiye yüklemesini yapsın.",
  "p2.referral.step3": "İkinizin de cüzdanına anında {bonus}₺ bonus tanımlansın.",
  "p2.referral.step4":
    "Davet sayın arttıkça kademe ödüllerini de otomatik kazan.",
  "p2.referral.tierRewardsLabel": "Kademe ödülleri:",
  "p2.referral.tierRewardItem": "{n} davet →",
  "p2.referral.vipSuffix": "(+VIP)",
  "p2.referral.tierRewardsNote":
    ". Bu bonuslar, her davetin {bonus}₺'sine ektir ve eşiğe ulaştığında bir kez verilir.",
  "p2.referral.invitedTitle": "Davet Ettiklerin",
  "p2.referral.emptyTitle": "Henüz kimseyi davet etmedin",
  "p2.referral.emptyDesc":
    "Linkini paylaş, ilk davetini al ve bonus kazanmaya başla.",
  "p2.referral.userFallback": "Kullanıcı",
  "p2.referral.bonusGranted": "Bonus verildi",
  "p2.referral.awaitingTopup": "Yükleme bekleniyor",
  // brand
  "p2.brand.store": "Mağaza",
  "p2.brand.productCount": "{n} ürün çeşidi",
  "p2.brand.productTypes": "Ürün Çeşitleri",
  "p2.brand.emptyTitle": "Bu markada ürün yok",
  "p2.brand.emptyDesc": "Yakında yeni ürünler eklenecek.",
  "p2.brand.emptyCta": "Mağazaya Dön",
  // haber etiketleri (content.ts NewsItem.tag → render'da çevrilir)
  "news.tag.update": "Güncelleme",
  "news.tag.announcement": "Duyuru",
  "news.tag.campaign": "Kampanya",
};

export const en: Dict = {
  // referral
  "p2.referral.title": "Referrals",
  "p2.referral.description":
    "Invite a friend — when they make their first top-up, you both earn a ₺{bonus} bonus. More invites = tier rewards.",
  "p2.referral.totalInvites": "Total Invites",
  "p2.referral.completed": "Completed",
  "p2.referral.totalEarned": "Total Earned",
  "p2.referral.tiersTitle": "Reward Tiers",
  "p2.referral.nextTier": "Next: at {n} invites",
  "p2.referral.allTiersDone": "All tiers complete 🎉",
  "p2.referral.vip": "VIP",
  "p2.referral.motivationPre": "{n} more successful invites →",
  "p2.referral.motivationReward": "{reward} extra bonus",
  "p2.referral.motivationPost": "you earn!",
  "p2.referral.howTitle": "How does it work?",
  "p2.referral.step1": "Share your invite link with a friend.",
  "p2.referral.step2":
    "Your friend signs up with this link and makes their first balance top-up.",
  "p2.referral.step3":
    "A ₺{bonus} bonus is instantly added to both of your wallets.",
  "p2.referral.step4":
    "As your invite count grows, automatically earn tier rewards too.",
  "p2.referral.tierRewardsLabel": "Tier rewards:",
  "p2.referral.tierRewardItem": "{n} invites →",
  "p2.referral.vipSuffix": "(+VIP)",
  "p2.referral.tierRewardsNote":
    ". These bonuses are on top of each invite's ₺{bonus} and are granted once when the threshold is reached.",
  "p2.referral.invitedTitle": "Who You've Invited",
  "p2.referral.emptyTitle": "You haven't invited anyone yet",
  "p2.referral.emptyDesc":
    "Share your link, get your first invite and start earning bonuses.",
  "p2.referral.userFallback": "User",
  "p2.referral.bonusGranted": "Bonus granted",
  "p2.referral.awaitingTopup": "Awaiting top-up",
  // brand
  "p2.brand.store": "Store",
  "p2.brand.productCount": "{n} product types",
  "p2.brand.productTypes": "Product Types",
  "p2.brand.emptyTitle": "No products for this brand",
  "p2.brand.emptyDesc": "New products will be added soon.",
  "p2.brand.emptyCta": "Back to Store",
  "news.tag.update": "Update",
  "news.tag.announcement": "Announcement",
  "news.tag.campaign": "Campaign",
};

export const de: Dict = {
  // referral
  "p2.referral.title": "Empfehlungen",
  "p2.referral.description":
    "Lade einen Freund ein — bei seiner ersten Aufladung erhaltet ihr beide einen Bonus von {bonus}₺. Mehr Einladungen = Stufenprämien.",
  "p2.referral.totalInvites": "Einladungen gesamt",
  "p2.referral.completed": "Abgeschlossen",
  "p2.referral.totalEarned": "Gesamtverdienst",
  "p2.referral.tiersTitle": "Prämienstufen",
  "p2.referral.nextTier": "Nächste: bei {n} Einladungen",
  "p2.referral.allTiersDone": "Alle Stufen erreicht 🎉",
  "p2.referral.vip": "VIP",
  "p2.referral.motivationPre": "{n} weitere erfolgreiche Einladungen →",
  "p2.referral.motivationReward": "{reward} Extra-Bonus",
  "p2.referral.motivationPost": "verdienst du!",
  "p2.referral.howTitle": "Wie funktioniert es?",
  "p2.referral.step1": "Teile deinen Einladungslink mit einem Freund.",
  "p2.referral.step2":
    "Dein Freund registriert sich über diesen Link und führt seine erste Aufladung durch.",
  "p2.referral.step3":
    "Beiden Wallets wird sofort ein Bonus von {bonus}₺ gutgeschrieben.",
  "p2.referral.step4":
    "Mit steigender Einladungszahl erhältst du automatisch auch Stufenprämien.",
  "p2.referral.tierRewardsLabel": "Stufenprämien:",
  "p2.referral.tierRewardItem": "{n} Einladungen →",
  "p2.referral.vipSuffix": "(+VIP)",
  "p2.referral.tierRewardsNote":
    ". Diese Boni kommen zusätzlich zu den {bonus}₺ pro Einladung und werden einmalig beim Erreichen der Schwelle gewährt.",
  "p2.referral.invitedTitle": "Deine Eingeladenen",
  "p2.referral.emptyTitle": "Du hast noch niemanden eingeladen",
  "p2.referral.emptyDesc":
    "Teile deinen Link, hol dir deine erste Einladung und beginne, Boni zu verdienen.",
  "p2.referral.userFallback": "Benutzer",
  "p2.referral.bonusGranted": "Bonus gewährt",
  "p2.referral.awaitingTopup": "Aufladung ausstehend",
  // brand
  "p2.brand.store": "Shop",
  "p2.brand.productCount": "{n} Produktarten",
  "p2.brand.productTypes": "Produktarten",
  "p2.brand.emptyTitle": "Keine Produkte für diese Marke",
  "p2.brand.emptyDesc": "Bald werden neue Produkte hinzugefügt.",
  "p2.brand.emptyCta": "Zurück zum Shop",
  "news.tag.update": "Update",
  "news.tag.announcement": "Ankündigung",
  "news.tag.campaign": "Kampagne",
};

export const ar: Dict = {
  // referral
  "p2.referral.title": "الإحالات",
  "p2.referral.description":
    "ادعُ صديقًا — عند إتمامه أول عملية شحن تكسبان معًا مكافأة بقيمة {bonus}₺. كلما زادت الدعوات زادت مكافآت المستويات.",
  "p2.referral.totalInvites": "إجمالي الدعوات",
  "p2.referral.completed": "مكتملة",
  "p2.referral.totalEarned": "إجمالي الأرباح",
  "p2.referral.tiersTitle": "مستويات المكافآت",
  "p2.referral.nextTier": "التالي: عند {n} دعوات",
  "p2.referral.allTiersDone": "اكتملت جميع المستويات 🎉",
  "p2.referral.vip": "VIP",
  "p2.referral.motivationPre": "{n} دعوات ناجحة أخرى ←",
  "p2.referral.motivationReward": "{reward} مكافأة إضافية",
  "p2.referral.motivationPost": "ستكسب!",
  "p2.referral.howTitle": "كيف تعمل؟",
  "p2.referral.step1": "شارك رابط الدعوة مع صديقك.",
  "p2.referral.step2":
    "ليسجّل صديقك عبر هذا الرابط ويقم بأول عملية شحن لرصيده.",
  "p2.referral.step3":
    "تُضاف مكافأة بقيمة {bonus}₺ فورًا إلى محفظة كل منكما.",
  "p2.referral.step4":
    "مع ازدياد عدد دعواتك اكسب مكافآت المستويات تلقائيًا أيضًا.",
  "p2.referral.tierRewardsLabel": "مكافآت المستويات:",
  "p2.referral.tierRewardItem": "{n} دعوات ←",
  "p2.referral.vipSuffix": "(+VIP)",
  "p2.referral.tierRewardsNote":
    ". هذه المكافآت إضافية فوق {bonus}₺ لكل دعوة وتُمنح مرة واحدة عند بلوغ الحد.",
  "p2.referral.invitedTitle": "من دعوتهم",
  "p2.referral.emptyTitle": "لم تدعُ أحدًا بعد",
  "p2.referral.emptyDesc":
    "شارك رابطك واحصل على أول دعوة وابدأ بكسب المكافآت.",
  "p2.referral.userFallback": "مستخدم",
  "p2.referral.bonusGranted": "تم منح المكافأة",
  "p2.referral.awaitingTopup": "بانتظار الشحن",
  // brand
  "p2.brand.store": "المتجر",
  "p2.brand.productCount": "{n} نوع منتج",
  "p2.brand.productTypes": "أنواع المنتجات",
  "p2.brand.emptyTitle": "لا توجد منتجات لهذه العلامة",
  "p2.brand.emptyDesc": "ستُضاف منتجات جديدة قريبًا.",
  "p2.brand.emptyCta": "العودة إلى المتجر",
  "news.tag.update": "تحديث",
  "news.tag.announcement": "إعلان",
  "news.tag.campaign": "حملة",
};

export const ru: Dict = {
  // referral
  "p2.referral.title": "Рефералы",
  "p2.referral.description":
    "Пригласи друга — когда он сделает первое пополнение, вы оба получите бонус {bonus}₺. Больше приглашений = уровневые награды.",
  "p2.referral.totalInvites": "Всего приглашений",
  "p2.referral.completed": "Завершено",
  "p2.referral.totalEarned": "Всего заработано",
  "p2.referral.tiersTitle": "Уровни наград",
  "p2.referral.nextTier": "Далее: на {n} приглашениях",
  "p2.referral.allTiersDone": "Все уровни пройдены 🎉",
  "p2.referral.vip": "VIP",
  "p2.referral.motivationPre": "Ещё {n} успешных приглашений →",
  "p2.referral.motivationReward": "{reward} доп. бонус",
  "p2.referral.motivationPost": "ты получишь!",
  "p2.referral.howTitle": "Как это работает?",
  "p2.referral.step1": "Поделись ссылкой-приглашением с другом.",
  "p2.referral.step2":
    "Друг регистрируется по этой ссылке и делает первое пополнение баланса.",
  "p2.referral.step3":
    "На оба ваших кошелька мгновенно начисляется бонус {bonus}₺.",
  "p2.referral.step4":
    "С ростом числа приглашений автоматически получай и уровневые награды.",
  "p2.referral.tierRewardsLabel": "Уровневые награды:",
  "p2.referral.tierRewardItem": "{n} приглашений →",
  "p2.referral.vipSuffix": "(+VIP)",
  "p2.referral.tierRewardsNote":
    ". Эти бонусы добавляются к {bonus}₺ за каждое приглашение и выдаются один раз при достижении порога.",
  "p2.referral.invitedTitle": "Кого ты пригласил",
  "p2.referral.emptyTitle": "Ты ещё никого не пригласил",
  "p2.referral.emptyDesc":
    "Поделись ссылкой, получи первое приглашение и начни зарабатывать бонусы.",
  "p2.referral.userFallback": "Пользователь",
  "p2.referral.bonusGranted": "Бонус начислен",
  "p2.referral.awaitingTopup": "Ожидание пополнения",
  // brand
  "p2.brand.store": "Магазин",
  "p2.brand.productCount": "{n} видов товаров",
  "p2.brand.productTypes": "Виды товаров",
  "p2.brand.emptyTitle": "У этого бренда нет товаров",
  "p2.brand.emptyDesc": "Скоро будут добавлены новые товары.",
  "p2.brand.emptyCta": "Назад в магазин",
  "news.tag.update": "Обновление",
  "news.tag.announcement": "Объявление",
  "news.tag.campaign": "Акция",
};
