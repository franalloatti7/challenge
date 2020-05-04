export default {
  Query: {
    getProfesores: (parent, args, { models }) => {
      return models.Profesor.findAll({
        include: [
          {
            model: models.Persona,
            as: "persona",
          },
        ],
      });
    },
    getProfesor: (parent, { identificador }, { models }) => {
      console.log(identificador);
      return models.Profesor.findByPk(identificador);
    },
  },
  Mutation: {
    createProfesor: (parent, { input }, { models }) =>
      models.Profesor.create({ ...input }),
    updateProfesor: (
      parent,
      { descripcion_cargo, idpersona, identificador },
      { models }
    ) =>
      models.Profesor.update(
        { descripcion_cargo, idpersona },
        { where: { identificador: identificador }, returning: true }
      ).then(({data}) => {
        console.log(data); 
      })
  },
};
