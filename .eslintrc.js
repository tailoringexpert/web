module.exports = {
    env: {
        node: true
    },
    extends: ['plugin:vue/vue3-recommended', 'plugin:vuetify/recommended'],
    parser: 'vue-eslint-parser',
    rules: {
        // override/add rules settings here, such as:
        'vue/script-setup-uses-vars': 'error',
        // 'vue/no-unused-vars': 'error',
        'vue/multi-word-component-names': 0,
        'vue/valid-template-root': 0,
        'vue/valid-v-slot': [
            'error',
            {
                allowModifiers: true
            }
        ]
    }
};
