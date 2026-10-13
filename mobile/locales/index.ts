import { I18n } from "i18n-js";
import sr from "./sr";
import en from "./en";

const i18n = new I18n({ sr, en });
i18n.locale = "sr";
i18n.enableFallback = true;
i18n.defaultLocale = "sr";

export default i18n;