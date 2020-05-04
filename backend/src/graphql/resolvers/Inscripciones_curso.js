import Sequelize from "sequelize";
const Op = Sequelize.Op;

export default {
  Query: {
    getInscripciones_cursos: (parent, { idcurso }, { models }) => {
      return models.Inscripciones_curso.findAll({
        where: { idcurso },
        include: [
          {
            model: models.Alumno,
            as: "alumno",
          },
          {
            model: models.Curso,
            as: "curso",
            include: {
              model: models.Profesor,
              as: "profesor",
              include: {
                model: models.Persona,
                as: "persona",
              },
            },
          },
        ],
      });
    },
    getMisInscripciones: async (parent, { token }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(token);
      return models.Inscripciones_curso.findAll({
        where: { idalumno: persona.alumno.identificador },
        include: {
          model: models.Curso,
          as: "curso",
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
            },
          ],
        },
      });
    },
    getInscripcionesAnteriores: async (parent, { idalumno }, { models }) => {
      return models.Inscripciones_curso.findAll({
        where: { idalumno, estado: { [Op.not]: 'inscripto' }  },
        include: {
          model: models.Curso,
          as: "curso",
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
        },
      });
    },
    getInscripciones_curso: (parent, { identificador }, { models }) => {
      console.log(identificador);
      return models.Inscripciones_curso.findByPk(identificador);
    },
  },
  Mutation: {
    createInscripciones_curso: async (parent, { input }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(input.token);
      models.Inscripciones_curso.create({
        idcurso: input.idcurso,
        idalumno: persona.alumno.identificador,
        fechainscripcion: input.fechainscripcion,
        estado: input.estado,
      });
    },
    updateNotaAlumno: async (parent, { nota, estado, identificador, token }, { models }) => {
      console.log(nota, estado, identificador); await models.Inscripciones_curso.update({ nota, estado }, { where: { identificador: identificador }, returning: true })
        .then(({ estado }) => {
          return estado;
        })
        .catch((e) => console.log(e))
    },
  }
};
