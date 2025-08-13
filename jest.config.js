// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  // testEnvironment: "node",
  // transform: {
  //   ...tsJestTransformCfg,
  // },
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"], // This tells Jest where to look for tests
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"], // default pattern, looks for *.test.ts or *.spec.ts
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
