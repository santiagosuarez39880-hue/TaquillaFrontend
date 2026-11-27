import type { DatosIcono } from "./iconos.generated";

/**
 * Iconos que el diseño usa y que aún no están en recursos-taquilla/iconos (de ahí sale
 * iconos.generated.ts, que no se edita a mano). Cuando se exporten desde Figma, se pasan allá.
 */
export const ICONOS_EXTRA = {
  /** «eye» con una diagonal: contraseña visible. */
  eyeoff: {
    viewBox: "0 0 16 16",
    html: '<path d="M1.33301 8.00001C1.33301 8.00001 3.33301 3.33334 7.99967 3.33334C12.6663 3.33334 14.6663 8.00001 14.6663 8.00001C14.6663 8.00001 12.6663 12.6667 7.99967 12.6667C3.33301 12.6667 1.33301 8.00001 1.33301 8.00001Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.5 13.5L13.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  },
} satisfies Record<string, DatosIcono>;
