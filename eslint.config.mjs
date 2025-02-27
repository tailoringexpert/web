import globals from 'globals';
import parser from 'vue-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends('plugin:vue/vue3-recommended'),
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
