module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": 2,
    '@typescript-eslint/ban-types': 0,
  }
};