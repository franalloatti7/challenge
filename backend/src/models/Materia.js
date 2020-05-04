export default (sequelize, {STRING, UUID, UUIDV4 }) => {
    const Materia = sequelize.define('Materia', {
        identificador: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4(),
        },
        idcarrera: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'Carrera', 
                key: 'identificador',
            }
        },
        nombre: {
            type: STRING(40),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 40],
                    msg: 'Campo nombre máximo 40 caracteres'
                }
            }
        },
        descripcion: {
            type: STRING(250),
            allowNull: false,
            validate: {
                len: {
                    args: [1, 250],
                    msg: 'Campo descripción máximo 250 caracteres'
                }
            }
        }
    },
        {
            tableName: 'materia'
        })
        Materia.associate = models => {
            Materia.hasMany(models.Curso, {
                foreignKey: {
                    name: 'Materias_idMateria_fkey',
                    field: 'idmateria'
                },
                as: 'curso',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Materia.belongsTo(models.Carrera, {
                foreignKey: {
                    name: 'alumnos_idcarrera_fkey',
                    field: 'idcarrera'
                },
                as: 'carrera',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    return Materia
}