import type { Dict } from "./core";

// i18n parça dosyası — server action / lib mesajları. dictionaries.ts birleştirir.
// PREFIX: srv.co.* = checkout, srv.wa.* = wallet, srv.or.* = orders.

export const tr: Dict = {
  // ── checkout (srv.co.*) ──
  "srv.co.err.insufficientBalance":
    "Bakiyeniz yetersiz. Lütfen cüzdanınıza yükleme yapın.",
  "srv.co.err.outOfStock": "Bu ürün için yeterli stok yok.",
  "srv.co.err.variantNotFound": "Seçenek bulunamadı.",
  "srv.co.err.productInactive": "Bu ürün artık satışta değil.",
  "srv.co.err.userNotFound": "Hesabınız bulunamadı.",
  "srv.co.err.emptyCart": "Sepetiniz boş.",
  "srv.co.err.invalidQty": "Geçersiz adet.",
  "srv.co.err.generic": "Satın alma sırasında bir hata oluştu.",
  "srv.co.err.invalidRequest": "Geçersiz istek.",
  "srv.co.err.invalidCart": "Geçersiz sepet.",
  "srv.co.err.enterPlayerId": "Lütfen oyuncu/hesap ID'sini gir.",
  "srv.co.err.enterLink": "Lütfen hedef profil/video linkini gir.",
  "srv.co.err.notSupplyable": "Bu ürün şu an tedarik edilemiyor.",
  "srv.co.err.orderNotCreated": "Sipariş oluşturulamadı.",
  "srv.co.err.refunded": "Tutar iade edildi.",
  "srv.co.err.deliveryNotSaved": "Teslim kaydedilemedi, tutar iade edildi.",
  "srv.co.notify.orderReadyTitle": "{label} siparişin hazır",
  "srv.co.notify.topupReadyBody": "Yükleme tamamlandı. Detay için tıkla.",
  "srv.co.notify.codeReadyBody": "Kodun teslim edildi. Görüntülemek için tıkla.",
  "srv.co.notify.preparingTitle": "{label} siparişin hazırlanıyor",
  "srv.co.notify.preparingBody":
    "Siparişin alındı, ekibimiz en kısa sürede teslim edecek. Tamamlanınca bildirim alacaksın.",
  "srv.co.notify.pendingAdminTitle": "Yeni bekleyen teslimat",
  "srv.co.notify.pendingAdminBody": "{label} elle teslim bekliyor.",
  "srv.co.notify.pendingAdminPlayer": " · Oyuncu: {playerId}",
  "srv.co.notify.startFailedTitle": "Sipariş başlatılamadı",
  "srv.co.notify.refundBody": "{name}: {error} Tutar bakiyene iade edildi.",
  "srv.co.order.deliveringNote": "Sipariş alındı, teslim ediliyor.",
  "srv.co.notify.processingTitle": "{name} siparişin işleniyor",
  "srv.co.notify.processingBody":
    "Sosyal medya siparişin alındı. Teslim genellikle kısa sürede başlar; tamamlanınca bildirim alacaksın.",
  "srv.co.notify.failedTitle": "Sipariş tamamlanamadı",
  "srv.co.notify.cartReadyTitleMulti": "{count} siparişin hazır",
  "srv.co.notify.cartReadyTitleSingle": "Siparişin hazır",
  "srv.co.notify.cartReadyBody":
    "Sepetindeki kodlar teslim edildi. Görüntülemek için tıkla.",

  // ── wallet (srv.wa.*) ──
  "srv.wa.err.amountRange": "Tutar 10₺ ile 5000₺ arasında olmalı.",
  "srv.wa.err.topupGeneric": "Yükleme sırasında bir hata oluştu.",
  "srv.wa.notify.topupTitle": "Cüzdanına {total} yüklendi",
  "srv.wa.notify.topupBody": "{methodText}{bonusText}Yeni bakiye: {balance}.",
  "srv.wa.notify.topupBonusText": "{amount} yükleme + {bonus} bonus. ",
  "srv.wa.notify.referralTitle": "Referans bonusu kazandın! 🎉",
  "srv.wa.notify.referralBody":
    "Davet ettiğin arkadaşın ilk yüklemesini yaptı, bonusun cüzdanına eklendi.",
  "srv.wa.notify.welcomeTitle": "Hoş geldin bonusun cüzdanında! 🎁",
  "srv.wa.notify.welcomeBody":
    "Davet linkiyle katıldığın için bonus bakiyen tanımlandı.",
  "srv.wa.notify.milestoneTitle": "Kademe ödülü kazandın! 🏆",
  "srv.wa.notify.milestoneBody":
    "Davet kademeni tamamladın, cüzdanına +{extra}₺ ekstra bonus eklendi.",

  // ── orders (srv.or.*) ──
  "srv.or.err.invalidRequest": "Geçersiz istek.",
  "srv.or.err.codeNotShown": "Kod görüntülenemedi.",
};

export const en: Dict = {
  // ── checkout (srv.co.*) ──
  "srv.co.err.insufficientBalance":
    "Insufficient balance. Please top up your wallet.",
  "srv.co.err.outOfStock": "Not enough stock for this product.",
  "srv.co.err.variantNotFound": "Option not found.",
  "srv.co.err.productInactive": "This product is no longer on sale.",
  "srv.co.err.userNotFound": "Your account was not found.",
  "srv.co.err.emptyCart": "Your cart is empty.",
  "srv.co.err.invalidQty": "Invalid quantity.",
  "srv.co.err.generic": "An error occurred during the purchase.",
  "srv.co.err.invalidRequest": "Invalid request.",
  "srv.co.err.invalidCart": "Invalid cart.",
  "srv.co.err.enterPlayerId": "Please enter the player/account ID.",
  "srv.co.err.enterLink": "Please enter the target profile/video link.",
  "srv.co.err.notSupplyable": "This product cannot be supplied right now.",
  "srv.co.err.orderNotCreated": "The order could not be created.",
  "srv.co.err.refunded": "The amount has been refunded.",
  "srv.co.err.deliveryNotSaved":
    "Delivery could not be saved, the amount has been refunded.",
  "srv.co.notify.orderReadyTitle": "Your {label} order is ready",
  "srv.co.notify.topupReadyBody": "Top-up completed. Tap for details.",
  "srv.co.notify.codeReadyBody": "Your code has been delivered. Tap to view.",
  "srv.co.notify.preparingTitle": "Your {label} order is being prepared",
  "srv.co.notify.preparingBody":
    "Your order has been received, our team will deliver it as soon as possible. You will be notified when it is completed.",
  "srv.co.notify.pendingAdminTitle": "New pending delivery",
  "srv.co.notify.pendingAdminBody": "{label} is awaiting manual delivery.",
  "srv.co.notify.pendingAdminPlayer": " · Player: {playerId}",
  "srv.co.notify.startFailedTitle": "Order could not be started",
  "srv.co.notify.refundBody":
    "{name}: {error} The amount has been refunded to your balance.",
  "srv.co.order.deliveringNote": "Order received, delivery in progress.",
  "srv.co.notify.processingTitle": "Your {name} order is being processed",
  "srv.co.notify.processingBody":
    "Your social media order has been received. Delivery usually starts shortly; you will be notified when it is completed.",
  "srv.co.notify.failedTitle": "Order could not be completed",
  "srv.co.notify.cartReadyTitleMulti": "Your {count} orders are ready",
  "srv.co.notify.cartReadyTitleSingle": "Your order is ready",
  "srv.co.notify.cartReadyBody":
    "The codes in your cart have been delivered. Tap to view.",

  // ── wallet (srv.wa.*) ──
  "srv.wa.err.amountRange": "The amount must be between ₺10 and ₺5000.",
  "srv.wa.err.topupGeneric": "An error occurred during the top-up.",
  "srv.wa.notify.topupTitle": "{total} added to your wallet",
  "srv.wa.notify.topupBody": "{methodText}{bonusText}New balance: {balance}.",
  "srv.wa.notify.topupBonusText": "{amount} top-up + {bonus} bonus. ",
  "srv.wa.notify.referralTitle": "You earned a referral bonus! 🎉",
  "srv.wa.notify.referralBody":
    "The friend you invited made their first top-up, your bonus has been added to your wallet.",
  "srv.wa.notify.welcomeTitle": "Your welcome bonus is in your wallet! 🎁",
  "srv.wa.notify.welcomeBody":
    "Your bonus balance has been credited for joining via an invite link.",
  "srv.wa.notify.milestoneTitle": "You earned a tier reward! 🏆",
  "srv.wa.notify.milestoneBody":
    "You completed your invite tier, an extra bonus of +₺{extra} has been added to your wallet.",

  // ── orders (srv.or.*) ──
  "srv.or.err.invalidRequest": "Invalid request.",
  "srv.or.err.codeNotShown": "The code could not be displayed.",
};

export const de: Dict = {
  // ── checkout (srv.co.*) ──
  "srv.co.err.insufficientBalance":
    "Guthaben unzureichend. Bitte lade dein Wallet auf.",
  "srv.co.err.outOfStock": "Nicht genügend Bestand für dieses Produkt.",
  "srv.co.err.variantNotFound": "Option nicht gefunden.",
  "srv.co.err.productInactive": "Dieses Produkt ist nicht mehr im Verkauf.",
  "srv.co.err.userNotFound": "Dein Konto wurde nicht gefunden.",
  "srv.co.err.emptyCart": "Dein Warenkorb ist leer.",
  "srv.co.err.invalidQty": "Ungültige Menge.",
  "srv.co.err.generic": "Beim Kauf ist ein Fehler aufgetreten.",
  "srv.co.err.invalidRequest": "Ungültige Anfrage.",
  "srv.co.err.invalidCart": "Ungültiger Warenkorb.",
  "srv.co.err.enterPlayerId": "Bitte gib die Spieler-/Konto-ID ein.",
  "srv.co.err.enterLink": "Bitte gib den Ziel-Profil-/Video-Link ein.",
  "srv.co.err.notSupplyable":
    "Dieses Produkt kann derzeit nicht bereitgestellt werden.",
  "srv.co.err.orderNotCreated": "Die Bestellung konnte nicht erstellt werden.",
  "srv.co.err.refunded": "Der Betrag wurde erstattet.",
  "srv.co.err.deliveryNotSaved":
    "Die Lieferung konnte nicht gespeichert werden, der Betrag wurde erstattet.",
  "srv.co.notify.orderReadyTitle": "Deine Bestellung {label} ist bereit",
  "srv.co.notify.topupReadyBody":
    "Aufladung abgeschlossen. Für Details tippen.",
  "srv.co.notify.codeReadyBody":
    "Dein Code wurde geliefert. Zum Anzeigen tippen.",
  "srv.co.notify.preparingTitle": "Deine Bestellung {label} wird vorbereitet",
  "srv.co.notify.preparingBody":
    "Deine Bestellung ist eingegangen, unser Team liefert sie schnellstmöglich. Du wirst benachrichtigt, sobald sie abgeschlossen ist.",
  "srv.co.notify.pendingAdminTitle": "Neue ausstehende Lieferung",
  "srv.co.notify.pendingAdminBody": "{label} wartet auf manuelle Lieferung.",
  "srv.co.notify.pendingAdminPlayer": " · Spieler: {playerId}",
  "srv.co.notify.startFailedTitle": "Bestellung konnte nicht gestartet werden",
  "srv.co.notify.refundBody":
    "{name}: {error} Der Betrag wurde deinem Guthaben erstattet.",
  "srv.co.order.deliveringNote": "Bestellung eingegangen, Lieferung läuft.",
  "srv.co.notify.processingTitle": "Deine Bestellung {name} wird bearbeitet",
  "srv.co.notify.processingBody":
    "Deine Social-Media-Bestellung ist eingegangen. Die Lieferung beginnt meist in Kürze; du wirst benachrichtigt, sobald sie abgeschlossen ist.",
  "srv.co.notify.failedTitle": "Bestellung konnte nicht abgeschlossen werden",
  "srv.co.notify.cartReadyTitleMulti": "Deine {count} Bestellungen sind bereit",
  "srv.co.notify.cartReadyTitleSingle": "Deine Bestellung ist bereit",
  "srv.co.notify.cartReadyBody":
    "Die Codes in deinem Warenkorb wurden geliefert. Zum Anzeigen tippen.",

  // ── wallet (srv.wa.*) ──
  "srv.wa.err.amountRange": "Der Betrag muss zwischen 10 ₺ und 5000 ₺ liegen.",
  "srv.wa.err.topupGeneric": "Bei der Aufladung ist ein Fehler aufgetreten.",
  "srv.wa.notify.topupTitle": "{total} zu deinem Wallet hinzugefügt",
  "srv.wa.notify.topupBody":
    "{methodText}{bonusText}Neues Guthaben: {balance}.",
  "srv.wa.notify.topupBonusText": "{amount} Aufladung + {bonus} Bonus. ",
  "srv.wa.notify.referralTitle": "Du hast einen Empfehlungsbonus erhalten! 🎉",
  "srv.wa.notify.referralBody":
    "Der von dir eingeladene Freund hat seine erste Aufladung vorgenommen, dein Bonus wurde deinem Wallet gutgeschrieben.",
  "srv.wa.notify.welcomeTitle": "Dein Willkommensbonus ist in deinem Wallet! 🎁",
  "srv.wa.notify.welcomeBody":
    "Dein Bonusguthaben wurde gutgeschrieben, weil du über einen Einladungslink beigetreten bist.",
  "srv.wa.notify.milestoneTitle": "Du hast eine Stufenbelohnung erhalten! 🏆",
  "srv.wa.notify.milestoneBody":
    "Du hast deine Einladungsstufe abgeschlossen, ein zusätzlicher Bonus von +{extra} ₺ wurde deinem Wallet hinzugefügt.",

  // ── orders (srv.or.*) ──
  "srv.or.err.invalidRequest": "Ungültige Anfrage.",
  "srv.or.err.codeNotShown": "Der Code konnte nicht angezeigt werden.",
};

export const ar: Dict = {
  // ── checkout (srv.co.*) ──
  "srv.co.err.insufficientBalance": "رصيدك غير كافٍ. يرجى شحن محفظتك.",
  "srv.co.err.outOfStock": "لا يوجد مخزون كافٍ لهذا المنتج.",
  "srv.co.err.variantNotFound": "الخيار غير موجود.",
  "srv.co.err.productInactive": "هذا المنتج لم يعد معروضًا للبيع.",
  "srv.co.err.userNotFound": "لم يتم العثور على حسابك.",
  "srv.co.err.emptyCart": "سلتك فارغة.",
  "srv.co.err.invalidQty": "كمية غير صالحة.",
  "srv.co.err.generic": "حدث خطأ أثناء عملية الشراء.",
  "srv.co.err.invalidRequest": "طلب غير صالح.",
  "srv.co.err.invalidCart": "سلة غير صالحة.",
  "srv.co.err.enterPlayerId": "يرجى إدخال معرّف اللاعب/الحساب.",
  "srv.co.err.enterLink": "يرجى إدخال رابط الملف الشخصي/الفيديو المستهدف.",
  "srv.co.err.notSupplyable": "لا يمكن توفير هذا المنتج في الوقت الحالي.",
  "srv.co.err.orderNotCreated": "تعذّر إنشاء الطلب.",
  "srv.co.err.refunded": "تمت إعادة المبلغ.",
  "srv.co.err.deliveryNotSaved": "تعذّر حفظ التسليم، وتمت إعادة المبلغ.",
  "srv.co.notify.orderReadyTitle": "طلبك {label} جاهز",
  "srv.co.notify.topupReadyBody": "اكتمل الشحن. اضغط لعرض التفاصيل.",
  "srv.co.notify.codeReadyBody": "تم تسليم الكود الخاص بك. اضغط للعرض.",
  "srv.co.notify.preparingTitle": "جارٍ تجهيز طلبك {label}",
  "srv.co.notify.preparingBody":
    "تم استلام طلبك، وسيقوم فريقنا بتسليمه في أقرب وقت ممكن. ستتلقى إشعارًا عند اكتماله.",
  "srv.co.notify.pendingAdminTitle": "تسليم معلّق جديد",
  "srv.co.notify.pendingAdminBody": "{label} في انتظار التسليم اليدوي.",
  "srv.co.notify.pendingAdminPlayer": " · اللاعب: {playerId}",
  "srv.co.notify.startFailedTitle": "تعذّر بدء الطلب",
  "srv.co.notify.refundBody": "{name}: {error} تمت إعادة المبلغ إلى رصيدك.",
  "srv.co.order.deliveringNote": "تم استلام الطلب، التسليم قيد التنفيذ.",
  "srv.co.notify.processingTitle": "جارٍ معالجة طلبك {name}",
  "srv.co.notify.processingBody":
    "تم استلام طلبك على وسائل التواصل الاجتماعي. يبدأ التسليم عادةً خلال وقت قصير؛ ستتلقى إشعارًا عند اكتماله.",
  "srv.co.notify.failedTitle": "تعذّر إتمام الطلب",
  "srv.co.notify.cartReadyTitleMulti": "طلباتك الـ {count} جاهزة",
  "srv.co.notify.cartReadyTitleSingle": "طلبك جاهز",
  "srv.co.notify.cartReadyBody":
    "تم تسليم الأكواد الموجودة في سلتك. اضغط للعرض.",

  // ── wallet (srv.wa.*) ──
  "srv.wa.err.amountRange": "يجب أن يكون المبلغ بين 10₺ و5000₺.",
  "srv.wa.err.topupGeneric": "حدث خطأ أثناء الشحن.",
  "srv.wa.notify.topupTitle": "تمت إضافة {total} إلى محفظتك",
  "srv.wa.notify.topupBody": "{methodText}{bonusText}الرصيد الجديد: {balance}.",
  "srv.wa.notify.topupBonusText": "{amount} شحن + {bonus} مكافأة. ",
  "srv.wa.notify.referralTitle": "لقد ربحت مكافأة إحالة! 🎉",
  "srv.wa.notify.referralBody":
    "قام الصديق الذي دعوته بأول عملية شحن، وتمت إضافة مكافأتك إلى محفظتك.",
  "srv.wa.notify.welcomeTitle": "مكافأة الترحيب في محفظتك! 🎁",
  "srv.wa.notify.welcomeBody":
    "تم إضافة رصيد المكافأة لانضمامك عبر رابط دعوة.",
  "srv.wa.notify.milestoneTitle": "لقد ربحت مكافأة مستوى! 🏆",
  "srv.wa.notify.milestoneBody":
    "لقد أكملت مستوى الدعوة الخاص بك، وتمت إضافة مكافأة إضافية بقيمة +{extra}₺ إلى محفظتك.",

  // ── orders (srv.or.*) ──
  "srv.or.err.invalidRequest": "طلب غير صالح.",
  "srv.or.err.codeNotShown": "تعذّر عرض الكود.",
};

export const ru: Dict = {
  // ── checkout (srv.co.*) ──
  "srv.co.err.insufficientBalance":
    "Недостаточно средств. Пожалуйста, пополните кошелёк.",
  "srv.co.err.outOfStock": "Недостаточно товара на складе.",
  "srv.co.err.variantNotFound": "Вариант не найден.",
  "srv.co.err.productInactive": "Этот товар больше не продаётся.",
  "srv.co.err.userNotFound": "Ваш аккаунт не найден.",
  "srv.co.err.emptyCart": "Ваша корзина пуста.",
  "srv.co.err.invalidQty": "Недопустимое количество.",
  "srv.co.err.generic": "Произошла ошибка при покупке.",
  "srv.co.err.invalidRequest": "Недопустимый запрос.",
  "srv.co.err.invalidCart": "Недопустимая корзина.",
  "srv.co.err.enterPlayerId": "Пожалуйста, введите ID игрока/аккаунта.",
  "srv.co.err.enterLink": "Пожалуйста, введите ссылку на профиль/видео.",
  "srv.co.err.notSupplyable": "Этот товар сейчас невозможно предоставить.",
  "srv.co.err.orderNotCreated": "Не удалось создать заказ.",
  "srv.co.err.refunded": "Сумма возвращена.",
  "srv.co.err.deliveryNotSaved":
    "Не удалось сохранить доставку, сумма возвращена.",
  "srv.co.notify.orderReadyTitle": "Ваш заказ {label} готов",
  "srv.co.notify.topupReadyBody": "Пополнение завершено. Нажмите для деталей.",
  "srv.co.notify.codeReadyBody":
    "Ваш код доставлен. Нажмите, чтобы посмотреть.",
  "srv.co.notify.preparingTitle": "Ваш заказ {label} готовится",
  "srv.co.notify.preparingBody":
    "Ваш заказ получен, наша команда доставит его как можно скорее. Вы получите уведомление по завершении.",
  "srv.co.notify.pendingAdminTitle": "Новая ожидающая доставка",
  "srv.co.notify.pendingAdminBody": "{label} ожидает ручной доставки.",
  "srv.co.notify.pendingAdminPlayer": " · Игрок: {playerId}",
  "srv.co.notify.startFailedTitle": "Не удалось начать заказ",
  "srv.co.notify.refundBody": "{name}: {error} Сумма возвращена на ваш баланс.",
  "srv.co.order.deliveringNote": "Заказ получен, идёт доставка.",
  "srv.co.notify.processingTitle": "Ваш заказ {name} обрабатывается",
  "srv.co.notify.processingBody":
    "Ваш заказ в социальных сетях получен. Доставка обычно начинается в ближайшее время; вы получите уведомление по завершении.",
  "srv.co.notify.failedTitle": "Не удалось завершить заказ",
  "srv.co.notify.cartReadyTitleMulti": "Ваши заказы ({count}) готовы",
  "srv.co.notify.cartReadyTitleSingle": "Ваш заказ готов",
  "srv.co.notify.cartReadyBody":
    "Коды из вашей корзины доставлены. Нажмите, чтобы посмотреть.",

  // ── wallet (srv.wa.*) ──
  "srv.wa.err.amountRange": "Сумма должна быть от 10₺ до 5000₺.",
  "srv.wa.err.topupGeneric": "Произошла ошибка при пополнении.",
  "srv.wa.notify.topupTitle": "{total} зачислено на ваш кошелёк",
  "srv.wa.notify.topupBody":
    "{methodText}{bonusText}Новый баланс: {balance}.",
  "srv.wa.notify.topupBonusText": "{amount} пополнение + {bonus} бонус. ",
  "srv.wa.notify.referralTitle": "Вы получили реферальный бонус! 🎉",
  "srv.wa.notify.referralBody":
    "Приглашённый вами друг совершил первое пополнение, ваш бонус зачислен на кошелёк.",
  "srv.wa.notify.welcomeTitle": "Ваш приветственный бонус в кошельке! 🎁",
  "srv.wa.notify.welcomeBody":
    "Ваш бонусный баланс начислен за присоединение по реферальной ссылке.",
  "srv.wa.notify.milestoneTitle": "Вы получили награду уровня! 🏆",
  "srv.wa.notify.milestoneBody":
    "Вы завершили свой уровень приглашений, на ваш кошелёк добавлен дополнительный бонус +{extra}₺.",

  // ── orders (srv.or.*) ──
  "srv.or.err.invalidRequest": "Недопустимый запрос.",
  "srv.or.err.codeNotShown": "Не удалось отобразить код.",
};
