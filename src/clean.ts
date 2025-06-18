import { termsByType, termsByCountry } from "./termdata";
import { NON_NFKD_MAP } from "./non_nfkd_map";

const tailRemovalRegexp = /[^\p{L}.]+$/u;

function getUniqueTerms(): Set<string> {
  const ts = ([] as string[]).concat(
    ...(Object.values(termsByType) as string[][])
  );
  const cs = ([] as string[]).concat(
    ...(Object.values(termsByCountry) as string[][])
  );
  return new Set([...ts, ...cs]);
}

function removeAccents(t: string): string {
  // Normalize to NFKD, then filter out combining marks
  const nfkdForm = t.toLocaleLowerCase().normalize("NFKD");
  let result = "";

  for (const part of nfkdForm) {
    for (const c of part) {
      if (NON_NFKD_MAP[c]) {
        result += NON_NFKD_MAP[c];
      } else {
        // Remove combining marks (Unicode range 0300-036F)
        const code = c.charCodeAt(0);
        if (code < 0x0300 || code > 0x036f) {
          result += c;
        }
      }
    }
  }
  return result;
}

function stripPunct(t: string): string {
  return t.replace(/[.,-]/g, "");
}

function normalizeTerms(terms: Iterable<string>): string[] {
  return Array.from(terms, (t) => stripPunct(removeAccents(t)));
}

export function stripTail(name: string): string {
  const match = name.match(tailRemovalRegexp);
  if (match) {
    return name.slice(0, match.index);
  }
  return name;
}

export function normalized(text: string): string {
  return removeAccents(text);
}

export function prepareDefaultTerms(): Array<[number, string[]]> {
  const terms = getUniqueTerms();
  const nterms = normalizeTerms(terms);
  const ntermparts = nterms.map((t) => t.split(" "));
  // sort terms descending by number of tokens, ascending by names
  const sntermparts = ntermparts.sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return a.join(" ").localeCompare(b.join(" "));
  });
  return sntermparts.map((tp) => [tp.length, tp]);
}

export function customBasename(
  name: string,
  terms: Array<[number, string[]]>,
  opts: { suffix?: boolean; prefix?: boolean; middle?: boolean } = {}
): string {
  const { suffix = true, prefix = false, middle = false } = opts;
  let strippedName = stripTail(name);
  let nparts = strippedName.split(/\s+/);
  let nname = normalized(strippedName);
  let nnparts = nname.split(/\s+/).map(stripPunct);
  let nnsize = nnparts.length;

  if (suffix) {
    for (const [termsize, termparts] of terms) {
      if (nnparts.slice(-termsize).join(" ") === termparts.join(" ")) {
        nnparts.splice(-termsize, termparts.length);
        nparts.splice(-termsize, termparts.length);
      }
    }
  }
  if (prefix) {
    for (const [termsize, termparts] of terms) {
      if (nnparts.slice(0, termsize).join(" ") === termparts.join(" ")) {
        nnparts.splice(0, termparts.length);
        nparts.splice(0, termparts.length);
      }
    }
  }
  if (middle) {
    for (const [termsize, termparts] of terms) {
      if (termsize > 1) {
        const sizediff = nnsize - termsize;
        if (sizediff > 1) {
          for (let i = 0; i <= nnsize - termsize; i++) {
            if (
              termparts.join(" ") === nnparts.slice(i, i + termsize).join(" ")
            ) {
              nnparts.splice(i, termsize);
              nparts.splice(i, termsize);
              break;
            }
          }
        }
      } else {
        const idx = nnparts.slice(1, -1).indexOf(termparts[0]);
        if (idx !== -1) {
          nnparts.splice(idx + 1, 1);
          nparts.splice(idx + 1, 1);
        }
      }
    }
  }
  return stripTail(nparts.join(" ")).trim();
}

const defaultTerms = prepareDefaultTerms();
export const basename = (
  name: string,
  opts: { suffix?: boolean; prefix?: boolean; middle?: boolean } = {}
) => customBasename(name, defaultTerms, opts);
