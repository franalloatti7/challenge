import React, { useState, useEffect, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
const GET_ALUMNOS = gql`
  {
    getAlumnos {
      identificador
      legajo
      persona {
        nombre
        apellido
      }
    }
  }
`;

const GET_ESTADO_ACADEMICO = gql`
  query GetEstadoAcademico($identificador: UUID!) {
    getEstadoAcademico(identificador: $identificador) {
      legajo
      persona {
        nombre
        apellido
      }
      inscripciones_curso {
        identificador
        fechainscripcion
        estado
        nota
        curso {
          anio
          materia {
            nombre
            carrera {
              identificador
              nombre
            }
          }
        }
      }
      inscripciones_carrera {
        identificador
        fechainscripcion
        carrera {
          identificador
          nombre
        }
      }
    }
  }
`;

const GET_INSCRIPCIONESANTERIORES = gql`
  query GetInscripcionesAnteriores($identificador: UUID!) {
    getInscripcionesAnteriores(idalumno: $identificador) {
      identificador
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
          carrera {
            identificador
            nombre
          }
        }
      }
    }
  }
`;

const Estadoacademico = () => {
  //atributos estadoacademico
  const misCarreras = [];
  const [identificador, setIdentificador] = useState("");
  const [estadoAcademico, setEstadoAcademico] = useState("");
  const [inscripcionesAnteriores, setInscripcionesAnteriores] = useState("");
  const getEstadoAcademico = useQuery(GET_ESTADO_ACADEMICO, {
    variables: { identificador },
  });
  const getInscripcionesAnteriores = useQuery(GET_INSCRIPCIONESANTERIORES, {
    variables: { identificador },
  });

  useEffect(() => {
    // $("select").select2();
    let data = getEstadoAcademico.data;
    if (data) {
      setEstadoAcademico(data.getEstadoAcademico);
    }
    let data2 = getInscripcionesAnteriores.data;
    if (data2) {
      setInscripcionesAnteriores(data2.getInscripcionesAnteriores);
    }
  }, [getEstadoAcademico, getInscripcionesAnteriores]);

  const { loading, error, data } = useQuery(GET_ALUMNOS);
  if (loading) return <p>Cargando Alumnos...</p>;
  if (error) {
    return <p>Error</p>;
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <label>Alumno</label>
                  <Select2
                    required
                    className="custom-select"
                    id="identificador"
                    name="identificador"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    data={data.getAlumnos.map(
                      ({ identificador, legajo, persona }) => ({
                        text: `${persona.apellido} ${persona.nombre} (Nro. Legajo: ${legajo})`,
                        id: identificador,
                      })
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            {estadoAcademico ? (
              <Fragment>
                <h3>
                  Estado académico del alumno:{" "}
                  {`${estadoAcademico.persona.apellido} ${estadoAcademico.persona.nombre}`}
                </h3>
                <h5>Nro de Legajo : {estadoAcademico.legajo}</h5>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Inscripciones a carreras:</h5>
                    <table className="table table-success">
                      <thead>
                        <tr>
                          <th scope="col">Carrera</th>
                          <th scope="col">Fecha Inscripcion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estadoAcademico.inscripciones_carrera.map(
                          ({ carrera, fechainscripcion, identificador }) => (
                            <tr key={identificador} className="table-secondary">
                              <td>{carrera.nombre}</td>
                              <td>{fechainscripcion}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h5>Inscripciones actuales a cursos:</h5>
                    <table className="table table-success">
                      <thead>
                        <tr>
                          <th scope="col">Materia</th>
                          <th scope="col">Curso</th>
                          <th scope="col">Fecha Inscripcion</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estadoAcademico.inscripciones_curso.map(
                          ({
                            identificador,
                            curso,
                            fechainscripcion,
                            nota,
                            estado,
                          }) => (
                            <tr key={identificador} className="table-secondary">
                              <td>{curso.materia.nombre}</td>
                              <td>{curso.nombre}</td>
                              <td>{fechainscripcion}</td>
                              <td>{estado}</td>
                              <td>{nota}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-md-12">
                  <h5>Inscripciones a cursos anteriores:</h5>
                  <table className="table table-success">
                    <thead>
                      <tr>
                        <th scope="col">Carrera</th>
                        <th scope="col">Materia</th>
                        <th scope="col">Curso</th>
                        <th scope="col">Fecha Inscripcion</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Nota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscripcionesAnteriores
                        ? inscripcionesAnteriores.map(
                            ({
                              identificador,
                              curso,
                              estado,
                              nota,
                              fechainscripcion,
                            }) => (
                              <tr
                                key={identificador}
                                className="table-secondary"
                              >
                                <td>{curso.materia.carrera.nombre}</td>
                                <td>{curso.materia.nombre}</td>
                                <td>{curso.anio}</td>
                                <td>{fechainscripcion}</td>
                                <td>{estado}</td>
                                <td>{nota}</td>
                              </tr>
                            )
                          )
                        : null}
                    </tbody>
                  </table>
                </div>
                <div className="col-md-12">
                  <h3>Promedio general por carrera</h3>
                  <table className="table table-success">
                    <thead>
                      <tr>
                        <th scope="col">Carrera</th>
                        <th scope="col">Cursos aprobados</th>
                        <th scope="col">Cursos desaprobados</th>
                        <th scope="col">Promedio con aplazos</th>
                        <th scope="col">Promedio sin aplazos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadoAcademico.inscripciones_carrera.map(
                        ({ carrera, fechainscripcion, identificador }) => {
                          let identificadorCarrera = carrera.identificador;
                          let notas = 0;
                          let cantMaterias = 0;
                          let notasDesaprobadas = 0;
                          let cantMateriasDesaprobadas = 0;
                          if (inscripcionesAnteriores) {
                            inscripcionesAnteriores.map(
                              ({
                                identificador,
                                curso,
                                estado,
                                nota,
                                fechainscripcion,
                              }) => {
                                if (
                                  identificadorCarrera ===
                                  curso.materia.carrera.identificador
                                ) {
                                  if (estado === "Aprobado") {
                                    notas = notas + nota;
                                    cantMaterias = cantMaterias + 1;
                                  } else if (estado === "Desaprobado") {
                                    notasDesaprobadas =
                                      notasDesaprobadas + nota;
                                    cantMateriasDesaprobadas =
                                      cantMateriasDesaprobadas + 1;
                                  }
                                }
                              }
                            );
                          }
                          let promediocon;
                          let promediosin;
                          if ((cantMaterias + cantMateriasDesaprobadas) > 0) {
                            promediocon = parseFloat((notas + notasDesaprobadas) / (cantMaterias + cantMateriasDesaprobadas));
                          } else {
                            promediocon = "";
                          }
                          if (cantMaterias > 0) {
                            promediosin = parseFloat(notas / cantMaterias);
                          } else {
                            promediosin = "";
                          }
                          return (
                            <tr
                              key={carrera.identificador}
                              className="table-secondary"
                            >
                              <th scope="col">{carrera.nombre}</th>
                              <th scope="col">{cantMaterias}</th>
                              <th scope="col">{cantMateriasDesaprobadas}</th>
                              <th scope="col">{promediocon}</th>
                              <th scope="col">{promediosin}</th>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadoacademico;
