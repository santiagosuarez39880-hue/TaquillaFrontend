"use client";

import { useState } from "react";
import { Button, Card, CookieBanner, Field, LanguageSelector, Tag } from "@/components/ui";
import type { TextosCookieBanner } from "@/components/ui";
import styles from "./page.module.css";

/*
 * Muestrario temporal del sistema de diseño. Los textos de ejemplo salen de la
 * respuesta de /textos de la API; las vistas reales los pedirán con un hook.
 * Se reemplaza cuando exista la primera vista (Inicio / Explorar).
 */
const TEXTOS_COOKIES: TextosCookieBanner = {
  titulo: "Usamos cookies",
  texto:
    "Las necesarias mantienen tu sesión, tu carrito y tu idioma. Las de análisis y marketing solo se activan si las aceptas.",
  politica: "Política de cookies",
  configurar: "Configurar",
  rechazarOpcionales: "Rechazar opcionales",
  aceptarTodas: "Aceptar todas",
  region: "Aviso de cookies",
};

export default function Muestrario() {
  const [idioma, setIdioma] = useState("es");

  return (
    <div className={styles.pagina}>
      <h1 className={styles.titulo}>Sistema de diseño · Taquilla</h1>

      <section className={styles.seccion} aria-labelledby="botones">
        <h2 id="botones" className={styles.subtitulo}>
          Botón
        </h2>
        <div className={styles.fila}>
          <Button>Ingresar</Button>
          <Button variante="secundario">Crear cuenta</Button>
          <Button variante="fantasma">Cancelar</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className={styles.fila}>
          <Button tamano="sm">Pequeño</Button>
          <Button tamano="md">Mediano</Button>
          <Button tamano="lg">Grande</Button>
        </div>
      </section>

      <section className={styles.seccion} aria-labelledby="campos">
        <h2 id="campos" className={styles.subtitulo}>
          Campo
        </h2>
        <div className={styles.columna}>
          <Field label="Correo electrónico" type="email" placeholder="tu@correo.com" />
          <Field
            label="Contraseña"
            type="password"
            hint="Mínimo 8 caracteres, una mayúscula y un número."
          />
          <Field label="Celular" defaultValue="300" error="El celular debe tener 10 dígitos" />
          <Field label="Documento" disabled defaultValue="1053000000" />
        </div>
      </section>

      <section className={styles.seccion} aria-labelledby="etiquetas">
        <h2 id="etiquetas" className={styles.subtitulo}>
          Etiqueta
        </h2>
        <div className={styles.fila}>
          <Tag>Destacado</Tag>
          <Tag variante="exito">Publicado</Tag>
          <Tag variante="aviso">Últimas entradas</Tag>
          <Tag variante="peligro">Agotado</Tag>
          <Tag variante="aviso">Borrador</Tag>
        </div>
      </section>

      <section className={styles.seccion} aria-labelledby="tarjetas">
        <h2 id="tarjetas" className={styles.subtitulo}>
          Tarjeta
        </h2>
        <div className={styles.fila}>
          <Card interactiva className={styles.tarjetaEjemplo}>
            <Tag variante="aviso">Pocas entradas</Tag>
            <h3 className={styles.tituloTarjeta}>Noche de salsa</h3>
            <p>Sáb 14 nov · Manizales</p>
            <Button tamano="sm">Comprar entradas</Button>
          </Card>
          <Card className={styles.tarjetaEjemplo}>
            <h3 className={styles.tituloTarjeta}>Tarjeta estática</h3>
            <p>Sin efecto de hover: para información que no se pulsa.</p>
          </Card>
        </div>
      </section>

      <section className={styles.seccion} aria-labelledby="idioma">
        <h2 id="idioma" className={styles.subtitulo}>
          Selector de idioma
        </h2>
        <div className={styles.fila}>
          <LanguageSelector idioma={idioma} onCambiar={setIdioma} ariaLabel="Cambiar idioma" />
          <LanguageSelector
            idioma={idioma}
            onCambiar={setIdioma}
            ariaLabel="Cambiar idioma"
            disabled
          />
        </div>
      </section>

      <CookieBanner textos={TEXTOS_COOKIES} hrefPolitica="#cookies" />
    </div>
  );
}
