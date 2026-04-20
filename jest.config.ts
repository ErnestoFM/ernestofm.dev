import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/__tests__/e2e/',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!app/layout.tsx',
    '!app/page.tsx',
    '!app/not-found.tsx',
    '!app/error.tsx',
    '!app/robots.ts',
    '!app/sitemap.ts',
    '!app/[locale]/layout.tsx',
    '!app/[locale]/page.tsx',
    '!app/admin/**',
    '!app/api/auth/[...nextauth]/route.ts',
    '!components/admin/**',
    '!components/sections/AboutSection.tsx',
    '!components/sections/BlogSection.tsx',
    '!components/sections/CertificationsSection.tsx',
    '!components/sections/ContactSection.tsx',
    '!components/sections/HeroSection.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default createJestConfig(config);