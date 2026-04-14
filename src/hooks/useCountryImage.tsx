import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { useMemo } from "react";

countries.registerLocale(enLocale);

export function useCountryImage(countryName: string): string | null {
  return useMemo(() => {
    const countryCode = countries.getAlpha2Code(countryName, "en");
    return countryCode
      ? `https://flagcdn.com/h40/${countryCode.toLowerCase()}.png`
      : null;
  }, [countryName]);
}
