import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_CARRERAS = gql`
  {
    getCarreras {
      identificador
      nombre
      descripcion
    }
  }
`;

const GET_MISINSCRIPCIONESCAR = gql`
  query GetMisInscripcionesCar($token: String!) {
    getMisInscripcionesCar(token: $token) {
      identificador
      fechainscripcion
      idcarrera
      carrera {
        nombre
      }
    }
  }
`;

const CREATE_INSCRIPCION_CARRERA = gql`
  mutation CreateInscripcionCarrera(
    $inpidcarrera: UUID!
    $fechainscripcion: Date!
    $token: String!
  ) {
    createInscripciones_carrera(
      input: {
        idcarrera: $inpidcarrera
        fechainscripcion: $fechainscripcion
        token: $token
      }
    ) {
      identificador
    }
  }
`;

const Inscribirsecarrera = () => {
  //atributos carrera
  const [inpidcarrera, setIdCarrera] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [fechainscripcion, setFechaInscripcion] = useState("");
  //componente boton
  const getCarreras = useQuery(GET_CARRERAS);
  const [createInscripciones_carrera] = useMutation(CREATE_INSCRIPCION_CARRERA);
  let componente = "";

  const getMisInscripcionesCar = useQuery(GET_MISINSCRIPCIONESCAR, {
    variables: { token },
  });

  const submitForm = (e) => {
    e.preventDefault();
    var inscripto = false;
    getMisInscripcionesCar.data.getMisInscripcionesCar.map(
      ({ idcarrera }) => {
        if (idcarrera === inpidcarrera) {
          inscripto = true;
        }
        return null;
      }
    );
    if (inscripto) {
      alert('Ya se encuentra inscripto/a a esta carrera');
    } else {
      createInscripciones_carrera({
        variables: {
          inpidcarrera,
          fechainscripcion,
          token
        },
      })
        .then((data) => {
          alert('Se registro con éxito a la carrera');
          window.location.reload();
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
  }, [getCarreras]);

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
                    id="inpidcarrera"
                    value={inpidcarrera}
                    onChange={(e) => setIdCarrera(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getCarreras.data
                      ? getCarreras.data.getCarreras.map(
                          ({ identificador, nombre }) => (
                            <option key={identificador} value={identificador}>
                              {nombre}
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
                          <th scope="col">Carrera</th>
                          <th scope="col">Fecha Inscripcion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getMisInscripcionesCar.data
                          ? getMisInscripcionesCar.data.getMisInscripcionesCar.map(
                              ({
                                identificador,
                                carrera,
                                fechainscripcion,
                              }) => (
                                <tr
                                  key={identificador}
                                  className="table-secondary"
                                >
                                  <td>{carrera.nombre}</td>
                                  <td>{fechainscripcion}</td>
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

  return (
    <div className="row">
      {componente === "" ? (
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2>
                Debe estar logeado como alumno para inscribirse a una carrera
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

export default Inscribirsecarrera;
