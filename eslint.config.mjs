import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Ignorar apenas os arquivos relacionados ao Prisma
  {
    ignores: [
      'prisma/',
      '**/node_modules/.prisma/**',
      '**/node_modules/@prisma/client/**',
    ],
  },

  // Aplicar as configs herdadas do ESLint antigo (Next.js + TS)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
];
