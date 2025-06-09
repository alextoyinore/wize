import { defineConfig } from 'eslint'

export default defineConfig({
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
    'next/next',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'prettier',
    'next',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': ['error', {
      semi: true,
      singleQuote: true,
      trailingComma: 'es5',
      printWidth: 100,
      tabWidth: 2,
    }],
    // Next.js specific rules
    'next/no-img-element': 'error',
    'next/no-page-custom-font': 'warn',
    'next/no-html-link-for-pages': 'error',
    'next/no-script-in-head': 'error',
    'next/next-script-for-ga': 'warn',
    'next/no-api-routes': 'warn',
    'next/no-server-import-in-page': 'error',
    'next/no-document-import-in-page': 'error',
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    // React specific rules
    'react/no-unescaped-entities': 'warn',
    'react/no-danger': 'error',
    'react/no-unused-prop-types': 'warn',
    // Performance rules
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    // Import rules
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/no-default-export': 'warn',
    // General best practices
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'prefer-const': 'warn',
    'no-restricted-imports': ['warn', {
      paths: [
        { name: 'react', message: 'Use Next.js built-in React import instead' },
        { name: 'react-dom', message: 'Use Next.js built-in React DOM import instead' }
      ]
    }],
  },
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: './src',
    },
  }
})

