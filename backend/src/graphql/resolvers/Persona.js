const jwt = require("jsonwebtoken");

export default {
  Query: {
    getPersonas: (parent, args, { models }) => {
      return models.Persona.findAll({where: {admin: "no"}});
    },
    getPersonasTodas: (parent, args, { models }) => {
      return models.Persona.findAll();
    },
    getPersona: async (parent, { token, identificador }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(token);
      return models.Persona.findByPk(identificador);
    },
    getPersonaLogin: (parent, { documento, password }, { models }) => {
      return models.Persona.findOne({
        where: { documento },
        include: [
          {
            model: models.Profesor,
            as: "profesor",
          },
          {
            model: models.Alumno,
            as: "alumno",
          },
        ],
      }).then(function (persona) {
        if (!persona) {
          return null;
        } else if (!persona.validPassword(password)) {
          return null;
        } else {
          let token = jwt.sign(
            {
              persona,
            },
            "semilla-prueba",
            { expiresIn: "48h" }
          );
          persona.token = token;
          return persona;
        }
      });
    },
    getLogin: async (parent, { token }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(token);
      return persona;
    },
  },
  Mutation: {
    createDefault: (parent, args , { models }) =>
      models.Persona.create({ tipodoc: "DNI", documento: "12345678", nombre: "Super", apellido: "Admin", fechanac: "1989-07-29", direccion: "direccion", password: "challenge", admin: "si" }),
    createPersona: (parent, { input }, { models }) =>
      models.Persona.create({ ...input }),
    updatePersona: (
      parent,
      {
        tipodoc,
        documento,
        nombre,
        apellido,
        fechanac,
        direccion,
        identificador,
      },
      { models }
    ) =>
      models.Persona.update(
        { tipodoc, documento, nombre, apellido, fechanac, direccion },
        { where: { identificador: identificador }, returning: true }
      ).then(({ data }) => {
        console.log(data);
      }),
    updatePassword: async (parent, { token, newpassword }, { models }) => {
      let { persona } = await models.Persona.prototype.validToken(token);
      console.log(persona);
      models.Persona.update(
        { password: await models.Persona.prototype.setPassword(newpassword) },
        { where: { identificador: persona.identificador }, returning: true }
      ).then(({ data }) => {
        console.log(data);
      });
    },
  },
};
