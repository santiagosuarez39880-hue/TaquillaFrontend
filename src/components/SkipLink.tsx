import styles from "./SkipLink.module.css";

export const ID_CONTENIDO = "contenido";

/** Primer elemento enfocable del sitio: permite a quien usa teclado saltar el menú. */
export default function SkipLink({ texto }: { texto: string }) {
  return (
    <a className={styles.salto} href={`#${ID_CONTENIDO}`}>
      {texto}
    </a>
  );
}
