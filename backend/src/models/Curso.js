export default (sequelize, {STRING, INTEGER, UUID, UUIDV4 }) => {
    const Curso = sequelize.define('Curso', {
        identificador: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4(),
        },
        idmateria: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'Materia', 
                key: 'identificador',
            }
        },
        idprofesor: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'Profesor', 
                key: 'identificador',
            }
        },
        cupomaximo: {
            type: INTEGER,
            allowNull: false,
        },
        anio: {
            type: INTEGER,
            allowNull: false,
        }
    },
        {
            tableName: 'curso'
        })
        Curso.associate = models => {
            Curso.hasMany(models.Inscripciones_curso, {
                foreignKey: {
                    name: 'Cursos_idcurso_fkey',
                    field: 'idcurso'
                },
                as: 'inscripciones_curso',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Curso.belongsTo(models.Materia, {
                foreignKey: {
                    name: 'alumnos_idmateria_fkey',
                    field: 'idmateria'
                },
                as: 'materia',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Curso.belongsTo(models.Profesor, {
                foreignKey: {
                    name: 'Cursos_idprofesor_fkey',
                    field: 'idprofesor'
                },
                as: 'profesor',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    return Curso
}