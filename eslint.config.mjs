import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import vuePrettierConfig from '@vue/eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...pluginVue.configs['flat/recommended'],
    ...compat.extends('plugin:vue/vue3-recommended'),
    vuePrettierConfig,

    {
        languageOptions: {
            globals: {
                ...globals.node
            },

            parser: parser
        },

        rules: {
            'vue/script-setup-uses-vars': 'error',
            'vue/multi-word-component-names': 'off',
            'vue/valid-template-root': 0,

            'vue/valid-v-slot': [
                'error',
                {
                    allowModifiers: true
                }
            ],

            'vue/component-tags-order': [
                'error',
                {
                    order: [['script', 'template'], 'style']
                }
            ]
        }
    }
];
