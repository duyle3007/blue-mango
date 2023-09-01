module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'jest', 'import'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/naming-convention": "off",
    'linebreak-style': 'off',
    "react-hooks/exhaustive-deps": "off",
    'prettier/prettier': [
      'off',
      {},
      {
        usePrettierrc: true
      }
    ],
  },
  ignorePatterns: [
    '.eslintrc.js'
  ],
};