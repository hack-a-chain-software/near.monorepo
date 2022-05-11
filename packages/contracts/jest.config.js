/* eslint-disable */
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  verbose: true,
  automock: false,
  collectCoverage: true,
  transform: {
    ...tsjPreset.transform,
  },
  testEnvironment: "near-cli/test_environment",
  testPathIgnorePatterns: ["<rootDir>/contract/", "<rootDir>/node_modules/"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testMatch: ["**/*.spec.(ts|tsx)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  collectCoverageFrom: ["src/**/*.{ts|tsx}", "src/**/{!(index),}.ts"],
  moduleDirectories: ["node_modules", "<rootDir>"],
};
