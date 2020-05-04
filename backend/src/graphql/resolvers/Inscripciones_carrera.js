export default {
  Query: {
    getInscripciones_carreras: (parent, args, { models }) => {
      return models.Inscripciones_carrera.findAll({
        include: [
          {
            model: models.Alumno,
            as: "alumno",
          },
        ],
        include: [
          {
            model: models.Carrera,
            as: "carrera",
          },
        ],
      });
    },
    getMisInscripcionesCar: async (parent, { token }, { models }) => {
      let {persona} = await models.Persona.prototype.validToken(token);
        return models.Inscripciones_carrera.findAll({
          where: { idalumno: persona.alumno.identificador },
          include: {
            model: models.Carrera,
            as: "carrera",
          },
        });
    },
    getPromedios: async (parent, { idalumno }, { models }) => {
        return models.Inscripciones_carrera.findAll({
          where: { idalumno },
          include: {
            model: models.Carrera,
            as: "carrera",
            required: true,
            include: {
              model: models.Materia,
              as: "materia",
              required: true,
              include: {
                model: models.Curso,
                as: "curso",
                required: true,
                include: {
                  model: models.Inscripciones_curso,
                  as: "inscripciones_curso",
                  required: true,
                },
              },
            },
          },
        });
    },
    getInscripciones_carrera: (parent, { identificador }, { models }) => {
      console.log(identificador);
      return models.Inscripciones_carrera.findByPk(identificador);
    },
  },
  Mutation: {
    createInscripciones_carrera: (parent, { input }, { models }) => {
      models.Persona.prototype
        .validToken(input.token)
        .then(({persona}) => {
          console.log(persona);
          return models.Inscripciones_carrera.create({ idcarrera: input.idcarrera, fechainscripcion: input.fechainscripcion, idalumno: persona.alumno.identificador }, {returning: true});
        })
        .catch((err) => console.log("Token invalido"));
    },
  },
};
