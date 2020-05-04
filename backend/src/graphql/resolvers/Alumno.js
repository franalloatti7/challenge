export default {
  Query: {
    getAlumnos: (parent, args, { models }) => {
      return models.Alumno.findAll({
        include: [
          {
            model: models.Persona,
            as: "persona",
          },
        ],
      });
    },
    getAlumnosCurso: (parent, {idcurso}, { models }) => {
      return models.Alumno.findAll({
        include: [
          {
            model: models.Persona,
            as: "persona",
            required: true
          },
          {
            model: models.Inscripciones_curso,
            as: "inscripciones_curso",
            required: true,
            where: {idcurso},
          }
        ],
      });
    },
    getEstadoAcademico: (parent, { identificador }, { models }) => {
      return models.Alumno.findOne({
        where: { identificador },
        include: [
          {
            model: models.Persona,
            as: "persona",
          },
          {
            model: models.Inscripciones_curso,
            as: "inscripciones_curso",   
            required:false,
            where: { estado: 'inscripto' },
            include: {
              model: models.Curso,   
              required:false,
              as: "curso",
              include: {
                model: models.Materia,   
                required:false,
                as: "materia",
                include: {
                  model: models.Carrera,   
                  required:false,
                  as: "carrera",
                },
              },
            },
          },
          {
            model: models.Inscripciones_carrera,
            as: "inscripciones_carrera",
            include: {
              model: models.Carrera,
              as: "carrera",
            },
          },
        ],
      });
    },
    getAlumno: (parent, { identificador }, { models }) => {
      console.log(identificador);
      return models.Alumno.findByPk(identificador);
    },
  },
  Mutation: {
    createAlumno: (parent, { input }, { models }) =>
      models.Alumno.create({ ...input }),
    updateAlumno: (
      parent,
      { legajo, idpersona, identificador },
      { models }
    ) =>
     models.Alumno.update(
        { legajo, idpersona },
        { where: { identificador: identificador }, returning: true }
      ).then((data) => {
        console.log(data); 
      })
  },
};
