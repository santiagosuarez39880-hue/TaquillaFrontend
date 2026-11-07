// Para Next.js 16. Si instalaste Next 15, mira la sección «ESLint» de MIGRACION.md.
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // siempre al final: desactiva reglas de formato que chocan con Prettier
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
