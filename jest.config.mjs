/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/app.js",
    "!src/**/index.js",
    "!src/clients/database.js"
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: "node",
  testMatch: [
    "**/src/**/*.test.js"
  ]
};

export default config;
