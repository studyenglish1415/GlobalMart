import { execSync } from 'child_process';

// Optional: start any required services or seed DB here.
// For this project we assume the Nest app can be started programmatically in tests.
// Keep this file minimal; tests may import the application factory directly.

// Example placeholder to ensure environment variables are loaded
// Ensure test environment variables (use a separate test database)
process.env.NODE_ENV = 'test';
process.env.DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
process.env.DATABASE_PORT = process.env.DATABASE_PORT || '5432';
process.env.DATABASE_USER = process.env.DATABASE_USER || 'postgres';
process.env.DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'postgres';
process.env.DATABASE_NAME = process.env.DATABASE_NAME_TEST || process.env.DATABASE_NAME || 'globalmart_test';

export {};
