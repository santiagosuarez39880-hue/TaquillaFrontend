# Taquilla

Entradas para conciertos, teatro, deportes y festivales. Este repositorio contiene la base del proyecto y el
sistema de diseño (historia «Configurar el proyecto y el sistema de diseño»).

## Migración desde Vite

Este repositorio es el proyecto existente migrado a Next.js (App Router) con TypeScript estricto. Los pasos
exactos —dependencias, scripts, qué se borra y qué se mueve, ESLint, variables de entorno y Vercel— están en
[`MIGRACION.md`](./MIGRACION.md).

Antes de cada PR:

```bash
npm run check && npm run build
```

## Variable de entorno de la API

| Variable              | Ejemplo                                       | Dónde                                      |
| --------------------- | --------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | `https://yanethm-taquilla-api.fly.dev/api/v1` | `.env.local` y Vercel (todos los entornos) |

Se lee solo con `getApiUrl()` (`src/lib/env.ts`); no hay direcciones escritas en el código. `.env.local` no se
versiona; `.env.example` sí.

## Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio. Vercel detecta Next.js solo.
3. En **Settings → Environment Variables** crea `NEXT_PUBLIC_API_URL` para _Production_, _Preview_ y
   _Development_.
4. Despliega. Desde ahí cada PR genera una **vista previa** y `main` actualiza producción.

## Sistema de diseño

- Todos los valores visuales viven en `src/styles/tokens.css` (colores, tipografía, espacios, radios, sombras,
  foco, movimiento).
- Los componentes (`src/components/ui`) solo usan `var(--token)`. `npm run check:tokens` falla si un `.css`
  escribe un color, una medida con unidad o un número de peso/opacidad a mano. Las condiciones de `@media` quedan
  exentas porque CSS no permite variables ahí.
- **Pendiente de revisar contra Figma:** los valores actuales salen de la captura del navbar y de escalas
  estándar. Para ajustarlos, cambia solo `tokens.css`.

| Componente         | Estados cubiertos                                                     |
| ------------------ | --------------------------------------------------------------------- |
| `Button`           | hover, foco visible, deshabilitado · 3 variantes · 3 tamaños          |
| `Field`            | hover, foco visible, deshabilitado, error · etiqueta, ayuda, `aria-*` |
| `Tag`              | 5 variantes (neutro, éxito, aviso, peligro, info)                     |
| `Card`             | estática o `interactiva` (hover y `:focus-within`)                    |
| `LanguageSelector` | hover, foco, deshabilitado · nombre accesible desde la API            |
| `CookieBanner`     | guarda la decisión en una cookie · textos desde la API · botones base |

## Flujo de trabajo con Git

- **Una rama y un PR por historia**, creada desde `main`: `feat/<historia>`, `fix/<historia>`, `chore/<tema>`.
- **Commits convencionales**: `tipo(ámbito): descripción en imperativo`.
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`.
  - Ejemplos: `feat(ui): agrega el componente Button`, `chore: configura prettier`.
- Cada PR usa `.github/pull_request_template.md` y debe tener `npm run check` y `npm run build` en verde.
