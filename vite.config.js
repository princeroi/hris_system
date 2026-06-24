import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                        return 'react-vendor';
                    }
                    if (id.includes('node_modules/@inertiajs')) {
                        return 'inertia-vendor';
                    }
                    if (id.includes('node_modules/@radix-ui')) {
                        return 'radix-vendor';
                    }
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide-vendor';
                    }
                },
            },
        },
    },
});