import Navbar from "./components/Navbar";
import "./components/Navbar.css";
import "./App.css";
import { useEffect, useState } from "react";
import { useTextos } from "./hooks/useTextos";

function leerSeleccion() {
  return window.location.hash.slice(1) || "explorar";
}

function App() {
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeleccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);

  const datos = useTextos(idioma);

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeleccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);

  function buscar(valor) {
    setConsulta(valor);
    setActivo("explorar");
    window.history.replaceState(null, "", "#explorar");
  }

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}
        onBuscar={buscar}
        texto={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />
    </>
  );
}

export default App;
