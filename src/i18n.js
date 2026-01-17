import i18n from "i18next";
import Cookies from "js-cookie";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "@/utils/translation/en.json";
import es from "@/utils/translation/es.json";
import de from "@/utils/translation/de.json";
import bn from "@/utils/translation/bn.json";
import hi from "@/utils/translation/hi.json";

// Get default language from global settings or fallback to 'es'
const defaultLanguage = Cookies.get("i18next") || "es";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      de: { translation: de },
      bn: { translation: bn },
      hi: { translation: hi },
    },
    debug: true,
    lng: defaultLanguage, // 👈 Set starting language
    fallbackLng: "es", // 👈 Only fallback if missing translations
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "htmlTag", "navigator"], // 👈 Make cookie first priority
      caches: ["cookie"],
    },
  });
