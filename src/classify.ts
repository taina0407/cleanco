import { termsByCountry, termsByType } from "./termdata";
import { stripTail, normalized } from "./clean";

export function typesources(): Array<[string, string]> {
  const types: Array<[string, string]> = [];
  for (const businessType in termsByType) {
    for (const item of termsByType[businessType]) {
      types.push([businessType, item]);
    }
  }
  return types.sort((a, b) => b[1].length - a[1].length);
}

export function countrysources(): Array<[string, string]> {
  const countries: Array<[string, string]> = [];
  for (const country in termsByCountry) {
    for (const item of termsByCountry[country]) {
      countries.push([country, item]);
    }
  }
  return countries.sort((a, b) => b[1].length - a[1].length);
}

export function matches(
  name: string,
  sources: Array<[string, string]>
): string[] {
  const stripped = stripTail(name);
  const parts = stripped.split(/\s+/);
  const nparts = parts.map(normalized);
  const result: string[] = [];
  for (const [classifier, term] of sources) {
    const nterm = normalized(term);
    const idx = nparts.indexOf(nterm);
    if (idx !== -1) {
      result.push(classifier);
    }
  }
  return result;
}
