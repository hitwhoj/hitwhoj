import en_us from "./translations/en_us";

const fetchLangs = {
  "zh-CN": () => import("./translations/zh_cn"),
};

export type OtherLanguages = keyof typeof fetchLangs;
export type Languages = "en-US" | OtherLanguages;
export type Translations = typeof en_us;
export type TranslateKeys = keyof typeof en_us;

export function isValidLanguage(language: string) {
  if (language === "en-US") return true;
  return Object.keys(fetchLangs).indexOf(language) > -1;
}

const cachedLangs: { [K in OtherLanguages]?: Translations } = {};

export function getDefaultLanguage() {
  return en_us;
}

export function getAllLanguages() {
  return ["en-US"].concat(Object.keys(fetchLangs)) as Languages[];
}

export async function loadLanguage(lang: Languages) {
  if (lang === "en-US") {
    return en_us;
  }

  const cache = cachedLangs[lang];
  if (!cache) {
    const trans = (await fetchLangs[lang]()).default;
    cachedLangs[lang] = trans;
    return trans;
  }
  return cache;
}

const name: { [k in Languages]: string } = {
  "en-US": "English (US)",
  "zh-CN": "简体中文",
};

export function getLanguageName(lang: Languages) {
  return name[lang];
}
