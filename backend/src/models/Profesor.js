export default (sequelize, { STRING, INTEGER, UUID, UUIDV4 }) => {
  const Profesor = sequelize.define(
    "Profesor",
    {
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
          model: "Persona",
          key: "identificador",
        },
      },
      descripcion_cargo: {
          type: STRING(50),
          allowNull: false,
          validate: {
              len: {
                  args: [1, 50],
                  msg: 'Campo descripcion cargo máximo 50 caracteres'
              }
          }
      }
    },
    {
      tableName: "profesor",
    }
  );
    Profesor.associate = models => {
        Profesor.belongsTo(models.Persona, {
            foreignKey: {
                unique: true,
                name: 'profesores_idpersona_fkey',
                field: 'idpersona'
            },
            as: 'persona',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }),
        Profesor.hasOne(models.Curso, {
            foreignKey: {
                name: 'Profesor_idcurso_fkey',
                field: 'idprofesor'
            },
            as: 'profesor',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }
  return Profesor;
};
