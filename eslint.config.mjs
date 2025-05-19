import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    // Ignorar arquivos gerados pelo Prisma
    ignores: [
      "prisma/**",
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/build/**",
      "**/generated/**",
      "**/@prisma/**",
      "**/.prisma/**",
      "**/node_modules/@prisma/client/**",
    ],
  },

  // Configurações principais do Next.js
  ...compat.extends("next/core-web-vitals", "next", "next/typescript"),
];
