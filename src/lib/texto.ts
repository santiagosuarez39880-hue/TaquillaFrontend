/**
 * Rellena los marcadores {nombre} de un texto de la API.
 * formatear("© {anio} Taquilla", { anio: 2026 }) → "© 2026 Taquilla"
 * Un marcador sin valor se deja tal cual, para que el error se note.
 */
export function formatear(plantilla: string, valores: Record<string, string | number>): string {
  return plantilla.replace(/\{(\w+)\}/g, (marcador, clave: string) => {
    const valor = valores[clave];
    return valor === undefined ? marcador : String(valor);
  });
}
