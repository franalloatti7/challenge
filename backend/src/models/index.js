import Sequelize from 'sequelize';


import { $db } from '../../config';


const { database, username, password, dialect } = $db();

const sequelize = new Sequelize(database, username, password, {
    dialect,
    define: {
        timestamps: false,
        underscored: true
    }
})

const models = {
    Alumno: sequelize.import('./Alumno'),
    Persona: sequelize.import('./Persona'),
    Inscripciones_curso: sequelize.import('./Inscripciones_curso'),
    Curso: sequelize.import('./Curso'),
    Inscripciones_carrera: sequelize.import('./Inscripciones_carrera'),
    Carrera: sequelize.import('./Carrera'),
    Profesor: sequelize.import('./Profesor'),
    Materia: sequelize.import('./Materia'),
}

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models)
    }
})

models.sequelize = sequelize

export default models