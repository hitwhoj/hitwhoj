/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
  rules: {
    "@typescript-eslint/consistent-type-imports": 2,
    "@typescript-eslint/no-unused-vars": 2,
    "react-hooks/exhaustive-deps": 0,
  },
};
