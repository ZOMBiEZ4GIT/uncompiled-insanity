// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    // Loosen strict rules for POC development
    '@typescript-eslint/no-unused-vars': 'off', // Allow unused variables in TS/TSX
    'no-unused-vars': 'off', // Allow unused variables in JS/JSX
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Don't require explicit return types
    '@typescript-eslint/no-explicit-any': 'off', // Allow use of 'any' type
    // add any project-specific overrides here
  },
};
