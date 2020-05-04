import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

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

const GET_PERSONA = gql`
  query GetPersona($token: String!, $identificador: UUID!) {
    getPersona(token: $token, identificador: $identificador) {
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

const CREATE_PERSONA = gql`
  mutation CreatePersona(
    $tipodoc: String!
    $documento: Bigint!
    $nombre: String!
    $apellido: String!
    $fechanac: Date!
    $direccion: String!
    $password: String!
  ) {
    createPersona(
      input: {
        tipodoc: $tipodoc
        documento: $documento
        nombre: $nombre
        apellido: $apellido
        fechanac: $fechanac
        direccion: $direccion
        password: $password
      }
    ) {
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

const UPDATE_PERSONA = gql`
  mutation UpdatePersona(
    $tipodoc: String!
    $documento: Bigint!
    $nombre: String!
    $apellido: String!
    $fechanac: Date!
    $direccion: String!
    $identificador: UUID!
  ) {
    updatePersona(
      tipodoc: $tipodoc
      documento: $documento
      nombre: $nombre
      apellido: $apellido
      fechanac: $fechanac
      direccion: $direccion
      identificador: $identificador
    ) {
      nombre
    }
  }
`;

const Persona = () => {
  //atributos persona
  const [identificador, setIdentificador] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tipodoc, setTipoDoc] = useState("DNI");
  const [documento, setDocumento] = useState("");
  const [fechanac, setFechaNac] = useState("");
  const [direccion, setDireccion] = useState("");
  const [password, setPassword] = useState("");
  const [permitir, setPermitir] = useState("");
  //componente boton
  const [accion, setAccion] = useState("agregar");
  let boton;
  if (accion === "agregar") {
    boton = <button className="btn btn-success btn-block">Guardar</button>;
  } else {
    boton = <button className="btn btn-success btn-block">Editar</button>;
  }
  const [updatePersona] = useMutation(UPDATE_PERSONA);
  const [createPersona] = useMutation(CREATE_PERSONA);

  const getPersona = useQuery(GET_PERSONA, {
    variables: { token, identificador },
  });
  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    let data = getPersona.data;
    if (data) {
      let persona = data.getPersona;
      setIdentificador(persona.identificador);
      setNombre(persona.nombre);
      setApellido(persona.apellido);
      setTipoDoc(persona.tipodoc);
      setDocumento(persona.documento);
      setFechaNac(persona.fechanac);
      setDireccion(persona.direccion);
      // setPassword(persona.password);
      setAccion("modificar");
      setPermitir("disabled");
    }
  }, [getPersona]);
  const { loading, error, data } = useQuery(GET_PERSONAS);
  if (loading) return <p>Cargando Personas...</p>;
  if (error) {
    return <p>Error</p>;
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (identificador === "") {
      createPersona({
        variables: {
          tipodoc,
          documento,
          nombre,
          apellido,
          fechanac,
          direccion,
          password,
        },
      })
        .then(({ data }) => {
          alert("La persona se registró con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          if (message.includes("documento")) {
            alert("El documento ingresado ya se encuentra registrado.");
          } else {
            alert("No se pudo registrar la persona. Reintente");
          }
        });
    } else {
      updatePersona({
        variables: {
          tipodoc,
          documento,
          nombre,
          apellido,
          fechanac,
          direccion,
          identificador,
        },
      })
        .then(({ data }) => {
          alert("La persona se actualizó con éxito");
          window.location.reload();
        })
        .catch(({ message }) => {
          if (message.includes("documento")) {
            alert("El documento ingresado ya se encuentra registrado.");
          } else {
            console.log("No se pudo registrar la persona. Reintente");
          }
        });
    }
  };

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
                  placeholder="Apellido"
                  className="form-control"
                  onChange={(e) => setApellido(e.target.value)}
                  value={apellido}
                ></input>
              </div>
              <div className="form-group">
                <label>Tipo documento</label>
                <select
                  className="custom-select"
                  id="tipodoc"
                  value={tipodoc}
                  onChange={(e) => setTipoDoc(e.target.value)}
                >
                  <option value="DNI">DNI</option>
                  <option value="LC">LC</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  required
                  type="number"
                  placeholder="Documento"
                  className="form-control"
                  onChange={(e) => setDocumento(e.target.value)}
                  value={documento}
                ></input>
              </div>
              <div className="form-group">
                <label>Fecha nacimiento</label>
                <input
                  required
                  type="date"
                  className="form-control"
                  value={fechanac}
                  onChange={(e) => setFechaNac(e.target.value)}
                ></input>
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  placeholder="Direccion"
                  className="form-control"
                  onChange={(e) => setDireccion(e.target.value)}
                  value={direccion}
                ></input>
              </div>
              <div className="form-group">
                <input
                  disabled={permitir}
                  required
                  type="password"
                  placeholder="Contraseña"
                  className="form-control"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
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
              <th scope="col">Nombre</th>
              <th scope="col">Documento</th>
              <th scope="col"></th>
            </tr>
          </thead>
              <tbody>
          {data.getPersonas.map(
            ({ identificador, nombre, apellido, tipodoc, documento }) => (
                <tr key={identificador} className="table-secondary">
                  <th>{nombre + " " + apellido}</th>
                  <th>{tipodoc + ": " + documento}</th>
                  <th>
                    <button
                      className="btn btn-small btn-info darken-7"
                      onClick={async (e) => {
                        e.preventDefault();
                        setIdentificador(identificador);
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

export default Persona;
