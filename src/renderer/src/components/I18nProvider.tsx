import { useState, useCallback } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import {
  DEFAULT_ACTIVE_LOCALE,
  setLocale as setSharedLocale,
  sharedI18n,
  APP_LOCALES,
  type AppLocale,
} from "../../../shared/i18n";
import { I18nContext, type I18nContextValue } from "./I18nContext";

void sharedI18n.use(initReactI18next);

const LOCALE_STORAGE_KEY = "shikishima-locale";

function loadPersistedLocale(): AppLocale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as AppLocale | null;
    if (stored && APP_LOCALES.includes(stored)) return stored;
  } catch {
    // ignore
  }
  return DEFAULT_ACTIVE_LOCALE;
}

export function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    const persisted = loadPersistedLocale();
    setSharedLocale(persisted);
    return persisted;
  });

  const setLocale = useCallback((nextLocale: AppLocale) => {
    setSharedLocale(nextLocale);
    setLocaleState(nextLocale);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // ignore
    }
  }, []);

  const value: I18nContextValue = { locale, setLocale };

  return (
    <I18nContext.Provider value={value}>
      <I18nextProvider i18n={sharedI18n}>{children}</I18nextProvider>
    </I18nContext.Provider>
  );
}
