export default {
    Query: {
        getCarreras: (parent, args, { models }) => {
            return models.Carrera.findAll()
        },
        getCarrera: (parent, { identificador }, { models }) => {
            console.log(identificador);
            return models.Carrera.findByPk(identificador)
        }
    },
    Mutation: {
        createCarrera: (parent, { input }, { models }) => models.Carrera.create({...input}),
        updateCarrera: (parent, { nombre, descripcion, fechadesde, identificador }, { models }) => models.Carrera.update({ nombre, descripcion, fechadesde }, { where: { identificador: identificador }, returning: true })
            .then(({nombre}) => {
            return nombre;
        }),
        updateFechaCarrera: async (parent, {fechahasta, identificador }, { models }) => await models.Carrera.update({fechahasta} , { where: { identificador: identificador}, returning: true}).then(({fechahasta}) => {
            return fechahasta;
        }).catch(e => console.log(e))
    }
}