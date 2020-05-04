import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_PROFESORES = gql`
  {
    getProfesores {
      identificador
      idpersona
      descripcion_cargo
      persona {
        nombre
        apellido
      }
    }
  }
`;

const GET_CARRERAS = gql`
  {
    getCarreras {
      identificador
      nombre
      descripcion
      fechadesde
      fechahasta
    }
  }
`;

const GET_MATERIAS_CAR = gql`
  query GetMateriasCar($idcarrera: UUID!) {
    getMateriasCar(idcarrera: $idcarrera) {
      identificador
      nombre
    }
  }
`;

const GET_CURSOS = gql`
  {
    getCursos {
      identificador
      cupomaximo
      anio
      profesor {
        identificador
      }
      materia {
        nombre
        carrera {
          nombre
        }
      }
    }
  }
`;

const GET_CURSO = gql`
  query GetCurso($identificador: UUID!) {
    getCurso(identificador: $identificador) {
      identificador
      idmateria
      materia {
        idcarrera
      }
      cupomaximo
      anio
      idprofesor
    }
  }
`;

const CREATE_CURSO = gql`
  mutation CreateCurso(
    $idmateria: UUID!
    $cupomaximo: Int!
    $anio: Int!
    $idprofesor: UUID!
  ) {
    createCurso(
      input: {
        idmateria: $idmateria
        cupomaximo: $cupomaximo
        anio: $anio
        idprofesor: $idprofesor
      }
    ) {
      identificador
    }
  }
`;

const UPDATE_CURSO = gql`
  mutation UpdateCurso(
    $idprofesor: UUID!
    $cupomaximo: Int!
    $anio: Int!
    $idmateria: UUID!
    $identificador: UUID!
  ) {
    updateCurso(
      idprofesor: $idprofesor
      idmateria: $idmateria
      cupomaximo: $cupomaximo
      anio: $anio
      identificador: $identificador
    ) {
      identificador
    }
  }
`;

const Curso = () => {
  //atributos curso
  const [identificador, setIdentificador] = useState("");
  const [idprofesor, setIdProfesor] = useState("");
  const [idcarrera, setIdCarrera] = useState("");
  const [idmateria, setIdMateria] = useState("");
  const [anio, setAnio] = useState("");
  const [cupomaximo, setCupoMaximo] = useState("");
  //componente boton
  const [accion, setAccion] = useState("agregar");
  const [permitir, setPermitir] = useState("");
  const [updateCurso] = useMutation(UPDATE_CURSO);
  const [createCurso] = useMutation(CREATE_CURSO);
  const anioActual = new Date().getFullYear();
  var opcionesAnio = [];
  for (var i = anioActual - 2; i < anioActual + 5; i++) {
    opcionesAnio.push(i);
  }
  const getCurso = useQuery(GET_CURSO, {
    variables: { identificador },
  });
  const profesores = useQuery(GET_PROFESORES);
  const carreras = useQuery(GET_CARRERAS);
  const getMateriasCar = useQuery(GET_MATERIAS_CAR, {
    variables: { idcarrera },
  });
  useEffect(() => {
    let data = getCurso.data;
    if (data) {
      let curso = data.getCurso;
      setIdentificador(curso.identificador);
      setIdProfesor(curso.idprofesor);
      setAnio(parseInt(curso.anio));
      setCupoMaximo(parseInt(curso.cupomaximo));
      setIdCarrera(curso.materia.idcarrera);
      setIdMateria(curso.idmateria);
      setPermitir("disabled");
    }
  }, [getCurso, getMateriasCar]);
  const { loading, error, data } = useQuery(GET_CURSOS);
  if (loading) return <p>Cargando Cursos...</p>;
  if (error) {
    return <p>Error</p>;
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (identificador === "") {
      createCurso({
        variables: {
          anio,
          cupomaximo,
          idmateria,
          idprofesor,
        },
      })
        .then((data) => {
          alert("El curso se registró con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          alert("No se pudo registrar el curso. Reintente");
        });
    } else {
      updateCurso({
        variables: {
          anio,
          cupomaximo,
          idmateria,
          idprofesor,
          identificador,
        },
      })
        .then((data) => {
          alert("El curso se actualizó con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          alert("No se pudo actualizar el curso. Reintente");
        });
    }
  };

  let boton;
  if (accion === "agregar") {
    boton = <button className="btn btn-success btn-block">Guardar</button>;
  } else if (accion === "editar") {
    boton = <button className="btn btn-success btn-block">Editar</button>;
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <form
              onSubmit={(e) => {
                submitForm(e);
              }}
            >
              <div className="form-group">
                <label>Carrera</label>
                <select
                  disabled={permitir}
                  required
                  className="custom-select"
                  id="idcarrera"
                  value={idcarrera}
                  onChange={(e) => setIdCarrera(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {carreras.data
                    ? carreras.data.getCarreras.map(
                        ({ identificador, nombre }) => (
                          <option key={identificador} value={identificador}>
                            {nombre}
                          </option>
                        )
                      )
                    : ""}
                </select>
              </div>

              <div className="form-group">
                <label>Materia</label>
                {idcarrera !== "" ? (
                  <select
                    disabled={permitir}
                    required
                    className="custom-select"
                    id="idmateria"
                    value={idmateria}
                    onChange={(e) => setIdMateria(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getMateriasCar.data
                      ? getMateriasCar.data.getMateriasCar.map(
                          ({ identificador, nombre }) => (
                            <option key={identificador} value={identificador}>
                              {nombre}
                            </option>
                          )
                        )
                      : ""}
                  </select>
                ) : (
                  ""
                )}
              </div>
              <div className="form-group">
                <label>Profesor</label>
                <select
                  required
                  className="custom-select"
                  id="idprofesor"
                  value={idprofesor}
                  onChange={(e) => setIdProfesor(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {profesores.data
                    ? profesores.data.getProfesores.map(
                        ({ identificador, persona }) => (
                          <option key={identificador} value={identificador}>
                            {persona.apellido + " " + persona.nombre}
                          </option>
                        )
                      )
                    : ""}
                </select>
              </div>
              <div className="form-group">
                <label>Año</label>
                <select
                  required
                  className="custom-select"
                  id="anio"
                  value={anio}
                  onChange={(e) => setAnio(parseInt(e.target.value))}
                >
                  <option value="">Seleccione</option>
                  {opcionesAnio.map((index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <input
                  required
                  type="number"
                  className="form-control"
                  placeholder="Cupo máximo"
                  value={cupomaximo}
                  onChange={(e) => setCupoMaximo(parseInt(e.target.value))}
                ></input>
              </div>
              {boton}
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <table className="table table-success">
          <thead>
            <tr>
              <th scope="col">Carrera</th>
              <th scope="col">Materia</th>
              <th scope="col">Curso</th>
              <th scope="col">Cupo</th>
              <th scope="col"></th>
            </tr>
          </thead>
              <tbody>
          {data.getCursos.map(
            ({ identificador, materia, anio, cupomaximo }) => (
                <tr key={identificador} className="table-secondary">
                <th>{materia.carrera.nombre}</th>
                <th>{materia.nombre}</th>
                  <th>{anio}</th>
                  <th>{cupomaximo}</th>
                  <th>
                    <button
                      className="btn btn-small btn-info darken-7"
                      onClick={async (e) => {
                        e.preventDefault();
                        setIdentificador(identificador);
                        setAccion("editar");
                      }}
                    >
                      Editar
                    </button>
                  </th>
                </tr>
            )
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Curso;
