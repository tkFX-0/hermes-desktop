export type AppLocale = "en" | "zh-CN" | "ja";

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
