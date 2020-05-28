const { defaults: tsPreset } = require("ts-jest/presets");

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/spec/tsconfig.json",
    },
  },
  modulePaths: ["<rootDir>/src"],
  rootDir: "./",
  testMatch: ["./**/*spec.ts"],
  transform: {
    ...tsPreset.transform,
  },
};
