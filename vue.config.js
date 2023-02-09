module.exports = {
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'X-TENANT': process.env.VUE_APP_TENANT,
        },
        proxy: {
            '^/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '^/help': {
                target: 'http://localhost',
                changeOrigin: true
            },
            'impressum.html': {
                target: 'http://localhost',
                changeOrigin: true
            },
            'dataprotection.html': {
                target: 'http://localhost',
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        devtool: 'source-map',
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: '@/locales',
            enableInSFC: true
        }
    },
    "transpileDependencies": [
        "vuetify"
  ]
}