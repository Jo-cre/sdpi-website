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
  // Este bloco IGNORA arquivos do Prisma
  {
    ignores: [
      'prisma/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/node_modules/.prisma/**',
      '**/node_modules/@prisma/client/**',
    ],
  },

  // Este bloco aplica as regras compatíveis com o antigo .eslintrc (Next.js + TS)
  ...compat.extends([
    'next/core-web-vitals',
    'next',
    'next/babel',
    'next/typescript',
  ]),
];
