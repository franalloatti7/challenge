import React, { useState, useEffect, Fragment } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { gql } from "apollo-boost";

import Navbar from "./components/Navbar";
import Persona from "./components/Persona";
import Alumno from "./components/Alumno";
import Profesor from "./components/Profesor";
import Carrera from "./components/Carrera";
import Materia from "./components/Materia";
import Curso from "./components/Curso";
import Home from "./components/Home";
import Changepassword from "./components/Changepassword";
import Calificaciones from "./components/Calificaciones";
import Estadoacademico from "./components/Estadoacademico";
import Detallecurso from "./components/Detallecurso";
import Inscribirse from "./components/Inscribirse";
import Inscribirsecarrera from "./components/Inscribirsecarrera";
import FormLogin from "./components/FormLogin";

import "bootswatch/dist/simplex/bootstrap.min.css";

import "jquery";

const GET_PERSONAS = gql`
  {
    getPersonas {
      identificador
      tipodoc
      documento
      nombre
      apellido
    }
  }
`;

const GET_PERSONALOGIN = gql`
  query GetPersonaLogin($documento: Bigint!, $password: String!) {
    getPersonaLogin(documento: $documento, password: $password) {
      nombre
      apellido
      alumno {
        identificador
      }
      profesor {
        identificador
      }
      token
      admin
    }
  }
`;

const GET_LOGIN = gql`
  query GetLogin($token: String!) {
    getLogin(token: $token) {
      nombre
      apellido
      alumno {
        identificador
      }
      profesor {
        identificador
      }
      token
      admin
    }
  }
`;

const CREATE_DEFAULT = gql`
  mutation CreateDefault {
    createDefault {
      identificador
      tipodoc
      documento
      nombre
      apellido
      fechanac
      direccion
    }
  }
`;

const App = () => {
  const [documento, setDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [userLoged, saveUserLoged] = useState("");
  const [token, saveToken] = useState("");
  const [rol, setRol] = useState("");
  const [error, setError] = useState(<Fragment></Fragment>);
  // const [token, saveToken] = useState("");
  const [accion, setAccion] = useState("");
  const [createDefault] = useMutation(CREATE_DEFAULT);
  const getPersonas = useQuery(GET_PERSONAS);

  const getPersonaLogin = useQuery(GET_PERSONALOGIN, {
    variables: { documento, password },
  });

  const getLogin = useQuery(GET_LOGIN, {
    variables: { token: token ? token : "d" },
  });

  useEffect(() => {
    if (!getPersonas.loading && !getPersonas.data) {
      console.log(getPersonas);
      alert("No hay personas registradas en el sistema. Se creará el usuario por defecto.");
      createDefault()
        .then(({ data }) => {
          alert("Se creo el usuario por defecto con éxito");
          // window.location.reload();
        })
        .catch(({ message }) => {
            alert("No se pudo registrar el usuario por defecto. Reintente");
        });
    }
    if (sessionStorage.getItem("token")) {
      saveToken(sessionStorage.getItem("token"));
    }
    if (token !== "") {
      let data = getLogin.data;
      if (data) {
        let persona = data.getLogin;
        saveUserLoged(persona.nombre + " " + persona.apellido);
        sessionStorage.setItem(
          "userLoged",
          persona.nombre + " " + persona.apellido
        );
        saveToken(persona.token);
        let rol = "";
        console.log(persona);
        if (persona.admin === "si") {
          rol = "admin";
        } else {
          if (persona.alumno) {
            rol = "alumno";
          } else {
            rol = "profesor";
          }
        }
        if (
          sessionStorage.getItem("rol") &&
          sessionStorage.getItem("rol") !== rol
        ) {
          setRol(rol);
          sessionStorage.setItem("rol", rol);
          window.location.reload();
        } else {
          setRol(rol);
          sessionStorage.setItem("rol", rol);
        }
      }
    }
    let data = getPersonaLogin.data;
    if (data) {
      let persona = data.getPersonaLogin;
      // sessionStorage.setItem('userLoged',persona.nombre + " " + persona.apellido);
      sessionStorage.setItem("token", persona.token);
      saveToken(persona.token);
      window.location.pathname = "/";
    } else if (!getPersonaLogin.loading && accion === "login") {
      setError(
        <Fragment>
          <div className="alert alert-dismissible alert-primary">
            <button type="button" className="close" data-dismiss="alert">
              &times;
            </button>
            <strong>
              El documento o contraseña son incorrectos! Por favor vuelva a
              intentar
            </strong>
          </div>
        </Fragment>
      );
    }
    if (
      window.location.pathname !== "/login" &&
      !sessionStorage.getItem("token") &&
      accion === ""
    ) {
      window.location.pathname = "/login";
    }
  }, [getPersonaLogin, getPersonas, getLogin, accion, token]);

  const login = ({ documento, password }) => {
    setDocumento(documento);
    setPassword(password);
    setAccion("login");
  };

  const logout = () => {
    sessionStorage.removeItem("userLoged");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("rol");
    saveUserLoged("");
    saveToken("");
    setDocumento("");
    setRol("");
    setPassword("");
    setAccion("logout");
    window.location.pathname = "/login";
  };

  return (
    <Router>
      <Navbar userLoged={userLoged} rol={rol} logout={logout} />
      <div className="container p-4" style={{ maxWidth: "80%" }}>
        {error}
        <Switch>
          <Route
            exact
            path="/login"
            component={() => <FormLogin login={login} />}
          />
          <Route exact path="/" component={Home} />
          <Route exact path="/persona" component={Persona} />
          <Route exact path="/alumno" component={Alumno} />
          <Route exact path="/profesor" component={Profesor} />
          <Route exact path="/carrera" component={Carrera} />
          <Route exact path="/materia" component={Materia} />
          <Route exact path="/curso" component={Curso} />
          <Route exact path="/estado-academico" component={Estadoacademico} />
          <Route exact path="/detalle-cursos" component={Detallecurso} />
          <Route exact path="/inscribirse" component={Inscribirse} />
          <Route
            exact
            path="/inscribirsecarrera"
            component={Inscribirsecarrera}
          />
          <Route exact path="/calificaciones" component={Calificaciones} />
          <Route exact path="/changepassword" component={Changepassword} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
