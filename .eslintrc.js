module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
      'vue/multi-word-component-names': 0,
      'vue/valid-template-root': 0,
      'vue/valid-v-slot': ['error', {
        allowModifiers: true,
      }],
  }
}
