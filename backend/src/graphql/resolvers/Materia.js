export default {
    Query: {
        getMaterias: (parent, args, { models }) => {
            return models.Materia.findAll({
                include: {
                    model: models.Carrera,
                    as: 'carrera'
                }
            })
        },
        getMateriasCar: (parent, {idcarrera}, { models }) => {
            return models.Materia.findAll({ where: {idcarrera},
                include: {
                    model: models.Carrera,
                    as: 'carrera'
                }
            })
        },
        getMateria: (parent, { identificador }, { models }) => {
            console.log(identificador);
            return models.Materia.findByPk(identificador)
        }
    },
    Mutation: {
        createMateria: (parent, { input }, { models }) => models.Materia.create({...input}),
        updateMateria: (parent, { idcarrera, nombre, descripcion, identificador }, { models }) => models.Materia.update({ idcarrera, nombre, descripcion }, { where: { identificador: identificador }, returning: true })
            .then(( {nombre} ) => {
            return nombre;
        })
    }
}