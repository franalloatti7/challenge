export default (sequelize, { INTEGER, UUID, UUIDV4 }) => {
    const Alumno = sequelize.define('Alumno', {
        identificador: {
            primaryKey: true,
            allowNull: false,
            type: UUID,
            defaultValue: UUIDV4(),
        },
        idpersona: {
            type: UUID,
            unique: true,
            allowNull: false,
            references: {
                model: 'Persona', 
                key: 'identificador',
            }
        },
        legajo: {
            type: INTEGER,
            unique: 'legajo_unico',
            allowNull: false,
        }
    },
        {
            tableName: 'alumno'
        })
        Alumno.associate = models => {
            Alumno.belongsTo(models.Persona, {
                foreignKey: {
                    unique: true,
                    name: 'alumnos_idpersona_fkey',
                    field: 'idpersona'
                },
                as: 'persona',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Alumno.hasMany(models.Inscripciones_curso, {
                foreignKey: {
                    name: 'Alumno_idalumno_fkey',
                    field: 'idalumno'
                },
                as: 'inscripciones_curso',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }),
            Alumno.hasMany(models.Inscripciones_carrera, {
                foreignKey: {
                    name: 'Inscripciones_carreras_idalumno_fkey',
                    field: 'idalumno'
                },
                as: 'inscripciones_carrera',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    return Alumno
}