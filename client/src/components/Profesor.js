import React, { useState , useEffect} from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const GET_PERSONAS = gql`
  {
    getPersonas {
      identificador
      nombre
      apellido
    }
  }
`;

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

const GET_PROFESOR = gql`
  query GetProfesor($inpidentificador: UUID!) {
    getProfesor(identificador: $inpidentificador) {
      descripcion_cargo
      idpersona
      identificador
    }
  }
`;

const CREATE_PROFESOR = gql`
  mutation CreateProfesor($descripcion_cargo: String!, $idpersona: UUID!) {
    createProfesor(
      input: { descripcion_cargo: $descripcion_cargo, idpersona: $idpersona }
    ) {
      identificador
      idpersona
      descripcion_cargo
    }
  }
`;



const UPDATE_PROFESOR = gql`
  mutation UpdateProfesor(
    $descripcion_cargo: String!
    $idpersona: UUID!
    $inpidentificador: UUID!
  ) {
    updateProfesor(
      descripcion_cargo: $descripcion_cargo
      idpersona: $idpersona
      identificador: $inpidentificador
    ) {
        descripcion_cargo
    }
  }
`;

const Profesor = () => {
  //atributos persona
  const [inpidentificador, setIdentificador] = useState("");
  const [descripcion_cargo, setDescripcionCargo] = useState("");
  const [idpersona, setIdPersona] = useState("");
  //componente boton
  const [permitir, setPermitir] = useState("");
  const [accion, setAccion] = useState("agregar");
  let boton;
  if (accion === "agregar") {
    boton = <button className="btn btn-success btn-block">Guardar</button>;
  } else {
    boton = <button className="btn btn-success btn-block">Editar</button>;
  }
  const [updateProfesor] = useMutation(UPDATE_PROFESOR);
  const [createProfesor] = useMutation(CREATE_PROFESOR);

    const personas = useQuery(GET_PERSONAS);
    const getProfesor = useQuery(GET_PROFESOR, {
        variables: { inpidentificador },
    });
    useEffect(() => {
        let data = getProfesor.data;
        if (data) {
          let profesor = data.getProfesor;
          setIdentificador(profesor.identificador);
          setDescripcionCargo(profesor.descripcion_cargo);
          setIdPersona(profesor.idpersona);
          setAccion("modificar");
          setPermitir("disabled");
        }
      }, [getProfesor]);
  const { loading, error, data } = useQuery(GET_PROFESORES);
  if (loading) return <p>Cargando Profesores...</p>;
  if (error) {
    return <p>Error</p>;
  }

  

  const submitForm = (e) => {
      e.preventDefault();
    if (inpidentificador === "") {
        createProfesor({
          variables: {
            descripcion_cargo,
            idpersona,
          },
        }).then(({ data }) => {
          alert("El/la profesor/a se registró con éxito");
          window.location.reload()
        }).catch(({ message }) => {
          if (message.includes("profesor_idpersona")) {
            alert('El/la profesor/a ingresado/a ya se encuentra registrado/a.');
          } else{
            alert('No se pudo registrar el/la profesor/a. Reintente');
          }
        });
      } else {
        updateProfesor({
            variables: {
              descripcion_cargo,
              idpersona,
              inpidentificador,
            },
          }).then(({ data }) => {
            alert("El/la profesor/a se actualizó con éxito");
            window.location.reload()
          }).catch(({ message }) => {
            if (message.includes("profesor_idpersona")) {
              alert('El/la profesor/a ingresado/a ya se encuentra registrado/a.');
            } else{
              alert('No se pudo registrar el/la profesor/a. Reintente');
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
                <label>Persona</label>
                <select
                  required
                  className="custom-select"
                  id="idpersona"
                  value={idpersona}
                  disabled={permitir}
                  onChange={(e) => setIdPersona(e.target.value)}
                >
                  <option value="">Seleccione</option>
                  {personas.data ? personas.data.getPersonas.map(
                    ({ identificador, nombre, apellido }) => (
                      <option key={identificador} value={identificador}>
                        {apellido + " " + nombre}
                      </option>
                    )
                  ) : ''}
                </select>
              </div>
              <div className="form-group">
                <input
                  required
                  type="text"
                  placeholder="Descripcion Cargo"
                  className="form-control"
                  onChange={(e) => setDescripcionCargo(e.target.value)}
                  value={descripcion_cargo}
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
              <th scope="col">Cargo</th>
              <th scope="col"></th>
            </tr>
          </thead>
            <tbody>
        {data.getProfesores.map(
          ({ identificador, descripcion_cargo, persona }) => (
          <tr key={identificador} className="table-secondary">
            <th>{persona.apellido + " " + persona.nombre}</th>
            <th>{descripcion_cargo}</th>
            <th>
            <button
                      className="btn btn-info darken-7"
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

export default Profesor;
