import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_CURSOSPOSIBLES = gql`
  query GetCursosPosibles($token: String!) {
    getCursosPosibles(token: $token) {
      identificador
      cupomaximo
      anio
      materia {
        nombre
        carrera {
          nombre
        }
      }
    }
  }
`;

const GET_MISINSCRIPCIONES = gql`
  query GetMisInscripciones($token: String!) {
    getMisInscripciones(token: $token) {
      identificador
      idcurso
      estado
      nota
      fechainscripcion
      curso {
        anio
        profesor {
          persona {
            nombre
            apellido
          }
        }
        materia {
          nombre
        }
      }
    }
  }
`;

const CREATE_INSCRIPCION_CURSO = gql`
  mutation CreateInscripcionCurso(
    $token: String!
    $inpidcurso: UUID!
    $fechainscripcion: Date!
    $estado: String!
  ) {
    createInscripciones_curso(
      input: {
        token: $token
        idcurso: $inpidcurso
        fechainscripcion: $fechainscripcion
        estado: $estado
      }
    ) {
      identificador
    }
  }
`;

const Inscribirse = () => {
  //atributos curso
  const [inpidcurso, setIdCurso] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const estado = "inscripto";
  const [fechainscripcion, setFechaInscripcion] = useState("");
  //componente boton
  const getCursosPosibles = useQuery(GET_CURSOSPOSIBLES, {
    variables: { token },
  });
  const [createInscripciones_curso] = useMutation(CREATE_INSCRIPCION_CURSO);
  let componente = "";

  const getMisInscripciones = useQuery(GET_MISINSCRIPCIONES, {
    variables: { token },
  });

  const submitForm = (e) => {
    e.preventDefault();
    var inscripto = false;
    getMisInscripciones.data.getMisInscripciones.map(
      ({ idcurso }) => {
        if (idcurso === inpidcurso) {
          inscripto = true;
        }
        return null;
      }
    );
    if (inscripto) {
      alert('Ya se encuentra inscripto/a a este curso');
    } else {
    createInscripciones_curso({
      variables: {
        inpidcurso,
        token,
        fechainscripcion,
        estado,
      },
    })
      .then((data) => {
        alert('Se registro con éxito al curso');
        window.location.reload();
      })
      .catch((e) => {
        console.log(e);
      });
    }
  };

  useEffect(() => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    setFechaInscripcion(today);
  }, [getCursosPosibles]);


    componente = (
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-10">
                <div className="form-group">
                  <select
                    required
                    className="custom-select"
                    id="inpidcurso"
                    value={inpidcurso}
                    onChange={(e) => setIdCurso(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getCursosPosibles.data
                      ? getCursosPosibles.data.getCursosPosibles.map(
                          ({ identificador, anio, materia }) => (
                            <option key={identificador} value={identificador}>
                              {materia.nombre + " " + anio}
                            </option>
                          )
                        )
                      : ""}
                  </select>
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-group"></div>
                <form
                  onSubmit={(e) => {
                    submitForm(e);
                  }}
                >
                  <button className="btn btn-success btn-block">
                    Inscribirse
                  </button>
                </form>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h1 className="card-title">Mis Inscripciones</h1>
                  </div>
                  <div className="card-body">
                    <table className="table table-success">
                      <thead>
                        <tr>
                          <th scope="col">Materia</th>
                          <th scope="col">Curso</th>
                          <th scope="col">Profesor</th>
                          <th scope="col">Fecha Inscripcion</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                      {getMisInscripciones.data ? getMisInscripciones.data.getMisInscripciones.map(
                    ({ identificador, curso, estado, nota, fechainscripcion}) => (
                        <tr key={identificador} className="table-secondary">
                            <td>{curso.materia.nombre}</td>
                            <td>{curso.anio}</td>
                            <td>{curso.profesor.persona.apellido + " "+ curso.profesor.persona.nombre}</td>
                            <td>{fechainscripcion}</td>
                            <td>{estado}</td>
                            <td>{nota}</td>
                          </tr>
                          )
                          ) : null}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="row">
      {componente === "" ? (
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2>
                Debe estar logeado como alumno para inscribirse a un curso
              </h2>
            </div>
          </div>
        </div>
      ) : (
        componente
      )}
    </div>
  );
};

export default Inscribirse;
