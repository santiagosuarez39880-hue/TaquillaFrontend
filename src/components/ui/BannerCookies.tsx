import { Button } from "./Button";
import styles from "./BannerCookies.module.css";

/** Textos del aviso. Vienen de la API: textos.cookies.banner. */
export interface TextosBannerCookies {
  titulo: string;
  texto: string;
  politica: string;
  aceptar: string;
  rechazar: string;
  /** Solo si el sitio ofrece panel de preferencias. Hoy no: la historia es solo aceptar/rechazar. */
  configurar?: string;
  /** Se muestra si el navegador no deja guardar la cookie. */
  error: string;
  /** Nombre accesible de la región (textos.cookies.banner.aria.region). */
  region: string;
}

export interface BannerCookiesProps {
  textos: TextosBannerCookies;
  hrefPolitica: string;
  fallo?: boolean;
  onAceptar: () => void;
  onRechazar: () => void;
  /** Si no se pasa, no se dibuja el botón «Configurar». */
  onConfigurar?: () => void;
}

/**
 * Aviso de cookies: solo presentación (la decisión y la cookie las maneja CookieBanner).
 * «Aceptar» y «Rechazar» comparten variante y tamaño: pesan lo mismo.
 */
export function BannerCookies({
  textos,
  hrefPolitica,
  fallo = false,
  onAceptar,
  onRechazar,
  onConfigurar,
}: BannerCookiesProps) {
  return (
    <aside className={styles.banner} aria-label={textos.region}>
      <h2 className={styles.titulo}>{textos.titulo}</h2>
      <p className={styles.texto}>
        {textos.texto}{" "}
        <a className={styles.enlace} href={hrefPolitica}>
          {textos.politica}
        </a>
      </p>
      {fallo && (
        <p className={styles.error} role="alert">
          {textos.error}
        </p>
      )}
      <div className={styles.botones}>
        <Button variante="secundario" onClick={onAceptar}>
          {textos.aceptar}
        </Button>
        <Button variante="secundario" onClick={onRechazar}>
          {textos.rechazar}
        </Button>
        {onConfigurar && textos.configurar && (
          <button type="button" className={styles.configurar} onClick={onConfigurar}>
            {textos.configurar}
          </button>
        )}
      </div>
    </aside>
  );
}
