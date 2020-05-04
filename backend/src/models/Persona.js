const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
export default (sequelize, { BIGINT, DATEONLY, STRING, UUID, UUIDV4 }) => {
  const Persona = sequelize.define(
    "Persona",
    {
      identificador: {
        primaryKey: true,
        allowNull: false,
        type: UUID,
        defaultValue: UUIDV4(),
      },
      tipodoc: {
        type: STRING(5),
        allowNull: false,
        validate: {
          len: {
            args: [1, 5],
            msg: "Campo tipodoc máximo 5 caracteres",
          },
        },
      },
      documento: {
        type: BIGINT,
        unique: {
          args: true,
          message: 'Username must be unique.',
        },
        allowNull: false,

      },
      nombre: {
        type: STRING(40),
        allowNull: false,
        validate: {
          len: {
            args: [1, 40],
            msg: "Campo nombre máximo 40 caracteres",
          },
        },
      },
      apellido: {
        type: STRING(40),
        allowNull: false,
        validate: {
          len: {
            args: [1, 40],
            msg: "Campo apellido máximo 40 caracteres",
          },
        },
      },
      fechanac: {
        type: DATEONLY,
        allowNull: false,
      },
      direccion: {
        type: STRING(200),
        allowNull: false,
        validate: {
          len: {
            args: [1, 200],
            msg: "Campo direccion máximo 200 caracteres",
          },
        },
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      token: {
        type: STRING,
        default: "asdasd",
      },
      admin: {
        type: STRING,
        defaultValue: "no",
      },
    },
    {
      tableName: "persona",
      instanceMethods: {
        validPassword: function (password) {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );

  Persona.beforeCreate((persona, options) => {
    return bcrypt
      .hash(persona.password, 10)
      .then((hash) => {
        persona.password = hash;
      })
      .catch((err) => {
        throw new Error();
      });
  });

  Persona.beforeUpdate((persona, options) => {
    return bcrypt
      .hash(persona.password, 10)
      .then((hash) => {
        persona.password = hash;
      })
      .catch((err) => {
        throw new Error();
      });
  });

  Persona.associate = (models) => {
    Persona.hasOne(models.Alumno, {
      foreignKey: {
        unique: true,
        name: "alumnos_idpersona_fkey",
        field: "idpersona",
      },
      as: "alumno",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    }),
      Persona.hasOne(models.Profesor, {
        foreignKey: {
          unique: true,
          name: "profesor_idprofesor_fkey",
          field: "idpersona",
        },
        as: "profesor",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
  };
  Persona.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };
  Persona.prototype.setPassword = function setPassword(password) {
    return bcrypt.hash(password, 10);
  };
  Persona.prototype.validToken = async function validToken(token) {
      let persona = await jwt.verify(token, "semilla-prueba");
      return persona;
  };
  return Persona;
};
