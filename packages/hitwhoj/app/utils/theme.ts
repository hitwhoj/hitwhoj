import { signal } from "@preact/signals-react";

export const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
] as const;

export type Theme = typeof themes[number];

export const darkThemes: Theme[] = [
  "dark",
  "synthwave",
  "halloween",
  "forest",
  "aqua",
  "black",
  "luxury",
  "dracula",
  "business",
  "night",
  "coffee",
];

export const themeSignal = signal<Theme>("light");

function t(str: string) {
  const colors = str.split(" ").map((s) => `#${s}`);

  return {
    primary: colors[0],
    primaryContent: colors[1],
    secondary: colors[2],
    secondaryContent: colors[3],
    base100: colors[4],
    base200: colors[5],
    base300: colors[6],
    baseContent: colors[7],
  };
}

export const defaultThemeColor: Record<Theme, ReturnType<typeof t>> = {
  light: t("570df8 ffffff f000b8 ffffff ffffff f2f2f2 e5e6e6 1f2937"),
  dark: t("6419e6 ffffff d926a9 ffffff 2a303c 242933 1f242d a6adba"),
  cupcake: t("65c3c8 003a3d ef9fbc 52001e faf7f5 efeae6 e7e2df 291334"),
  bumblebee: t("e0a82e 18182f f9d72f 18182f ffffff e6e6e6 cfcfcf 333333"),
  emerald: t("66cc8a 233e31 377cfb f9fafb ffffff e6e6e6 cfcfcf 333c4d"),
  corporate: t("4b6bfb dbe2ff 7b92b2 00193d ffffff e6e6e6 cfcfcf 181a2a"),
  synthwave: t("e779c1 47002e 58c7f3 003042 2d1b69 28185d 251655 f9f7fd"),
  retro: t("ef9995 282425 a4cbb4 282425 e4d8b4 d2c59d c6b386 282425"),
  cyberpunk: t("ff7598 4d0013 75d1f0 003647 ffee00 e6d600 d1c300 333000"),
  valentine: t("e96d7b 420008 a992f7 12004d f0d6e8 e3b5d5 d897c5 632c3b"),
  halloween: t("f28c18 131616 6d3a9c e1c2ff 212121 1f1f1f 1a1a1a d4d4d4"),
  garden: t("5c7f67 c7ffd9 ecf4e7 24321a e9e7e7 d3cfcf bfbaba 100f0f"),
  forest: t("1eb854 c2ffd7 1fd65f 003312 171212 141010 141010 d7cccc"),
  aqua: t("09e9f1 005557 966fb3 ebd1ff 345ca8 2f5498 2a4b89 c7dbff"),
  lofi: t("0d0d0d ffffff 1a1919 ffffff ffffff f2f2f2 e6e5e5 000000"),
  pastel: t("d1c1d7 341141 f6cbd1 5c000c ffffff f9fafb d1d5db 333333"),
  fantasy: t("6e0b75 fab3ff 007ebd bde9ff ffffff e6e6e6 cfcfcf 1f2937"),
  wireframe: t("b8b8b8 242424 b8b8b8 242424 ffffff ededed dedede 333333"),
  black: t("343232 d8d4d4 343232 d8d4d4 000000 0d0d0d 1a1919 cccccc"),
  luxury: t("ffffff 333333 152747 adcbff 09090b 171618 2e2d2f dca54c"),
  dracula: t("ff7ac6 4d002b bf95f9 220052 272935 252732 21222c f8f8f2"),
  cmyk: t("44adee 00263d e9498c ffd6e7 ffffff e6e6e6 cfcfcf 333333"),
  autumn: t("8c0327 ffb8cb d75050 ffd6d6 f2f2f2 d9d9d9 c4c4c4 303030"),
  business: t("1c4f82 b8dbff 7d919b 002538 212121 1c1c1c 1a1a1a d4d4d4"),
  acid: t("ff00f2 ffccfc ff7300 331700 fafafa e0e0e0 c9c9c9 333333"),
  lemonade: t("529b03 dcffb8 e9e92f 383800 ffffff e6e6e6 cfcfcf 333333"),
  night: t("3abff8 002b3d 828df8 00084d 0f1729 0e1525 0c1322 b3c5ef"),
  coffee: t("dc944c 3d1f00 263f40 bbf0f2 211720 1e151d 1b131a 746d63"),
  winter: t("057aff cce4ff 463aa1 cdc7ff ffffff f0f6ff e2e8f4 394e6a"),
};
