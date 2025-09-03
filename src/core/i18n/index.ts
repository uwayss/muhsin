// src/core/i18n/index.ts
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import en from "./en.json";
import ar from "./ar.json";
import { enUS as enUSLocale, ar as arLocale } from "date-fns/locale";

// Set the key-value pairs for the different languages you want to support.
const i18n = new I18n({
  en,
  ar,
});

export const dateLocales = {
  en: enUSLocale,
  ar: arLocale,
};

// Set the locale once at the beginning of your app.
const locales = Localization.getLocales();
const languageCode = locales[0]?.languageCode ?? "en";
i18n.locale = languageCode;

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

export default i18n;
