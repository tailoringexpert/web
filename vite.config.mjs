import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import { fileURLToPath, URL } from 'url';
import fs from 'fs'; // Natives Node-Modul, muss nicht installiert werden
import path from 'path'; //
import packageJson from './package.json';
import tailwindcss from '@tailwindcss/vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    const localProxies = JSON.parse(process.env.VITE_PROXY_DIRS || '{}')
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.pdf': 'application/pdf',
    };

    return defineConfig({
        define: {
            WEB_NAME: JSON.stringify(packageJson.name),
            WEB_VERSION: JSON.stringify(packageJson.version),
            IDM_URL: `"${process.env.VITE_IDM_URL}"`,
            IDM_REALM: `"${process.env.VITE_IDM_REALM}"`,
            IDM_CLIENT: `"${process.env.VITE_IDM_CLIENT}"`
        },
        server: {
            port: 3000,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            proxy: {
                '^/api': {
                    target: process.env.VITE_API_TARGET
                }
            }
        },

        plugins: [
            vue(),
            tailwindcss(),
            vueDevTools(),
            Components({
                resolvers: [PrimeVueResolver()]
            }),
            {
                name: 'native-static-file-server',
                configureServer(server) {
                    Object.entries(localProxies).forEach(([urlPath, systemPath]) => {
                        server.middlewares.use(urlPath, (req, res, next) => {
                            const baseDir = path.resolve(process.cwd(), systemPath);
                            const relativeFilePath = req.url.split('?')[0];
                            const filePath = path.join(baseDir, relativeFilePath);

                            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                                const ext = path.extname(filePath).toLowerCase();
                                const contentType = mimeTypes[ext] || 'application/octet-stream';
                                res.setHeader('Content-Type', contentType);
                                res.setHeader('Cache-Control', 'no-cache');
                                fs.createReadStream(filePath).pipe(res);
                            } else {
                                next();
                            }
                        });
                    });
                }
            }
        ],
        build: {
            sourcemap: true,
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    });
};
