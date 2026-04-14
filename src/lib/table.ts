import { IQualityLead } from "../types/types";

type PivotResult = {
  columns: string[];
  rows: Record<string, string | number>[];
};

export function pivotLeadData(data: IQualityLead[]): PivotResult {
  const categories = new Set<string>();
  const countries = new Set<string>();
  const pivotMap: Record<string, Record<string, number>> = {};

  data.forEach(({ category, country, leads }) => {
    categories.add(category);
    countries.add(country);

    if (!pivotMap[category]) {
      pivotMap[category] = {};
    }

    pivotMap[category][country] = leads;
  });

  const sortedCategories = Array.from(categories).sort();
  const sortedCountries = Array.from(countries).sort();

  const rows = sortedCategories.map((category) => {
    const row: Record<string, string | number> = { Category: category };
    sortedCountries.forEach((country) => {
      row[country] = pivotMap[category][country] ?? 0;
    });
    return row;
  });

  return {
    columns: ["Category", ...sortedCountries],
    rows,
  };
}
