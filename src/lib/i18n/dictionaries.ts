import type { Locale } from "./config";
import type { Dict } from "./dict/core";
import * as core from "./dict/core";
import * as store from "./dict/store";
import * as product from "./dict/product";
import * as pages from "./dict/pages";
import * as account from "./dict/account";
import * as account2 from "./dict/account2";
import * as misc from "./dict/misc";
import * as support from "./dict/support";
import * as accountpages from "./dict/accountpages";
import * as comp1 from "./dict/comp1";
import * as comp2 from "./dict/comp2";
import * as comp3 from "./dict/comp3";
import * as pages2 from "./dict/pages2";
import * as srv1 from "./dict/srv1";
import * as srv2 from "./dict/srv2";
import * as srv3 from "./dict/srv3";
import * as legal1 from "./dict/legal1";
import * as legal2 from "./dict/legal2";
import * as sitecfg from "./dict/sitecfg";
import * as auth from "./dict/auth";
import * as home2 from "./dict/home2";
import * as fixmisc from "./dict/fixmisc";
import * as errpage from "./dict/errpage";
import * as apidocs from "./dict/apidocs";

export type { Dict };

/**
 * Tüm sözlük parçalarını locale bazında birleştirir. Her parça dosyası
 * { tr, en, de, ar, ru } partial sözlükleri export eder; aynı anahtar varsa
 * sonra gelen kazanır (parçalar core'u override edebilir — normalde etmez).
 */
type DictModule = Partial<Record<Locale, Dict>>;
const MODULES: DictModule[] = [
  core,
  store,
  product,
  pages,
  account,
  account2,
  misc,
  support,
  accountpages,
  comp1,
  comp2,
  comp3,
  pages2,
  srv1,
  srv2,
  srv3,
  legal1,
  legal2,
  sitecfg,
  auth,
  home2,
  fixmisc,
  errpage,
  apidocs,
];

function mergeLocale(locale: Locale): Dict {
  return Object.assign({}, ...MODULES.map((m) => m[locale] ?? {}));
}

export const DICTIONARIES: Record<Locale, Dict> = {
  tr: mergeLocale("tr"),
  en: mergeLocale("en"),
  de: mergeLocale("de"),
  ar: mergeLocale("ar"),
  ru: mergeLocale("ru"),
};
