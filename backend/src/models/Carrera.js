export default (sequelize, {STRING, DATEONLY, UUID, UUIDV4 }) => {
    const Carrera = sequelize.define('Carrera', {
        identificador: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4(),
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
        },
        fechadesde: {
            type: DATEONLY,
            allowNull: false,
        },
        fechahasta: {
            type: DATEONLY,
            allowNull: true,
        }
    },
        {
            tableName: 'carrera'
        })
        Carrera.associate = models => {
            Carrera.hasMany(models.Materia, {
                foreignKey: {
                    name: 'alumnos_idcarrera_fkey',
                    field: 'idcarrera'
                },
                as: 'carrera',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Carrera.hasMany(models.Inscripciones_carrera, {
                foreignKey: {
                    name: 'inscripcion_idcarrera_fkey',
                    field: 'idcarrera'
                },
                as: 'inscripciones_carrera',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }) 
        }
    return Carrera
}