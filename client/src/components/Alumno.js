import React, { useState, useEffect } from "react";
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

const GET_ALUMNO = gql`
  query GetAlumno($inpidentificador: UUID!) {
    getAlumno(identificador: $inpidentificador) {
      legajo
      idpersona
      identificador
    }
  }
`;

const CREATE_ALUMNO = gql`
  mutation CreateAlumno($legajo: Int!, $idPersona: UUID!) {
    createAlumno(input: { legajo: $legajo, idpersona: $idPersona }) {
      identificador
      idpersona
      legajo
    }
  }
`;

const UPDATE_ALUMNO = gql`
  mutation UpdateAlumno(
    $legajo: Int!
    $idPersona: UUID!
    $inpidentificador: UUID!
  ) {
    updateAlumno(
      legajo: $legajo
      idpersona: $idPersona
      identificador: $inpidentificador
    ) {
      legajo
    }
  }
`;

const Alumno = () => {
  //atributos persona
  const [inpidentificador, setIdentificador] = useState("");
  const [legajo, setLegajo] = useState('');
  const [idPersona, setIdPersona] = useState("");
  //componente boton
  const [permitir, setPermitir] = useState("");
  const [accion, setAccion] = useState("agregar");
  let boton;
  if (accion === "agregar") {
    boton = <button className="btn btn-success btn-block">Guardar</button>;
  } else {
    boton = <button className="btn btn-success btn-block">Editar</button>;
  }
  const [updateAlumno] = useMutation(UPDATE_ALUMNO);
  const [createAlumno] = useMutation(CREATE_ALUMNO);

  const personas = useQuery(GET_PERSONAS);
  const getAlumno = useQuery(GET_ALUMNO, {
    variables: { inpidentificador },
  });
  useEffect(() => {
    let data = getAlumno.data;
    if (data) {
      let alumno = data.getAlumno;
      setIdentificador(alumno.identificador);
      setLegajo(parseInt(alumno.legajo));
      setIdPersona(alumno.idpersona);
      setAccion("modificar");
      setPermitir("disabled");
    }
  }, [getAlumno]);
  const { loading, error, data } = useQuery(GET_ALUMNOS);
  if (loading) return <p>Cargando Alumnos...</p>;
  if (error) {
    return <p>Error</p>;
  }

  const submitForm = (e) => {
    e.preventDefault();
    if (inpidentificador === "") {
        createAlumno({
          variables: {
            legajo,
            idPersona,
          },
        }).then(({ data }) => {
          alert("El/la alumno/a se registró con éxito");
          window.location.reload()
        }).catch(({message}) => {
          if (message.includes("legajo")) {
            alert('El legajo ingresado ya se encuentra registrado.');
          }else if (message.includes("alumno_idpersona")) {
            alert('El/la alumno/a ingresado/a ya se encuentra registrado/a.');
          }else{
            alert('No se pudo registrar el/la alumno/a. Reintente');
          }
        });
    } else {
      updateAlumno({
        variables: {
          legajo,
          idPersona,
          inpidentificador,
        },
      }).then(({data}) => {
        alert("El/la alumno/a se actualizó con éxito");
        window.location.reload();
      }).catch(({message}) => {
        if (message.includes("legajo")) {
          alert('El legajo ingresado ya se encuentra registrado.');
        }else {
          alert('No se pudo registrar el/la alumno/a. Reintente');
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
                value={idPersona}
                
                onChange={(e) => setIdPersona(e.target.value)}
                disabled={permitir} >
                       <option value="">Seleccione</option>           
                {personas.data ? personas.data.getPersonas.map(
                  ({ identificador, nombre, apellido }) => (
                        <option key={identificador} value={identificador}>{apellido + " " + nombre}</option>
                  )
                ): null}
              </select>
            </div>
              <div className="form-group">
                <input
                  required
                  type="number"
                  placeholder="Legajo"
                  className="form-control"
                  onChange={(e) => setLegajo(parseInt(e.target.value))}
                  value={legajo}
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
              <th scope="col">Legajo</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
          {data.getAlumnos.map(({ identificador, legajo, persona }) => (
          <tr key={identificador} className="table-secondary">
            <th>{persona.apellido + " " + persona.nombre}</th>
            <th>{legajo}</th>
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
        ))}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alumno;
