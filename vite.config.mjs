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

    // MIME-Types Mapper für die gängigsten statischen Dateien
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
            AUTH_REQUIRED: JSON.parse(`"${process.env.VITE_AUTH_REQUIRED}"`.toLowerCase()),
            APP_TENANT: `"${process.env.VITE_APP_TENANT}"`,
            WEB_NAME: JSON.stringify(packageJson.name),
            WEB_VERSION: JSON.stringify(packageJson.version),
            IDM_URL: `"${process.env.VITE_IDM_URL}"`,
            IDM_REALM: `"${process.env.VITE_IDM_REALM}"`,
            IDM_CLIENT: `"${process.env.VITE_IDM_CLIENT}"`,
        },
        server: {
            port: 3000,
            headers: {
                'Access-Control-Allow-Origin': '*',
                //'X-TENANT': process.env.VITE_APP_TENANT
            },
            proxy: {
                '^/api': {
                    target: process.env.VITE_API_TARGET
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
            }),

           {
                name: 'native-static-file-server',
                configureServer(server) {
                    console.log("conf");
                    server.middlewares.use('/static/arsu', (req, res, next) => {
                        console.log("sever");
                       const baseDir = '/home/developer/git/www';
                        // Pfad bereinigen (Query Params entfernen)
                        const urlPath = req.url; //.split('?')[0];
                        const filePath = path.join(baseDir, urlPath);

                        console.log("hall")
                        // Sicherheit: Prüfen, ob der Pfad noch innerhalb von baseDir liegt
                        if (!filePath.startsWith(baseDir)) {
                            return next();
                        }

                        console.log("!shd")
                        if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                            const ext = path.extname(filePath).toLowerCase();
                            const contentType = mimeTypes[ext] || 'application/octet-stream';

                            console.log(contentType);
                            res.setHeader('Content-Type', contentType);
                            res.setHeader('Cache-Control', 'no-cache');

                            // Stream statt readFileSync (Performance!)
                            const stream = fs.createReadStream(filePath);
                            stream.pipe(res);
                        } else {
                            next();
                        }
                    });
                }
            }

            // 2. Sirv als Custom Plugin integrieren
            // {
            //     name: '/static/arsu',
            //     configureServer(server) {
            //         // Ersetze 'C:/dein/pfad' durch dein tatsächliches Verzeichnis
            //         console.log("sirv");
            //         const localPath = fileURLToPath(new URL('/home/developer/git/www', import.meta.url));
            //         //const localPath = path.resolve(__dirname, '/home/developer/git/www');

            //         // Serviert den Ordner unter http://localhost:3000/local-files
            //         server.middlewares.use(
            //             '/static/arsu',
            //             sirv(localPath, { dev: true, dotfiles: false })
            //         );
            //     }
            // }
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
