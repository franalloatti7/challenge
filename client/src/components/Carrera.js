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

const GET_CARRERA = gql`
  query GetCarrera($identificador: UUID!) {
    getCarrera(identificador: $identificador) {
      identificador
      nombre
      descripcion
      fechadesde
    }
  }
`;

const CREATE_CARRERA = gql`
  mutation CreateCarrera(
    $nombre: String!
    $descripcion: String!
    $fechadesde: Date!
  ) {
    createCarrera(
      input: {
        nombre: $nombre
        descripcion: $descripcion
        fechadesde: $fechadesde
      }
    ) {
      identificador
      nombre
      descripcion
    }
  }
`;

const UPDATE_CARRERA = gql`
  mutation UpdateCarrera(
    $nombre: String!
    $descripcion: String!
    $fechadesde: Date!
    $identificador: UUID!
  ) {
    updateCarrera(
      nombre: $nombre
      descripcion: $descripcion
      fechadesde: $fechadesde
      identificador: $identificador
    ) {
      nombre
    }
  }
`;

const UPDATE_FECHACARRERA = gql`
  mutation UpdateFechaCarrera($fechahasta: Date!, $identificador: UUID!) {
    updateFechaCarrera(fechahasta: $fechahasta, identificador: $identificador) {
      nombre
    }
  }
`;

const Carrera = () => {
  //atributos carrera
  const [identificador, setIdentificador] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechadesde, setFechaDesde] = useState("");
  const [fechahasta, setFechaHasta] = useState("");
  //componente boton
  const [accion, setAccion] = useState("agregar");
  const [permitir, setPermitir] = useState("");
  const [updateCarrera] = useMutation(UPDATE_CARRERA);
  const [updateFechaCarrera] = useMutation(UPDATE_FECHACARRERA);
  const [createCarrera] = useMutation(CREATE_CARRERA);

  const getCarrera = useQuery(GET_CARRERA, {
    variables: { identificador },
  });

  useEffect(() => {
    let data = getCarrera.data;
    if (data) {
      let carrera = data.getCarrera;
      setIdentificador(carrera.identificador);
      setNombre(carrera.nombre);
      setDescripcion(carrera.descripcion);
      setFechaDesde(carrera.fechadesde);
      setPermitir("disabled");
    }
    if (fechahasta !== "") {
      updateFechaCarrera({
        variables: {
          fechahasta,
          identificador,
        },
      });
      window.location.reload();
    }
  }, [getCarrera, fechahasta, identificador, updateFechaCarrera]);
  const { loading, error, data } = useQuery(GET_CARRERAS);
  if (loading) return <p>Cargando Carreras...</p>;
  if (error) {
    return <p>Error</p>;
  }

  const submitForm = async (e) => {
    e.preventDefault();
    if (identificador === "") {
      await createCarrera({
        variables: {
          nombre,
          descripcion,
          fechadesde,
        },
      }).then((data) => {
        alert("La carrera se registró con éxito");
        window.location.reload();
      }).catch(({message}) => {
          alert('No se pudo registrar la carrera. Reintente');
      });
    } else {
      await updateCarrera({
        variables: {
          nombre,
          descripcion,
          fechadesde,
          identificador,
        },
      }).then((data) => {
        alert("La carrera se actualizó con éxito");
        window.location.reload();
      }).catch(({message}) => {
          alert('No se pudo actualizar la carrera. Reintente');
      });
    }
  };

  let boton;
  if (accion === "agregar") {
    boton = <button className="btn btn-success btn-block">Guardar</button>;
  } else if (accion === "editar") {
    boton = <button className="btn btn-success btn-block">Editar</button>;
  } else {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    setFechaHasta(today);
    setAccion("agregar");
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
              <div className="form-group">
                <label>Fecha inicio</label>
                <input
                  required
                  type="date"
                  className="form-control"
                  disabled={permitir}
                  value={fechadesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
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
              <th scope="col">Descripcion</th>
              <th scope="col">Fecha</th>
              <th scope="col"></th>
            </tr>
          </thead>
            <tbody>
        {data.getCarreras.map(
          ({ identificador, nombre, descripcion, fechadesde, fechahasta }) => (
          <tr key={identificador} className="table-secondary">
            <th>{nombre}</th>
            <th>{descripcion}</th>
            <th>{fechadesde}{fechahasta !== null ? " / " + fechahasta : ""}</th>
            <th>
            {fechahasta === null ? (
                      <div>
                        <button
                          className="btn btn-small m-1 btn-info darken-7"
                          onClick={async (e) => {
                            e.preventDefault();
                            setIdentificador(identificador);
                            setAccion("editar");
                          }}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-small m-1 btn-info darken-7"
                          onClick={async (e) => {
                            e.preventDefault();
                            let confirmacion = window.confirm(
                              "Esta seguro/a que desea cerrar la carrera?"
                            );
                            if (confirmacion) {
                              setIdentificador(identificador);
                              setAccion("cerrar");
                            }
                          }}
                        >
                          Cerrar
                        </button>{" "}
                      </div>
                    ) : (
                      <div>CERRADA</div>
                    )}
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

export default Carrera;
