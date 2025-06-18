import { basename, typesources, countrysources, matches } from "../src/index";

// Basic usage examples
console.log("=== Basic Company Name Cleaning ===");
console.log(basename("Hello World Oy")); // "Hello World"
console.log(basename("Some Big Pharma, LLC")); // "Some Big Pharma"
console.log(basename("Acme Corporation Inc.")); // "Acme Corporation"
console.log(basename("Tech Solutions Ltd.")); // "Tech Solutions"

// Advanced usage with options
console.log("\n=== Advanced Usage ===");
console.log(
  basename("Oy Hello World Ab", { suffix: true, prefix: true, middle: true })
); // "Hello World"
console.log(
  basename("Hello Oy World", { suffix: true, prefix: true, middle: true })
); // "Hello World"

// Business type classification
console.log("\n=== Business Type Classification ===");
const businessTypes = typesources();
const companyTypes = matches("Some Big Pharma, LLC", businessTypes);
console.log('Company types for "Some Big Pharma, LLC":', companyTypes);

// Country classification
console.log("\n=== Country Classification ===");
const countrySources = countrysources();
const countries = matches("Some Big Pharma, LLC", countrySources);
console.log('Possible countries for "Some Big Pharma, LLC":', countries);

// Finnish company example
console.log("\n=== Finnish Company Example ===");
const finnishCompany = "Säätämö Oy";
console.log("Original:", finnishCompany);
console.log("Cleaned:", basename(finnishCompany, { prefix: true }));
const finnishCountries = matches(finnishCompany, countrySources);
console.log("Possible countries:", finnishCountries);

// UK company example
console.log("\n=== UK Company Example ===");
const ukCompany = "British Airways PLC";
console.log("Original:", ukCompany);
console.log("Cleaned:", basename(ukCompany));
const ukCountries = matches(ukCompany, countrySources);
console.log("Possible countries:", ukCountries);
