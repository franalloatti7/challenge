import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ logout }) => {
  
  const [rol, setRol] = useState("");
  const [UserLoged, setUserLoged] = useState("");
  const setLogout = (e) => {
    e.preventDefault();
    logout();
  };

  useEffect(() => {
    if (sessionStorage.getItem("userLoged")){
      setRol(sessionStorage.getItem("rol"));
      setUserLoged(sessionStorage.getItem("userLoged"));
    } else {
      setRol("");
      setUserLoged("");
    }
  }, [setRol]);

  let componente2 = "";
  if (rol === "alumno") {
    componente2 =
      <Fragment><li className="nav-item">
        <Link className="nav-link" to="/inscribirsecarrera">
          Inscribirse a carrera
      </Link>
      </li>
        <li className="nav-item">
          <Link className="nav-link" to="/inscribirse">
            Inscribirse a curso
      </Link>
        </li></Fragment>
  }
  if (rol === "profesor") {
    componente2 = 
    <Fragment>
      <li className="nav-item">
        <Link className="nav-link" to="/calificaciones">
          Calificaciones
          </Link>
      </li>
    </Fragment>;
  };
  
  if (rol === "admin") {
    componente2 = 
    <Fragment>
      <li className="nav-item">
        <Link className="nav-link" to="/persona">
          Persona
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/alumno">
          Alumno
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/profesor">
          Profesor
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/carrera">
          Carrera
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/materia">
          Materia
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/curso">
          Curso
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/estado-academico">
          Estado Académico
          </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/detalle-cursos">
          Detalle Cursos
          </Link>
      </li>
    </Fragment>;
    };

  let componente = "";
  if (UserLoged === "") {
    componente = (
      <Link className="nav-item nav-link" to="/login">
        Login
      </Link>
    );
  } else {
    componente = (
      <Fragment>
        {UserLoged}{" "}
        <Link className="nav-item nav-link" onClick={setLogout} to="/logout">
          Logout
        </Link>
        <Link className="nav-item nav-link" to="/changepassword">
          Cambiar Contraseña
        </Link>
      </Fragment>
    );
  }
  
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Challenge
      </Link>
      <button
        id="toggler"
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          {componente2}
        </ul>
      </div>
      <div className="text-right collapse navbar-collapse" id="navbarNavAltMarkup" style={{flex: "none"}}>
        {componente}
      </div>
    </nav>
  );
};
export default Navbar;
