import Sequelize from "sequelize";
const Op = Sequelize.Op;

export default {
  Query: {
    getCursos: (parent, args, { models }) => {
      return models.Curso.findAll({
        include: [
          {
            model: models.Profesor,
            as: "profesor",
            include: {
              model: models.Persona,
              as: "persona",
            },
          },
          {
            model: models.Materia,
            as: "materia",
            include: {
              model: models.Carrera,
              as: "carrera",
            },
          },
        ],
      });
    },
    getMisCursos: async (parent, { token }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(token);
        return models.Curso.findAll({
          include: [
            {
              model: models.Profesor,
              as: "profesor", 
              where: { identificador: persona.profesor.identificador },
           },
            {
              model: models.Materia,
              as: "materia",
           }
        ],
      });
    },
    getCursosPosibles: async (parent, {token}, { models }) => {
      let {persona} = await models.Persona.prototype.validToken(token);
      return models.Curso.findAll({
        include: [
          {
            model: models.Materia,
            as: "materia",
            required: true,
            include: {
              model: models.Carrera,
              as: "carrera",
              required: true,
              include: {
                model: models.Inscripciones_carrera,
                as: "inscripciones_carrera",
                required: true,
                where: { idalumno: persona.alumno.identificador},
              }
            },
          },
        ],
      });
    },
    getCursosMat: (parent, { idmateria }, { models }) => {
      return models.Curso.findAll({
        where: { idmateria },
        include: [
          {
            model: models.Materia,
            as: "materia",
            include: {
              model: models.Carrera,
              as: "carrera",
            },
          },
        ],
      });
    },
    getMisPromedios: (parent, { idalumno }, { models }) => {
      return models.Curso.findAll({
        attributes: ['materia->carrera.identificador'],
        include: [
          {
            model: models.Inscripciones_curso,
            as: "inscripciones_curso",
            required: true,
            where: { estado: {[Op.not]: 'inscripto'} },
          },
          {
            model: models.Materia,
            as: "materia",
            required: true,
            include: {
              model: models.Carrera,
              as: "carrera",
              required: true,
              include: {
                model: models.Inscripciones_carrera,
                as: "inscripciones_carrera",
                required: true,
                where: { idalumno },
              },
            },
          },
        ],
        group: ['materia->carrera.identificador']
      });
    },
    getDetalleCurso: (parent, { identificador }, { models }) => {
      return models.Curso.findAll({
        where: { identificador },
        include: [
          {
            model: models.Materia,
            as: "materia"
          },
          {
            model: models.Profesor,
            as: "profesor",
            include: {
              model: models.Persona,
              as: "persona",
            },
          },
          {
            model: models.Inscripciones_curso,
            as: "inscripciones_curso",
            include: {
              model: models.Alumno,
              as: "alumno",
              include: {
                model: models.Persona,
                as: "persona",
              },
            },
          },
        ],
      });
    },
    getCurso: (parent, { identificador }, { models }) => {
      console.log(identificador);
      return models.Curso.findByPk(identificador, {
        include: [
          {
            model: models.Materia,
            as: "materia",
            include: {
              model: models.Carrera,
              as: "carrera",
            },
          },
        ],
      });
    },
  },
  Mutation: {
    createCurso: (parent, { input }, { models }) =>
      models.Curso.create({ ...input }),
    updateCurso: (
      parent,
      { idmateria, cupomaximo, anio, idprofesor, identificador },
      { models }
    ) =>
       models.Curso.update(
        { idmateria, cupomaximo, anio, idprofesor },
        { where: { identificador: identificador }, returning: true }
      )
        .then(({ anio }) => {
          return anio;
        })
  },
};
