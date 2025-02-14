import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
    plugins: [
        react(),
        reactRouter(),
        tsconfigPaths(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            'react-router-dom': 'react-router-dom', // This line can be kept for clarity
        },
    },
    optimizeDeps: {
        include: ['react-router-dom'], // Ensure these dependencies are pre-bundled
    },
    build: {
        rollupOptions: {
            external: [
                'sqlite3', // Example of a Node.js module you might want to exclude from the bundle
                'path',    // Add any other Node.js modules you want to treat as external
                'fs',      // File system module
                'url',     // URL module
                'react-router-dom',
            ],
        },
    },
});