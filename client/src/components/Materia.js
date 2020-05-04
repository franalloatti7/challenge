import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

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

const GET_MATERIAS = gql`
  {
    getMaterias {
      identificador
      idcarrera
      carrera{
        nombre
      }
      nombre
      descripcion
    }
  }
`;

const GET_MATERIA = gql`
  query GetMateria($identificador: UUID!) {
    getMateria(identificador: $identificador) {
      identificador
      idcarrera
      nombre
      descripcion
    }
  }
`;

const CREATE_MATERIA = gql`
  mutation CreateMateria(
    $nombre: String!
    $descripcion: String!
    $idcarrera: UUID!
  ) {
    createMateria(
      input: {
        nombre: $nombre
        descripcion: $descripcion
        idcarrera: $idcarrera
      }
    ) {
      identificador
      nombre
      idcarrera
    }
  }
`;

const UPDATE_MATERIA = gql`
  mutation UpdateMateria(
    $nombre: String!
    $descripcion: String!
    $idcarrera: UUID!
    $identificador: UUID!
  ) {
    updateMateria(
      nombre: $nombre
      descripcion: $descripcion
      idcarrera: $idcarrera
      identificador: $identificador
    ) {
      nombre
    }
  }
`;

const Materia = () => {
  //atributos materia
  const [identificador, setIdentificador] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idcarrera, setIdCarrera] = useState("");
  //componente boton
  const [accion, setAccion] = useState("agregar");
  const [permitir, setPermitir] = useState("");
  const [updateMateria] = useMutation(UPDATE_MATERIA);
  const [createMateria] = useMutation(CREATE_MATERIA);

  const carreras = useQuery(GET_CARRERAS);

  const getMateria = useQuery(GET_MATERIA, {
    variables: { identificador },
  });

  useEffect(() => {
    let data = getMateria.data;
    if (data) {
      let materia = data.getMateria;
      setIdentificador(materia.identificador);
      setNombre(materia.nombre);
      setDescripcion(materia.descripcion);
      setIdCarrera(materia.idcarrera);
      setPermitir("disabled");
    }
  }, [getMateria]);
  const { loading, error, data } = useQuery(GET_MATERIAS);
  if (loading) return <p>Cargando Materias...</p>;
  if (error) {
    return <p>Error</p>;
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (identificador === "") {
      createMateria({
        variables: {
          nombre,
          descripcion,
          idcarrera,
        },
      })
        .then((data) => {
          alert("La materia se registró con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          alert("No se pudo registrar la materia. Reintente");
        });
    } else {
      updateMateria({
        variables: {
          nombre,
          descripcion,
          idcarrera,
          identificador,
        },
      })
        .then((data) => {
          alert("La materia se actualizó con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          alert("No se pudo actualizar la materia. Reintente");
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
                  required
                  disabled={permitir}
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
                <input
                  required
                  type="text"
                  placeholder="Nombre"
                  className="form-control"
                  onChange={(e) => setNombre(e.target.value)}
                  value={nombre}
                ></input>
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  placeholder="Descripcion"
                  className="form-control"
                  onChange={(e) => setDescripcion(e.target.value)}
                  value={descripcion}
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
              <th scope="col">Descripcion</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data.getMaterias.map(({ identificador, nombre, descripcion, carrera }) => (
              <tr key={identificador} className="table-secondary">
                <th>{carrera.nombre}</th>
                <th>{nombre}</th>
                <th>{descripcion}</th>
                <th>
                <button
                        className="btn btn-sm m-1 btn-info darken-7"
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Materia;
