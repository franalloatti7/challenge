import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_MISCURSOS = gql`
  query GetMisCursos($token: String!) {
    getMisCursos(token: $token) {
      identificador
      materia {
        nombre
      }
      anio
    }
  }
`;

const GET_ALUMNOSCURSO = gql`
  query GetAlumnosCurso($idcurso: UUID!) {
    getAlumnosCurso(idcurso: $idcurso) {
      identificador
      persona {
        nombre
        apellido
      }
      inscripciones_curso {
        identificador
        nota
        estado
        fechainscripcion
      }
    }
  }
`;

const UPDATE_NOTAALUMNO = gql`
  mutation UpdateNotaAlumno(
    $nota: Int!
    $estado: String!
    $identificador: UUID!
    $token: String!
  ) {
    updateNotaAlumno(
      nota: $nota
      estado: $estado
      identificador: $identificador
      token: $token
    ) {
      identificador
    }
  }
`;

const Calificaciones = () => {
  //atributos carrera
  const token = sessionStorage.getItem("token");
  const [idcurso, setIdCurso] = useState("");
  //componente boton
  const [updateNotaAlumno] = useMutation(UPDATE_NOTAALUMNO);
  const getMisCursos = useQuery(GET_MISCURSOS, {
    variables: { token },
  });

  const getAlumnosCurso = useQuery(GET_ALUMNOSCURSO, {
    variables: { idcurso },
  });


  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Alumno</label>
                <select
                  required
                  className="custom-select"
                  id="idcurso"
                  value={idcurso}
                  onChange={(e) => setIdCurso(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {getMisCursos.data
                    ? getMisCursos.data.getMisCursos.map(
                        ({ identificador, materia, anio }) => (
                          <option key={identificador} value={identificador}>
                            {materia.nombre + " " + anio}
                          </option>
                        )
                      )
                    : ""}
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h1 className="card-title">Curso</h1>
                </div>
                <div className="card-body">
                  <table className="table table-success">
                    <thead>
                      <tr>
                        <th scope="col">Alumno</th>
                        <th scope="col">Fecha inscripción</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Nota</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                    {getAlumnosCurso.data
                          ? getAlumnosCurso.data.getAlumnosCurso.map(
                              ({
                                identificador,
                                persona,
                                inscripciones_curso,
                              }) => (
                                <tr
                                  key={identificador}
                                  className="table-secondary"
                                >
                                  <td>{`${persona.apellido} ${persona.nombre}`}</td>
                                  <td>{inscripciones_curso[0].fechainscripcion}</td>
                                  <td>{inscripciones_curso[0].estado}</td>
                                  <td>{inscripciones_curso[0].nota}</td>
                                          <td>
                                          <button
                      className="btn btn-sm btn-info darken-7"
                      onClick={async (e) => {
                          e.preventDefault();
                          var nota = prompt("Por favor ingrese la nota del alumno");
                          if(nota !== null && nota !== ""){
                              var estado = ""
                              if (nota >= 6) {
                                estado = 'Aprobado';
                              } else {
                                estado = 'Desaprobado';
                              }
                              await updateNotaAlumno({
                                  variables: {
                                    nota: parseInt(nota),
                                    estado,
                                    identificador: inscripciones_curso[0].identificador,
                                    token
                                },
                              });
                            alert("Se cargo la nota con éxito");
                            }
                      }}
                    >
                      Cargar Nota
                    </button>
                                  </td>
                                </tr>
                              )
                            )
                          : null}           
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
};

export default Calificaciones;
