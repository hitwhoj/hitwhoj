module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/prettier',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {
    'vue/no-multiple-template-root': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/ban-types': 0,
    "prettier/prettier": 2,
    'no-undef': 0,
  }
};