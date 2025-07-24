import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';

export default [
  {
    ignores: ['**/node_modules', '**/coverage', '**/generated-types.ts'],
  },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: _import,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        globalThis: 'readonly',
      },

      parser: tsParser,
    },

    rules: {
      'id-length': [
        'warn',
        {
          min: 2,
          exceptions: ['_'],
        },
      ],

      '@typescript-eslint/ban-ts-ignore': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'no-console': 'off',
      'import/extensions': ['error', 'ignorePackages'],

      'import/no-extraneous-dependencies': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],

      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: 'fp-ts/(?!lib/[A-Za-z]+.js)',
              message: 'Please follow the fp-ts/lib/{Structure}.js format.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
      'no-undef': 'off',
    },
  },
];
