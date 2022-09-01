module.exports = {
    devServer: {
        headers: { "Access-Control-Allow-Origin": "*" },
        proxy: {
            '^/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            },
            '^/help': {
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