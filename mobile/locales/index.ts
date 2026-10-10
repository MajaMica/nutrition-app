import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import sr from "./sr";
import en from "./en";

const i18n = new I18n({ sr, en });

const deviceLocale = getLocales()[0]?.languageCode ?? "sr";
i18n.locale = deviceLocale === "en" ? "en" : "sr";
i18n.enableFallback = true;
i18n.defaultLocale = "sr";

export default i18n;
export type TranslationKey = keyof typeof sr;