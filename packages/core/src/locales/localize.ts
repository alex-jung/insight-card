import en from "./en.json";
import de from "./de.json";

export type Translations = typeof en;
export type SupportedLanguages = "en" | "de";

const translations: Record<SupportedLanguages, Translations> = {
  en,
  de: de as unknown as Translations,
};

function getNestedValue(obj: unknown, keyPath: string): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return keyPath.split(".").reduce((acc: any, key) => acc?.[key], obj);
}

export function localize(
  key: string,
  lang: SupportedLanguages | string = "en",
  vars?: Record<string, string>,
): string {
  const langKey = (Object.keys(translations) as SupportedLanguages[]).includes(
    lang as SupportedLanguages,
  )
    ? (lang as SupportedLanguages)
    : "en";
  const langData = translations[langKey];
  const fallbackData = translations["en"];

  let template =
    getNestedValue(langData, key) ?? getNestedValue(fallbackData, key);
  if (typeof template !== "string") return key;

  if (vars) {
    for (const [varName, value] of Object.entries(vars)) {
      template = template.replace(new RegExp(`{${varName}}`, "g"), value);
    }
  }

  return template;
}
