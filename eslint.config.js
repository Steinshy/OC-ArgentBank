import js from '@eslint/js';
import globals from 'globals';
import eslintReact from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import { importX } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist', 'node_modules', 'build', '*.config.js', '*.config.mjs', '.lighthouserc.*', '.oc/**'],
  },
  { linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' } },
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      'import-x': importX,
    },
    settings: {
      'import-x/internal-regex': '^@/',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    ...eslintReact.configs['strict-type-checked'],
    files: ['src/**/*.{jsx,tsx}'],
    languageOptions: {
      ...eslintReact.configs['strict-type-checked'].languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      '@eslint-react/purity': 'error',
      '@eslint-react/immutability': 'error',
      '@eslint-react/refs': 'error',
      '@eslint-react/set-state-in-effect': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
