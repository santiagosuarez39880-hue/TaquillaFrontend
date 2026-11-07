/** Une nombres de clase ignorando los valores vacíos. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(" ");
}
