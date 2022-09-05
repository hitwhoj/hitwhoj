import { createContext } from "react";

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

export const ThemeContext = createContext<Theme>("light");

export const defaultThemeColor: Record<
  Theme,
  {
    "editor.background": string;
    "editor.foreground": string;
    "editor.lineHighlightBackground": string;
  }
> = {
  light: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#e5e6e6",
    "editor.foreground": "#1f2937",
  },
  dark: {
    "editor.background": "#2a303c",
    "editor.lineHighlightBackground": "#1f242d",
    "editor.foreground": "#a6adba",
  },
  cupcake: {
    "editor.background": "#faf7f5",
    "editor.lineHighlightBackground": "#e7e2df",
    "editor.foreground": "#291334",
  },
  bumblebee: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.foreground": "#333333",
    "editor.background": "#ffffff",
  },
  emerald: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.background": "#ffffff",
    "editor.foreground": "#333c4d",
  },
  corporate: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.background": "#ffffff",
    "editor.foreground": "#181a2a",
  },
  synthwave: {
    "editor.lineHighlightBackground": "#251655",
    "editor.background": "#2d1b69",
    "editor.foreground": "#f9f7fd",
  },
  retro: {
    "editor.background": "#e4d8b4",
    "editor.lineHighlightBackground": "#c6b386",
    "editor.foreground": "#282425",
  },
  cyberpunk: {
    "editor.lineHighlightBackground": "#d1c300",
    "editor.foreground": "#333000",
    "editor.background": "#ffee00",
  },
  valentine: {
    "editor.lineHighlightBackground": "#d897c5",
    "editor.background": "#f0d6e8",
    "editor.foreground": "#632c3b",
  },
  halloween: {
    "editor.lineHighlightBackground": "#1a1a1a",
    "editor.foreground": "#d4d4d4",
    "editor.background": "#212121",
  },
  garden: {
    "editor.lineHighlightBackground": "#bfbaba",
    "editor.background": "#e9e7e7",
    "editor.foreground": "#100f0f",
  },
  forest: {
    "editor.lineHighlightBackground": "#141010",
    "editor.foreground": "#d7cccc",
    "editor.background": "#171212",
  },
  aqua: {
    "editor.lineHighlightBackground": "#2a4b89",
    "editor.foreground": "#c7dbff",
    "editor.background": "#345ca8",
  },
  lofi: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#e6e5e5",
    "editor.foreground": "#000000",
  },
  pastel: {
    "editor.foreground": "#333333",
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#d1d5db",
  },
  fantasy: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.background": "#ffffff",
    "editor.foreground": "#1f2937",
  },
  wireframe: {
    "editor.foreground": "#333333",
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#dedede",
  },
  black: {
    "editor.foreground": "#cccccc",
    "editor.background": "#000000",
    "editor.lineHighlightBackground": "#1a1919",
  },
  luxury: {
    "editor.background": "#09090b",
    "editor.lineHighlightBackground": "#2e2d2f",
    "editor.foreground": "#dca54c",
  },
  dracula: {
    "editor.lineHighlightBackground": "#21222c",
    "editor.background": "#272935",
    "editor.foreground": "#f8f8f2",
  },
  cmyk: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.foreground": "#333333",
    "editor.background": "#ffffff",
  },
  autumn: {
    "editor.lineHighlightBackground": "#c4c4c4",
    "editor.foreground": "#303030",
    "editor.background": "#f2f2f2",
  },
  business: {
    "editor.lineHighlightBackground": "#1a1a1a",
    "editor.foreground": "#d4d4d4",
    "editor.background": "#212121",
  },
  acid: {
    "editor.lineHighlightBackground": "#c9c9c9",
    "editor.foreground": "#333333",
    "editor.background": "#fafafa",
  },
  lemonade: {
    "editor.lineHighlightBackground": "#cfcfcf",
    "editor.foreground": "#333333",
    "editor.background": "#ffffff",
  },
  night: {
    "editor.lineHighlightBackground": "#0c1322",
    "editor.foreground": "#b3c5ef",
    "editor.background": "#0f1729",
  },
  coffee: {
    "editor.lineHighlightBackground": "#1b131a",
    "editor.background": "#211720",
    "editor.foreground": "#746d63",
  },
  winter: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#e2e8f4",
    "editor.foreground": "#394e6a",
  },
};
