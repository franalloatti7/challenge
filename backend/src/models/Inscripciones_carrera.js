export default (sequelize, { DATEONLY, UUID, UUIDV4 }) => {
    const Inscripciones_carrera = sequelize.define('Inscripciones_carrera', {
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
        idcarrera: {
            type: UUID,
            allowNull: false,
            references: {
                model: 'Carrera', 
                key: 'identificador',
            }
        },
        fechainscripcion: {
            type: DATEONLY,
            allowNull: false,
        }
    },
        {
            tableName: 'inscripciones_carrera'
        })
        Inscripciones_carrera.associate = models => {
            Inscripciones_carrera.belongsTo(models.Alumno, {
                foreignKey: {
                    name: 'Inscripciones_carreras_idalumno_fkey',
                    field: 'idalumno'
                },
                as: 'alumno',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Inscripciones_carrera.belongsTo(models.Carrera, {
                foreignKey: {
                    name: 'Inscripciones_carreras_idcarrera_fkey',
                    field: 'idcarrera'
                },
                as: 'carrera',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    return Inscripciones_carrera
}