import type { Dict } from "./core";

// Error boundary (error.tsx) ve 404 (not-found.tsx) sayfaları + generateMetadata
// notFound fallback başlıkları (yayıncı/marka/haber). Prefix: err.* ve nf.*

export const tr: Dict = {
  "err.title": "Bir şeyler ters gitti",
  "err.desc":
    "Beklenmedik bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.",
  "err.retry": "Tekrar dene",
  "err.home": "Ana sayfa",
  "nf.code": "404",
  "nf.title": "Sayfa bulunamadı",
  "nf.desc":
    "Aradığın sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.",
  "nf.home": "Ana sayfaya dön",
  "nf.store": "Mağazaya git",
  "nf.publisher": "Yayıncı bulunamadı",
  "nf.brand": "Marka bulunamadı",
  "nf.news": "Haber bulunamadı",
};

export const en: Dict = {
  "err.title": "Something went wrong",
  "err.desc":
    "An unexpected error occurred. You can try again or return to the homepage.",
  "err.retry": "Try again",
  "err.home": "Home",
  "nf.code": "404",
  "nf.title": "Page not found",
  "nf.desc":
    "The page you're looking for may have been moved, deleted, or never existed.",
  "nf.home": "Back to home",
  "nf.store": "Go to store",
  "nf.publisher": "Publisher not found",
  "nf.brand": "Brand not found",
  "nf.news": "Article not found",
};

export const de: Dict = {
  "err.title": "Etwas ist schiefgelaufen",
  "err.desc":
    "Ein unerwarteter Fehler ist aufgetreten. Du kannst es erneut versuchen oder zur Startseite zurückkehren.",
  "err.retry": "Erneut versuchen",
  "err.home": "Startseite",
  "nf.code": "404",
  "nf.title": "Seite nicht gefunden",
  "nf.desc":
    "Die gesuchte Seite wurde möglicherweise verschoben, gelöscht oder hat nie existiert.",
  "nf.home": "Zur Startseite",
  "nf.store": "Zum Shop",
  "nf.publisher": "Herausgeber nicht gefunden",
  "nf.brand": "Marke nicht gefunden",
  "nf.news": "Artikel nicht gefunden",
};

export const ar: Dict = {
  "err.title": "حدث خطأ ما",
  "err.desc":
    "حدث خطأ غير متوقع. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.",
  "err.retry": "حاول مرة أخرى",
  "err.home": "الصفحة الرئيسية",
  "nf.code": "404",
  "nf.title": "الصفحة غير موجودة",
  "nf.desc":
    "ربما تم نقل الصفحة التي تبحث عنها أو حذفها أو لم تكن موجودة من الأساس.",
  "nf.home": "العودة إلى الرئيسية",
  "nf.store": "الذهاب إلى المتجر",
  "nf.publisher": "الناشر غير موجود",
  "nf.brand": "العلامة التجارية غير موجودة",
  "nf.news": "المقال غير موجود",
};

export const ru: Dict = {
  "err.title": "Что-то пошло не так",
  "err.desc":
    "Произошла непредвиденная ошибка. Вы можете повторить попытку или вернуться на главную страницу.",
  "err.retry": "Повторить",
  "err.home": "Главная",
  "nf.code": "404",
  "nf.title": "Страница не найдена",
  "nf.desc":
    "Возможно, страница была перемещена, удалена или никогда не существовала.",
  "nf.home": "Вернуться на главную",
  "nf.store": "Перейти в магазин",
  "nf.publisher": "Издатель не найден",
  "nf.brand": "Бренд не найден",
  "nf.news": "Новость не найдена",
};
