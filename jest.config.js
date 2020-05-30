/* eslint-disable @typescript-eslint/no-var-requires */
const { defaults: tsPreset } = require("ts-jest/presets");

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["lcov"],
  testEnvironment: "./spec/setup.js",
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/spec/tsconfig.json",
    },
    rootDir: __dirname,
  },
  modulePaths: ["<rootDir>/src"],
  rootDir: "./",
  testMatch: ["./**/*spec.ts"],
  transform: {
    ...tsPreset.transform,
  },
};
