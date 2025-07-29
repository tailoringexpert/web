import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { fileURLToPath, URL } from 'node:url';
import packageJson from './package.json';
import tailwindcss from '@tailwindcss/vite';

import vueDevTools from 'vite-plugin-vue-devtools';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        define: {
            AUTH_REQUIRED: JSON.parse(`"${process.env.VITE_AUTH_REQUIRED}"`.toLowerCase()),
            APP_TENANT: `"${process.env.VITE_APP_TENANT}"`,
            WEB_NAME: JSON.stringify(packageJson.name),
            WEB_VERSION: JSON.stringify(packageJson.version)
        },
        server: {
            port: 3000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'X-TENANT': process.env.VITE_APP_TENANT
            },
            proxy: {
                '^/api': {
                    target: process.env.VITE_API_TARGET
                },
                '^/static': {
                    target: process.env.VITE_ASSETS_TARGET
                },
                '^/assets': {
                    target: process.env.VITE_ASSETS_TARGET
                },
                'impressum.html': {
                    target: process.env.VITE_ASSETS_TARGET
                },
                'dataprotection.html': {
                    target: process.env.VITE_ASSETS_TARGET
                }
            }
        },

        plugins: [
            vue(),
            tailwindcss(),
            vueDevTools(),
            Components({
                resolvers: [PrimeVueResolver()]
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    });
};
