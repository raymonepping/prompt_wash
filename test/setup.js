/**
 * Vitest test setup file
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PROMPTWASH_OLLAMA_BASE_URL = 'http://localhost:11434';
process.env.PROMPTWASH_OLLAMA_MODEL = 'llama2';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: () => {}, // Suppress logs in tests
  debug: () => {},
  info: () => {},
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};

// Made with Bob
