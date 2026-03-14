import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import el from "./el.json";
import en from "./en.json";

const deviceLang = navigator.language.startsWith("el") ? "el" : "en";
const savedLang = localStorage.getItem("lang") ?? deviceLang;

i18n.use(initReactI18next).init({
  resources: {
    el: { translation: el },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "el",
  interpolation: { escapeValue: false },
});

export default i18n;
