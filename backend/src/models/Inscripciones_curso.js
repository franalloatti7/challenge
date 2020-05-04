export default (sequelize, { DATEONLY, STRING, INTEGER, UUID, UUIDV4 }) => {
    const Inscripciones_curso = sequelize.define('Inscripciones_curso', {
        identificador: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4(),
        },
        idalumno: {
            allowNull: false,
            type: UUID,
            references: {
                model: 'Alumno', 
                key: 'identificador',
            }
        },
        idcurso: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'Curso', 
                key: 'identificador',
            }
        },
        fechainscripcion: {
            type: DATEONLY,
            allowNull: false,
        },
        nota: {
            type: INTEGER,
            allowNull: true,
        },
        estado: {
            type: STRING(40),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 40],
                    msg: 'Campo estado máximo 40 caracteres'
                }
            }
        }
    },
        {
            tableName: 'inscripciones_curso'
        })
        Inscripciones_curso.associate = models => {
            Inscripciones_curso.belongsTo(models.Alumno, {
                foreignKey: {
                    name: 'Inscripciones_cursos_idalumno_fkey',
                    field: 'idalumno'
                },
                as: 'alumno',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Inscripciones_curso.belongsTo(models.Curso, {
                foreignKey: {
                    name: 'Inscripciones_cursos_idcurso_fkey',
                    field: 'idcurso'
                },
                as: 'curso',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    return Inscripciones_curso
}