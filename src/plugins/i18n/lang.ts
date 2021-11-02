import en_us from "./translations/en_us";

const fetchLangs = {
  "zh-CN": () => import("./translations/zh_cn"),
};

export type OtherLanguages = keyof typeof fetchLangs;
export type Languages = "en-US" | OtherLanguages;
export type Translations = typeof en_us;
export type TranslateKeys = keyof typeof en_us;

const cachedLangs: { [K in OtherLanguages]?: Translations } = {};

export async function loadLanguage(lang: Languages) {
  if (lang === "en-US") {
    return;
  }

  if (!cachedLangs[lang]) {
    cachedLangs[lang] = (await fetchLangs[lang]()).default;
  }
}

const name: { [k in Languages]: string } = {
  "en-US": "English (US)",
  "zh-CN": "简体中文",
};

export function getLanguageName(lang: Languages) {
  return name[lang];
}

export function translate(
  lang: Languages,
  key: TranslateKeys,
  args: string[] = []
) {
  const trans = lang === "en-US" ? en_us : cachedLangs[lang];
  if (!trans) {
    console.warn(`Trying to translate before load the language ${lang}`);
    return "???";
  }

  const text = trans[key];
  if (!text) {
    console.warn(`Translate for ${key} in ${lang} is missing`);
    return "???";
  }

  return text.replace(/\{(\d+)\}/g, (_, i) => args[i]);
}
