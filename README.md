# cleanco-ts - TypeScript Version

This is a TypeScript conversion of the original Python cleanco library for cleaning organization names.

## Original Python Package

This TypeScript version is based on the original [cleanco Python package](https://github.com/psolin/cleanco) by [psolin](https://github.com/psolin).

- **Original Repository**: [https://github.com/psolin/cleanco](https://github.com/psolin/cleanco)
- **Original Author**: [psolin](https://github.com/psolin)
- **Original Language**: Python

This TypeScript port maintains the same functionality and API design as the original Python version while providing type safety and better integration with the Node.js/TypeScript ecosystem.

## What is it?

This TypeScript package processes company names, providing cleaned versions by stripping away terms indicating organization type (such as "Ltd." or "Corp"). It also provides utilities to deduce the type of organization and suggest countries the organization could be established in.

## Installation

```bash
npm install cleanco-ts
```

## Usage

### Basic Usage

```typescript
import { basename } from "cleanco-ts";

const businessName = "Some Big Pharma, LLC";
const cleanedName = basename(businessName);
console.log(cleanedName); // "Some Big Pharma"
```

### Advanced Usage

```typescript
import { basename, customBasename, prepareDefaultTerms } from "cleanco-ts";

// Custom options
const cleanedName = basename("Oy Hello World Ab", {
  suffix: true,
  prefix: true,
  middle: true,
});
console.log(cleanedName); // "Hello World"

// Custom terms
const customTerms = prepareDefaultTerms();
const result = customBasename("Custom Company Name", customTerms, {
  suffix: true,
  prefix: false,
  middle: false,
});
```

### Business Type Classification

```typescript
import { typesources, matches } from "cleanco-ts";

const classificationSources = typesources();
const businessTypes = matches("Some Big Pharma, LLC", classificationSources);
console.log(businessTypes); // ["Limited Liability Company"]
```

### Country Classification

```typescript
import { countrysources, matches } from "cleanco-ts";

const classificationSources = countrysources();
const countries = matches("Some Big Pharma, LLC", classificationSources);
console.log(countries); // ["United States of America", "Philippines"]
```

## API Reference

### Functions

#### `basename(name: string, options?: BasenameOptions): string`

Cleans a company name by removing organization type terms.

**Parameters:**

- `name`: The company name to clean
- `options`: Optional configuration object
  - `suffix?: boolean`: Remove terms from the end (default: true)
  - `prefix?: boolean`: Remove terms from the beginning (default: false)
  - `middle?: boolean`: Remove terms from the middle (default: false)

#### `customBasename(name: string, terms: TermArray[], options?: BasenameOptions): string`

Cleans a company name using custom terms.

#### `prepareDefaultTerms(): TermArray[]`

Returns the default terms used for cleaning, sorted by length.

#### `typesources(): [string, string][]`

Returns business type terms sorted by length.

#### `countrysources(): [string, string][]`

Returns country terms sorted by length.

#### `matches(name: string, sources: [string, string][]): string[]`

Finds matches between a company name and classification sources.

### Types

```typescript
type TermArray = [number, string[]];
type BasenameOptions = {
  suffix?: boolean;
  prefix?: boolean;
  middle?: boolean;
};
```

## Building from Source

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## License

MIT License - same as the original Python version.
