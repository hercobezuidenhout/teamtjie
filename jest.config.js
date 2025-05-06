// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/atoms': '<rootDir>/src/components/atoms',
    '^@/atoms(.*)$': '<rootDir>/src/components/atoms$1',
    '^@/buttons': '<rootDir>/src/components/buttons',
    '^@/buttons(.*)$': '<rootDir>/src/components/buttons$1',
    '^@/inputs': '<rootDir>/src/components/inputs',
    '^@/inputs(.*)$': '<rootDir>/src/components/inputs$1',
    '^@/modals': '<rootDir>/src/components/modals',
    '^@/modals(.*)$': '<rootDir>/src/components/modals$1',
    '^@/molecules': '<rootDir>/src/components/molecules',
    '^@/molecules(.*)$': '<rootDir>/src/components/molecules$1',
    '^@/organisms': '<rootDir>/src/components/organisms',
    '^@/organisms(.*)$': '<rootDir>/src/components/organisms$1',
    '^@/tags': '<rootDir>/src/components/tags',
    '^@/tags(.*)$': '<rootDir>/src/components/tags$1',
    '^@/templates': '<rootDir>/src/components/templates',
    '^@/layouts': '<rootDir>/src/layouts',
    '^@/templates(.*)$': '<rootDir>/src/components/templates$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.tsx'],
  testPathIgnorePatterns: ['./e2e'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
