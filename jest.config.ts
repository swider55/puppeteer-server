import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@managers/(.*)$': '<rootDir>/src/managers/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['dotenv/config'],
  verbose: true,
};

export default config;
