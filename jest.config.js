module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(j|t)sx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "**/src/{utils}/*.{js,jsx}",
    "**/src/{utils}/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/vendor/**",
  ],
};
