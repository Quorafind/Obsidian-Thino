import i18n from "i18next";

import { TRANSLATIONS_ZH } from "./zh/translations";
import { TRANSLATIONS_EN } from "./en/translations";

i18n
 .init({
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     zh: {
       translation: TRANSLATIONS_ZH
     }
   }
 });

i18n.changeLanguage("zh");