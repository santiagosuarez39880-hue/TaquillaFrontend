import { useEffect, useRef, useState } from "react";
import Icono from "./Icono.jsx";
import "./Navbar.css";
import "./Navbar.taquilla.css";

const DESTINOS = {
  explorar: "#explorar",
  conciertos: "#conciertos",
  teatro: "#teatro",
  deportes: "#deportes",
  festivales: "#festivales",
};
const DESTINO_VENDER = "#vender";
const DESTINO_INGRESAR = "#ingresar";

function IconoTicket() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 6.75C2.09674 6.75 2.66903 6.98705 3.09099 7.40901C3.51295 7.83097 3.75 8.40326 3.75 9C3.75 9.59674 3.51295 10.169 3.09099 10.591C2.66903 11.0129 2.09674 11.25 1.5 11.25V12.75C1.5 13.1478 1.65804 13.5294 1.93934 13.8107C2.22064 14.092 2.60218 14.25 3 14.25H15C15.3978 14.25 15.7794 14.092 16.0607 13.8107C16.342 13.5294 16.5 13.1478 16.5 12.75V11.25C15.9033 11.25 15.331 11.0129 14.909 10.591C14.4871 10.169 14.25 9.59674 14.25 9C14.25 8.40326 14.4871 7.83097 14.909 7.40901C15.331 6.98705 15.9033 6.75 16.5 6.75V5.25C16.5 4.85218 16.342 4.47064 16.0607 4.18934C15.7794 3.90804 15.3978 3.75 15 3.75H3C2.60218 3.75 2.22064 3.90804 1.93934 4.18934C1.65804 4.47064 1.5 4.85218 1.5 5.25V6.75Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 3.75V5.25M9.75 12.75V14.25M9.75 8.25V9.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  onBuscar,
  textoGrande,
  alternarTexto,
}) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const abrir =
    textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar =
    textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const textoBuscar = textos?.general?.acciones?.buscar ?? nav?.buscador.aria;
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(
    ([clave]) => DESTINOS[clave],
  );

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav
        className="navbar-interior"
        aria-label={ingles ? "Main navigation" : "Navegación principal"}
      >
        <a
          className="navbar-marca"
          href="#explorar"
          aria-label={nav?.logo.aria ?? "Taquilla"}
          onClick={() => setAbierto(false)}
        >
          <span className="navbar-simbolo" aria-hidden="true">
            <IconoTicket />
          </span>
          <span>{nav?.logo.texto ?? "taquilla"}</span>
        </a>

        <div className="navbar-movil-acciones">
          <button
            type="button"
            className="navbar-icono"
            aria-label={nav?.buscador.aria ?? "Buscar"}
            disabled={!nav}
            onClick={abrirBusqueda}
          >
            <Icono nombre="buscar" />
          </button>
          <button
            ref={botonMenu}
            type="button"
            className="navbar-icono"
            aria-label={abierto ? cerrar : abrir}
            aria-expanded={abierto}
            aria-controls="navbar-panel"
            onClick={() => setAbierto((valor) => !valor)}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} />
          </button>
        </div>

        <div
          id="navbar-panel"
          className={`navbar-panel${abierto ? " is-abierto" : ""}`}
          aria-busy={cargando}
        >
          {cargando && (
            <p className="navbar-estado" role="status">
              {ingles ? "Loading navigation…" : "Cargando navegación…"}
            </p>
          )}
          {error && (
            <div className="navbar-estado" role="alert">
              <p>
                {ingles
                  ? "Navigation could not be loaded."
                  : "No pudimos cargar el menú."}
              </p>
              <button type="button" onClick={recargar}>
                {ingles ? "Try again" : "Reintentar"}
              </button>
            </div>
          )}
          {nav && (
            <>
              <ul className="navbar-enlaces">
                {enlaces.map(([clave, etiqueta]) => (
                  <li key={clave}>
                    <a
                      href={DESTINOS[clave]}
                      aria-current={activo === clave ? "page" : undefined}
                      onClick={() => setAbierto(false)}
                    >
                      {etiqueta}
                    </a>
                  </li>
                ))}
              </ul>
              <form
                className="navbar-buscador"
                role="search"
                aria-label={nav.buscador.aria}
                onSubmit={buscar}
              >
                <button type="submit" aria-label={textoBuscar}>
                  <Icono nombre="buscar" />
                </button>
                <input
                  ref={campoBusqueda}
                  type="search"
                  value={busqueda}
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder={nav.buscador.placeholder}
                  aria-label={nav.buscador.aria}
                  required
                />
              </form>
            </>
          )}
          <div className="navbar-utilidades">
            {nav && (
              <a
                className="navbar-vender"
                href={DESTINO_VENDER}
                onClick={() => setAbierto(false)}
              >
                {nav.enlaces.venderEventos}
              </a>
            )}
            <label className="navbar-idioma">
              <Icono nombre="idioma" />
              <select
                value={idioma}
                onChange={(evento) => cambiarIdioma(evento.target.value)}
                aria-label={nav?.aria.idioma ?? "Cambiar idioma"}
              >
                <option value="es">ES</option>
                <option value="en">EN</option>
              </select>
            </label>
            <button
              className="navbar-icono navbar-accesibilidad"
              type="button"
              aria-label={
                nav?.aria.accesibilidad ??
                (ingles ? "Enlarge text" : "Aumentar texto")
              }
              aria-pressed={textoGrande}
              onClick={alternarTexto}
            >
              <Icono nombre="accesibilidad" />
            </button>
            {nav && (
              <a
                className="navbar-accion"
                href={DESTINO_INGRESAR}
                onClick={() => setAbierto(false)}
              >
                {nav.botones.ingresar}
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}