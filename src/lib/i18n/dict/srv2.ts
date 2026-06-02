import type { Dict } from "./core";

// i18n parça dosyası — server action / lib mesajları. dictionaries.ts birleştirir.
// Alt-prefix: srv.pr.* (profile), srv.ky.* (kyc), srv.rv.* (reviews),
// srv.fv.* (favorites), srv.pl.* (player-accounts).

export const tr: Dict = {
  // profile
  "srv.pr.nicknameMin": "En az 3 karakter olmalı.",
  "srv.pr.nicknameMax": "En fazla 32 karakter.",
  "srv.pr.nicknameChars": "Sadece harf, rakam, nokta, tire ve alt çizgi.",
  "srv.pr.nicknameTaken": "Bu kullanıcı adı kullanılıyor.",
  "srv.pr.updateFailed": "Güncellenemedi.",
  "srv.pr.invalid": "Geçersiz.",
  "srv.pr.invalidAvatar": "Geçersiz avatar.",
  "srv.pr.invalidPhone": "Geçersiz telefon.",
  "srv.pr.invalidDate": "Geçersiz tarih.",
  "srv.reseller.phoneRequired": "Bayilik başvurusu için önce telefonunu doğrulamalısın.",
  // kyc
  "srv.ky.fileType": "Sadece JPG, PNG veya WEBP yükleyebilirsin.",
  "srv.ky.fileSize": "Dosya en fazla 5 MB olabilir.",
  "srv.ky.uploadFailed": "Belge yüklenemedi.",
  "srv.ky.fullNameRequired": "Ad soyad gerekli.",
  "srv.ky.invalidTc": "Geçersiz TC kimlik numarası.",
  "srv.ky.birthDateRequired": "Doğum tarihi gerekli.",
  "srv.ky.invalid": "Geçersiz.",
  "srv.ky.uploadFront": "Kimliğin ön yüzünü yükle.",
  "srv.ky.uploadBack": "Kimliğin arka yüzünü yükle.",
  "srv.ky.alreadyApproved": "Kimliğin zaten onaylı.",
  "srv.ky.underReview": "Başvurun inceleniyor, lütfen bekle.",
  "srv.ky.uploadError": "Yükleme hatası.",
  "srv.ky.submitFailed": "Başvuru kaydedilemedi.",
  // reviews
  "srv.rv.invalid": "Geçersiz yorum.",
  "srv.rv.mustPurchase": "Yorum yapmak için bu ürünü satın almış olmalısın.",
  "srv.rv.saveFailed": "Yorum kaydedilemedi.",
  "srv.rv.deleteFailed": "Yorum silinemedi.",
  // favorites
  "srv.fv.removeFailed": "Favori kaldırılamadı.",
  "srv.fv.addFailed": "Favorilere eklenemedi.",
  "srv.fv.genericError": "Bir hata oluştu.",
  // player-accounts
  "srv.pl.valueRequired": "Bir değer gir.",
  "srv.pl.invalid": "Geçersiz veri.",
  "srv.pl.saveFailed": "Kaydedilemedi.",
  "srv.pl.deleteFailed": "Silinemedi.",
};

export const en: Dict = {
  // profile
  "srv.pr.nicknameMin": "Must be at least 3 characters.",
  "srv.pr.nicknameMax": "32 characters maximum.",
  "srv.pr.nicknameChars": "Only letters, numbers, dots, hyphens and underscores.",
  "srv.pr.nicknameTaken": "This username is already taken.",
  "srv.pr.updateFailed": "Could not update.",
  "srv.pr.invalid": "Invalid.",
  "srv.pr.invalidAvatar": "Invalid avatar.",
  "srv.pr.invalidPhone": "Invalid phone number.",
  "srv.pr.invalidDate": "Invalid date.",
  "srv.reseller.phoneRequired": "You must verify your phone before applying as a reseller.",
  // kyc
  "srv.ky.fileType": "You can only upload JPG, PNG or WEBP.",
  "srv.ky.fileSize": "File can be at most 5 MB.",
  "srv.ky.uploadFailed": "Could not upload document.",
  "srv.ky.fullNameRequired": "Full name is required.",
  "srv.ky.invalidTc": "Invalid national ID number.",
  "srv.ky.birthDateRequired": "Date of birth is required.",
  "srv.ky.invalid": "Invalid.",
  "srv.ky.uploadFront": "Upload the front of your ID.",
  "srv.ky.uploadBack": "Upload the back of your ID.",
  "srv.ky.alreadyApproved": "Your ID is already approved.",
  "srv.ky.underReview": "Your application is under review, please wait.",
  "srv.ky.uploadError": "Upload error.",
  "srv.ky.submitFailed": "Could not save your application.",
  // reviews
  "srv.rv.invalid": "Invalid review.",
  "srv.rv.mustPurchase": "You must have purchased this product to review it.",
  "srv.rv.saveFailed": "Could not save your review.",
  "srv.rv.deleteFailed": "Could not delete your review.",
  // favorites
  "srv.fv.removeFailed": "Could not remove from favorites.",
  "srv.fv.addFailed": "Could not add to favorites.",
  "srv.fv.genericError": "An error occurred.",
  // player-accounts
  "srv.pl.valueRequired": "Enter a value.",
  "srv.pl.invalid": "Invalid data.",
  "srv.pl.saveFailed": "Could not save.",
  "srv.pl.deleteFailed": "Could not delete.",
};

export const de: Dict = {
  // profile
  "srv.pr.nicknameMin": "Muss mindestens 3 Zeichen lang sein.",
  "srv.pr.nicknameMax": "Maximal 32 Zeichen.",
  "srv.pr.nicknameChars": "Nur Buchstaben, Zahlen, Punkte, Bindestriche und Unterstriche.",
  "srv.pr.nicknameTaken": "Dieser Benutzername ist bereits vergeben.",
  "srv.pr.updateFailed": "Konnte nicht aktualisiert werden.",
  "srv.pr.invalid": "Ungültig.",
  "srv.pr.invalidAvatar": "Ungültiger Avatar.",
  "srv.pr.invalidPhone": "Ungültige Telefonnummer.",
  "srv.pr.invalidDate": "Ungültiges Datum.",
  "srv.reseller.phoneRequired": "Du musst dein Telefon verifizieren, bevor du dich als Händler bewirbst.",
  // kyc
  "srv.ky.fileType": "Du kannst nur JPG, PNG oder WEBP hochladen.",
  "srv.ky.fileSize": "Die Datei darf höchstens 5 MB groß sein.",
  "srv.ky.uploadFailed": "Dokument konnte nicht hochgeladen werden.",
  "srv.ky.fullNameRequired": "Vor- und Nachname erforderlich.",
  "srv.ky.invalidTc": "Ungültige Ausweisnummer.",
  "srv.ky.birthDateRequired": "Geburtsdatum erforderlich.",
  "srv.ky.invalid": "Ungültig.",
  "srv.ky.uploadFront": "Lade die Vorderseite deines Ausweises hoch.",
  "srv.ky.uploadBack": "Lade die Rückseite deines Ausweises hoch.",
  "srv.ky.alreadyApproved": "Dein Ausweis ist bereits bestätigt.",
  "srv.ky.underReview": "Dein Antrag wird geprüft, bitte warte.",
  "srv.ky.uploadError": "Upload-Fehler.",
  "srv.ky.submitFailed": "Dein Antrag konnte nicht gespeichert werden.",
  // reviews
  "srv.rv.invalid": "Ungültige Bewertung.",
  "srv.rv.mustPurchase": "Du musst dieses Produkt gekauft haben, um es zu bewerten.",
  "srv.rv.saveFailed": "Bewertung konnte nicht gespeichert werden.",
  "srv.rv.deleteFailed": "Bewertung konnte nicht gelöscht werden.",
  // favorites
  "srv.fv.removeFailed": "Konnte nicht aus Favoriten entfernt werden.",
  "srv.fv.addFailed": "Konnte nicht zu Favoriten hinzugefügt werden.",
  "srv.fv.genericError": "Ein Fehler ist aufgetreten.",
  // player-accounts
  "srv.pl.valueRequired": "Gib einen Wert ein.",
  "srv.pl.invalid": "Ungültige Daten.",
  "srv.pl.saveFailed": "Konnte nicht gespeichert werden.",
  "srv.pl.deleteFailed": "Konnte nicht gelöscht werden.",
};

export const ar: Dict = {
  // profile
  "srv.pr.nicknameMin": "يجب أن يكون 3 أحرف على الأقل.",
  "srv.pr.nicknameMax": "32 حرفًا كحد أقصى.",
  "srv.pr.nicknameChars": "أحرف وأرقام ونقاط وشرطات وشرطات سفلية فقط.",
  "srv.pr.nicknameTaken": "اسم المستخدم هذا مستخدم بالفعل.",
  "srv.pr.updateFailed": "تعذّر التحديث.",
  "srv.pr.invalid": "غير صالح.",
  "srv.pr.invalidAvatar": "صورة رمزية غير صالحة.",
  "srv.pr.invalidPhone": "رقم هاتف غير صالح.",
  "srv.pr.invalidDate": "تاريخ غير صالح.",
  "srv.reseller.phoneRequired": "يجب التحقق من هاتفك قبل التقدّم كوكيل.",
  // kyc
  "srv.ky.fileType": "يمكنك رفع JPG أو PNG أو WEBP فقط.",
  "srv.ky.fileSize": "يجب ألا يتجاوز حجم الملف 5 ميغابايت.",
  "srv.ky.uploadFailed": "تعذّر رفع المستند.",
  "srv.ky.fullNameRequired": "الاسم الكامل مطلوب.",
  "srv.ky.invalidTc": "رقم هوية وطنية غير صالح.",
  "srv.ky.birthDateRequired": "تاريخ الميلاد مطلوب.",
  "srv.ky.invalid": "غير صالح.",
  "srv.ky.uploadFront": "ارفع الوجه الأمامي لهويتك.",
  "srv.ky.uploadBack": "ارفع الوجه الخلفي لهويتك.",
  "srv.ky.alreadyApproved": "هويتك معتمدة بالفعل.",
  "srv.ky.underReview": "طلبك قيد المراجعة، يرجى الانتظار.",
  "srv.ky.uploadError": "خطأ في الرفع.",
  "srv.ky.submitFailed": "تعذّر حفظ طلبك.",
  // reviews
  "srv.rv.invalid": "تقييم غير صالح.",
  "srv.rv.mustPurchase": "يجب أن تكون قد اشتريت هذا المنتج لتقييمه.",
  "srv.rv.saveFailed": "تعذّر حفظ التقييم.",
  "srv.rv.deleteFailed": "تعذّر حذف التقييم.",
  // favorites
  "srv.fv.removeFailed": "تعذّرت الإزالة من المفضلة.",
  "srv.fv.addFailed": "تعذّرت الإضافة إلى المفضلة.",
  "srv.fv.genericError": "حدث خطأ.",
  // player-accounts
  "srv.pl.valueRequired": "أدخل قيمة.",
  "srv.pl.invalid": "بيانات غير صالحة.",
  "srv.pl.saveFailed": "تعذّر الحفظ.",
  "srv.pl.deleteFailed": "تعذّر الحذف.",
};

export const ru: Dict = {
  // profile
  "srv.pr.nicknameMin": "Не менее 3 символов.",
  "srv.pr.nicknameMax": "Не более 32 символов.",
  "srv.pr.nicknameChars": "Только буквы, цифры, точки, дефисы и подчёркивания.",
  "srv.pr.nicknameTaken": "Это имя пользователя уже занято.",
  "srv.pr.updateFailed": "Не удалось обновить.",
  "srv.pr.invalid": "Недопустимо.",
  "srv.pr.invalidAvatar": "Недопустимый аватар.",
  "srv.pr.invalidPhone": "Недопустимый номер телефона.",
  "srv.pr.invalidDate": "Недопустимая дата.",
  "srv.reseller.phoneRequired": "Перед подачей заявки реселлера необходимо подтвердить телефон.",
  // kyc
  "srv.ky.fileType": "Можно загружать только JPG, PNG или WEBP.",
  "srv.ky.fileSize": "Файл может быть не более 5 МБ.",
  "srv.ky.uploadFailed": "Не удалось загрузить документ.",
  "srv.ky.fullNameRequired": "Укажите имя и фамилию.",
  "srv.ky.invalidTc": "Недопустимый номер удостоверения личности.",
  "srv.ky.birthDateRequired": "Укажите дату рождения.",
  "srv.ky.invalid": "Недопустимо.",
  "srv.ky.uploadFront": "Загрузите лицевую сторону удостоверения.",
  "srv.ky.uploadBack": "Загрузите обратную сторону удостоверения.",
  "srv.ky.alreadyApproved": "Ваше удостоверение уже подтверждено.",
  "srv.ky.underReview": "Ваша заявка на рассмотрении, пожалуйста, подождите.",
  "srv.ky.uploadError": "Ошибка загрузки.",
  "srv.ky.submitFailed": "Не удалось сохранить заявку.",
  // reviews
  "srv.rv.invalid": "Недопустимый отзыв.",
  "srv.rv.mustPurchase": "Чтобы оставить отзыв, нужно купить этот товар.",
  "srv.rv.saveFailed": "Не удалось сохранить отзыв.",
  "srv.rv.deleteFailed": "Не удалось удалить отзыв.",
  // favorites
  "srv.fv.removeFailed": "Не удалось удалить из избранного.",
  "srv.fv.addFailed": "Не удалось добавить в избранное.",
  "srv.fv.genericError": "Произошла ошибка.",
  // player-accounts
  "srv.pl.valueRequired": "Введите значение.",
  "srv.pl.invalid": "Недопустимые данные.",
  "srv.pl.saveFailed": "Не удалось сохранить.",
  "srv.pl.deleteFailed": "Не удалось удалить.",
};
