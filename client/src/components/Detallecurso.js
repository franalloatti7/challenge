import React, { useState, useEffect, Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
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

const GET_MATERIAS_CAR = gql`
    query GetMateriasCar($idcarrera: UUID!) {
     getMateriasCar(idcarrera: $idcarrera) {
      identificador
      nombre
    }
  }
`;

const GET_CURSOS_MAT = gql`
  query GetCursosMat($idmateria: UUID!) {
    getCursosMat (idmateria: $idmateria){
      identificador
      anio
    }
  }
`;

const GET_DETALLE_CURSO = gql`
  query GetDetalleCurso($identificador: UUID!) {
    getDetalleCurso (identificador: $identificador){
      identificador
      anio
      materia{
        nombre
      }
    	profesor{
        persona{
          nombre
          apellido
        }
      }
    	inscripciones_curso{
        identificador
        fechainscripcion
        nota
        estado
        alumno {
          legajo
          persona{
            nombre
            apellido
          }
        }
      }
    }
  }
`;

const Detallecurso = () => {
  //atributos curso
  const [idcarrera, setIdCarrera] = useState("");
  const [idmateria, setIdMateria] = useState("");
  const [identificador, setIdentificador] = useState("");
  //componente boton


  const getCarreras = useQuery(GET_CARRERAS);
  const getMateriasCar = useQuery(GET_MATERIAS_CAR, {
    variables: { idcarrera },
  });
  const getCursosMat = useQuery(GET_CURSOS_MAT, {
    variables: { idmateria },
  });

  const getDetalleCurso = useQuery(GET_DETALLE_CURSO, {
    variables: { identificador },
  });

  useEffect(() => {
    
  }, [getMateriasCar, getCursosMat])
    
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Carrera</label>
                  <select
                    required
                    className="custom-select"
                    id="idcarrera"
                    value={idcarrera}
                    onChange={(e) => setIdCarrera(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getCarreras.data
                      ? getCarreras.data.getCarreras.map(({ identificador, nombre }) => (
                          <option key={identificador} value={identificador}>
                            {nombre}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Materia</label>
                  <select
                    required
                    className="custom-select"
                    id="idmateria"
                    value={idmateria}
                    onChange={(e) => setIdMateria(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getMateriasCar.data
                      ? getMateriasCar.data.getMateriasCar.map(({ identificador, nombre }) => (
                          <option key={identificador} value={identificador}>
                            {nombre}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <label>Curso</label>
                  <select
                    required
                    className="custom-select"
                    id="idpersona"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                  >
                    <option value="">Seleccione</option>
                    {getCursosMat.data
                      ? getCursosMat.data.getCursosMat.map(({ identificador, anio }) => (
                          <option key={identificador} value={identificador}>
                            {anio}
                          </option>
                        ))
                      : ""}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            {getDetalleCurso.data ?
            getDetalleCurso.data.getDetalleCurso.map(({ anio, materia, profesor, inscripciones_curso }) => (
              <Fragment key={anio}>
              <h1>Detalle de curso: {materia.nombre + " " + anio}</h1>
                <h4>A cargo del/la profesor/a: <strong>{profesor.persona.nombre + " " + profesor.persona.apellido}</strong></h4>
                <table className="table table-success">
                      <thead>
                        <tr>
                          <th scope="col">Alumno</th>
                          <th scope="col">Legajo</th>
                          <th scope="col">Fecha Inscripcion</th>
                          <th scope="col">Estado</th>
                          <th scope="col">Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                      {inscripciones_curso.map(
                    ({ identificador, alumno, fechainscripcion, nota, estado}) => (
                        <tr key={identificador} className="table-secondary">
                            <td>{alumno.persona.apellido + " " + alumno.persona.nombre}</td>
                            <td>{alumno.legajo}</td>
                            <td>{fechainscripcion}</td>
                            <td>{estado}</td>
                            <td>{nota}</td>
                          </tr>
                          )
                          )}
                      </tbody>
                    </table>
                </Fragment>
            ))
          : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detallecurso;
