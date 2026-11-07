/**
 * Dirección base de la API. Viene de NEXT_PUBLIC_API_URL (ver .env.example)
 * y se configura en Vercel para cada entorno. No hay URL escrita en el código.
 *
 * Se lee con acceso estático a `process.env.NEXT_PUBLIC_API_URL` porque Next.js
 * solo reemplaza esa forma literal en el código que llega al navegador.
 */
export function getApiUrl(): string {
  const valor = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!valor) {
    throw new Error(
      "Falta la variable de entorno NEXT_PUBLIC_API_URL. Copia .env.example a .env.local " +
        "o configúrala en Vercel (Settings > Environment Variables).",
    );
  }

  return valor.replace(/\/+$/, "");
}
