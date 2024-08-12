module.exports = {
    devServer: {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "X-TENANT": process.env.VUE_APP_TENANT,
        },

        proxy: {
            "^/api": {
                target: process.env.VUE_API_TARGET,
            },
            "^/static": {
                target: process.env.VUE_ASSETS_TARGET,
            },
            "^/assets": {
                target: process.env.VUE_ASSETS_TARGET,
            },
            "^/i18n": {
                target: process.env.VUE_ASSETS_TARGET,
            },
            "impressum.html": {
                target: process.env.VUE_ASSETS_TARGET,
            },
            "dataprotection.html": {
                target: process.env.VUE_ASSETS_TARGET,
            },
        },
    },
    /*     configureWebpack: {
        devtool: 'source-map',
    }, */
    pluginOptions: {
        i18n: {
            locale: "en",
            fallbackLocale: "en",
            localeDir: "@/locales",
            enableInSFC: true,
        },
    },
    transpileDependencies: true,
};
