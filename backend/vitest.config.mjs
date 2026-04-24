import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        // Globals are enabled because the backend is CommonJS; Vitest itself
        // is ESM-only, so `require('vitest')` fails. Globals (describe, it,
        // expect, beforeAll, etc.) let tests stay in CJS without ESM interop.
        globals: true,
        setupFiles: ['tests/helpers/testDb.js'],
        testTimeout: 30000, // mongodb-memory-server first boot can be slow
        hookTimeout: 30000,
        // Each test file spins up its own MongoMemoryServer in the setup file;
        // running files in parallel races on binary extraction and port binding,
        // especially on Windows. Sequential file execution keeps startup reliable.
        // (Tests within a file still run in parallel.)
        fileParallelism: false,
        // D1 will enforce a 70% coverage threshold on modified files only
        // (not project-wide). D0 emits reports; no threshold gate yet.
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json-summary'],
            include: [
                'controllers/**',
                'routes/**',
                'models/**',
                'utils/**',
                'createApp.js',
            ],
            exclude: [
                'tests/**',
                'node_modules/**',
                'scripts/**',
            ],
        },
    },
});
