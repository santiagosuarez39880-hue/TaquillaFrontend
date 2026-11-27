"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useT } from "@/components/TextosProvider";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/cx";
import { validarIngreso } from "@/lib/validacion-ingreso";
import type { ErroresIngreso } from "@/lib/validacion-ingreso";
import type { RespuestaIngreso } from "@/types/sesion";
import styles from "./IngresarVista.module.css";

export interface IngresarVistaProps {
  /** Server Action `ingresar`. Se recibe por props para poder probar la vista sin servidor. */
  enviar: (datos: {
    correo: string;
    clave: string;
    recordar: boolean;
  }) => Promise<RespuestaIngreso>;
  /** Por qué se llegó aquí: la sesión venció (401 `no_autenticado`) o la página pedía sesión. */
  motivo?: "vencida" | "sinSesion";
  /** Ruta interna a la que volver después de ingresar. */
  siguiente?: string;
}

type Aviso =
  | { tipo: "campos" }
  | { tipo: "credenciales" }
  | { tipo: "conexion" }
  | { tipo: "servidor" }
  | { tipo: "limite"; hasta: number; inicial: number };

const BENEFICIOS = ["descubre", "filtra", "consulta"] as const;

/** Segundos que faltan para `hasta`, redondeando hacia arriba. */
function segundosHasta(hasta: number): number {
  return Math.max(0, Math.ceil((hasta - Date.now()) / 1000));
}

/** Vista 4 · Iniciar sesión, con sus estados de error y de carga. */
export function IngresarVista({ enviar, motivo, siguiente = "/" }: IngresarVistaProps) {
  const { t, listo } = useT();
  const router = useRouter();
  const id = useId();
  const refCorreo = useRef<HTMLInputElement>(null);
  const refClave = useRef<HTMLInputElement>(null);

  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [verClave, setVerClave] = useState(false);
  const [errores, setErrores] = useState<ErroresIngreso>({});
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [restantes, setRestantes] = useState(0);
  // Segundo cerrojo contra el doble envío: el estado de React tarda un render en llegar.
  const enCurso = useRef(false);

  const bloqueado = aviso?.tipo === "limite" && restantes > 0;

  // Cuenta regresiva del 429: se calcula contra la hora, no restando de 1 en 1, para no atrasarse.
  const hasta = aviso?.tipo === "limite" ? aviso.hasta : null;
  useEffect(() => {
    if (hasta === null) return;
    setRestantes(segundosHasta(hasta));
    const reloj = setInterval(() => {
      const faltan = segundosHasta(hasta);
      setRestantes(faltan);
      if (faltan <= 0) {
        clearInterval(reloj);
        setAviso(null);
      }
    }, 1000);
    return () => clearInterval(reloj);
  }, [hasta]);

  // Al terminar la espera el foco vuelve al primer campo, pero solo cuando ya no está deshabilitado.
  const estabaBloqueado = useRef(false);
  useEffect(() => {
    if (estabaBloqueado.current && !bloqueado) refCorreo.current?.focus();
    estabaBloqueado.current = bloqueado;
  }, [bloqueado]);

  if (!listo) return null;

  async function alEnviar(evento?: FormEvent<HTMLFormElement>) {
    evento?.preventDefault();
    if (enCurso.current || bloqueado) return;

    const encontrados = validarIngreso(correo, clave);
    setErrores(encontrados);
    if (encontrados.correo || encontrados.clave) {
      setAviso({ tipo: "campos" });
      // El foco va al primer campo con error, en el orden en que aparecen.
      (encontrados.correo ? refCorreo : refClave).current?.focus();
      return;
    }

    enCurso.current = true;
    setEnviando(true);
    setAviso(null);
    let respuesta: RespuestaIngreso;
    try {
      respuesta = await enviar({ correo: correo.trim(), clave, recordar });
    } catch {
      // La petición ni siquiera llegó al servidor: sin red.
      respuesta = { tipo: "conexion" };
    }

    if (respuesta.tipo === "ok") {
      // Se queda «Ingresando…» hasta que cambie la página: no hay nada que volver a enviar.
      router.replace(siguiente);
      router.refresh();
      return;
    }
    enCurso.current = false;
    setEnviando(false);
    if (respuesta.tipo === "limite") {
      const hastaMs = Date.now() + respuesta.segundos * 1000;
      setRestantes(respuesta.segundos);
      setAviso({ tipo: "limite", hasta: hastaMs, inicial: respuesta.segundos });
    } else if (respuesta.tipo === "validacion") {
      setAviso({ tipo: "campos" });
    } else {
      setAviso({ tipo: respuesta.tipo });
    }
  }

  const idCorreo = `${id}-correo`;
  const idClave = `${id}-clave`;
  const botonEstado = enviando
    ? t("paginas.ingresar.formulario.mensajes.ingresando")
    : aviso?.tipo === "conexion"
      ? t("paginas.ingresar.errores.conexion.botones.reintentar")
      : t("paginas.ingresar.formulario.botones.ingresar");

  return (
    <div className={styles.pagina}>
      <aside className={styles.presentacion}>
        <Link href="/" className={styles.logoPresentacion} aria-label={t("navbar.logo.aria")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/logo-inverso.svg" alt="" width="109" height="32" />
        </Link>
        <div className={styles.lema}>
          <p className={styles.lemaTexto}>{t("paginas.ingresar.presentacion.lema")}</p>
          <ul className={styles.beneficios}>
            {BENEFICIOS.map((clave) => (
              <li key={clave}>
                <span className={styles.beneficioIcono}>
                  <Icon name="check" tamano="sm" />
                </span>
                {t(`paginas.ingresar.presentacion.beneficios.${clave}`)}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section className={styles.lado}>
        <div className={styles.formulario}>
          <Link href="/" className={styles.logoMovil} aria-label={t("navbar.logo.aria")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/logo-normal.svg" alt="" width="109" height="32" />
          </Link>
          <h1 className={styles.titulo}>{t("paginas.ingresar.formulario.titulo")}</h1>
          <p className={styles.subtitulo}>{t("paginas.ingresar.formulario.subtitulo")}</p>

          {motivo && (
            <div className={styles.motivo} role="status">
              <Icon name="info" tamano="sm" className={styles.alertaIcono} />
              <div>
                <p className={styles.alertaTitulo}>
                  {t(`estados.${motivo === "vencida" ? "sesionVencida" : "sinSesion"}.titulo`)}
                </p>
                <p className={styles.alertaTexto}>
                  {t(`estados.${motivo === "vencida" ? "sesionVencida" : "sinSesion"}.texto`)}
                </p>
              </div>
            </div>
          )}

          {aviso && aviso.tipo !== "limite" && (
            <div className={styles.alerta} role="alert">
              <Icon name="alert" tamano="sm" className={styles.alertaIcono} />
              <div>
                <p className={styles.alertaTitulo}>{tituloAviso(aviso.tipo)}</p>
                <p className={styles.alertaTexto}>{textoAviso(aviso.tipo)}</p>
              </div>
            </div>
          )}
          {aviso?.tipo === "limite" && (
            <>
              {/* Lectores de pantalla: el aviso completo se lee una vez, no cada segundo. */}
              <p className={styles.soloLector} role="alert">
                {t("paginas.ingresar.errores.demasiadosIntentos.titulo")}.{" "}
                {t("paginas.ingresar.errores.demasiadosIntentos.texto", {
                  segundos: aviso.inicial,
                })}
              </p>
              <div className={styles.alerta} aria-hidden="true">
                <Icon name="alert" tamano="sm" className={styles.alertaIcono} />
                <div>
                  <p className={styles.alertaTitulo}>
                    {t("paginas.ingresar.errores.demasiadosIntentos.titulo")}
                  </p>
                  <p className={styles.alertaTexto}>
                    {t("paginas.ingresar.errores.demasiadosIntentos.texto", {
                      segundos: restantes,
                    })}
                  </p>
                </div>
              </div>
            </>
          )}

          <form noValidate onSubmit={alEnviar} aria-busy={enviando}>
            <fieldset className={styles.campos} disabled={bloqueado}>
              <div className={styles.campo}>
                <label className={styles.etiqueta} htmlFor={idCorreo}>
                  {t("paginas.ingresar.formulario.etiquetas.correo")}
                </label>
                <input
                  ref={refCorreo}
                  id={idCorreo}
                  className={cx(styles.entrada, errores.correo && styles.entradaError)}
                  type="email"
                  name="correo"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  inputMode="email"
                  placeholder={t("paginas.ingresar.formulario.placeholders.correo")}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  aria-invalid={errores.correo ? true : undefined}
                  aria-describedby={errores.correo ? `${idCorreo}-error` : undefined}
                />
                {errores.correo && (
                  <p id={`${idCorreo}-error`} className={styles.errorCampo}>
                    {t(errores.correo)}
                  </p>
                )}
              </div>

              <div className={styles.campo}>
                <label className={styles.etiqueta} htmlFor={idClave}>
                  {t("paginas.ingresar.formulario.etiquetas.clave")}
                </label>
                <div className={styles.conBoton}>
                  <input
                    ref={refClave}
                    id={idClave}
                    className={cx(styles.entrada, errores.clave && styles.entradaError)}
                    type={verClave ? "text" : "password"}
                    name="clave"
                    autoComplete="current-password"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    aria-invalid={errores.clave ? true : undefined}
                    aria-describedby={errores.clave ? `${idClave}-error` : undefined}
                  />
                  {/* El nombre del botón cambia con el estado: «Mostrar…» ↔ «Ocultar…». */}
                  <button
                    type="button"
                    className={styles.ojo}
                    aria-label={
                      verClave
                        ? t("paginas.ingresar.formulario.botones.ocultarClave")
                        : t("paginas.ingresar.formulario.botones.mostrarClave")
                    }
                    aria-controls={idClave}
                    onClick={() => setVerClave((v) => !v)}
                  >
                    <Icon name={verClave ? "eyeoff" : "eye"} tamano="md" />
                  </button>
                </div>
                {errores.clave && (
                  <p id={`${idClave}-error`} className={styles.errorCampo}>
                    {t(errores.clave)}
                  </p>
                )}
              </div>

              <div className={styles.opciones}>
                <label className={styles.recordar}>
                  <input
                    type="checkbox"
                    name="recordar"
                    checked={recordar}
                    onChange={(e) => setRecordar(e.target.checked)}
                  />
                  {t("paginas.ingresar.formulario.etiquetas.mantenerSesion")}
                </label>
                <Link className={styles.enlace} href="/recuperar-clave">
                  {t("paginas.ingresar.formulario.enlaces.olvidasteClave")}
                </Link>
              </div>

              {/* aria-disabled y no disabled: así el foco no se pierde mientras se envía. */}
              <button
                type="submit"
                className={cx(styles.enviar, enviando && styles.enviando)}
                aria-disabled={enviando || undefined}
              >
                {enviando && <span className={styles.rueda} aria-hidden="true" />}
                {botonEstado}
              </button>
            </fieldset>
          </form>

          <p className={styles.pie}>
            {t("paginas.ingresar.formulario.mensajes.sinCuenta")}{" "}
            <Link className={styles.enlaceFuerte} href="/registro">
              {t("paginas.ingresar.formulario.enlaces.crearCuenta")}
            </Link>
          </p>
          <p className={styles.soloLector} role="status">
            {enviando ? t("paginas.ingresar.formulario.mensajes.ingresando") : ""}
          </p>
        </div>
      </section>
    </div>
  );

  function tituloAviso(tipo: Exclude<Aviso["tipo"], "limite">): string {
    if (tipo === "campos") return t("paginas.ingresar.errores.camposObligatorios.titulo");
    if (tipo === "credenciales") return t("paginas.ingresar.errores.credenciales.titulo");
    if (tipo === "conexion") return t("paginas.ingresar.errores.conexion.titulo");
    return t("estados.error.titulo");
  }

  function textoAviso(tipo: Exclude<Aviso["tipo"], "limite">): string {
    if (tipo === "campos") return t("paginas.ingresar.errores.camposObligatorios.texto");
    if (tipo === "credenciales") return t("paginas.ingresar.errores.credenciales.texto");
    if (tipo === "conexion") return t("paginas.ingresar.errores.conexion.texto");
    return t("errores.error_interno");
  }
}
