module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: "src/album",
    testRegex: ".spec.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverage: true,
    collectCoverageFrom: [
      "**/*.(t|j)s"
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["lcov"],
    testEnvironment: "node",
  };
  