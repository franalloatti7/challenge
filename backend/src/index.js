//Dependencias
import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { $serverPort } from '../config';
//Modelos
import models from './models';
const jwt = require('jsonwebtoken')

//Types y Resolvers
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/types';

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

const getUserLoged = token => {
  try {
    if (token) {
      return jwt.verify(token, 'semilla-prueba')
    }
    return null
  } catch (err) {
    return null
  }
}

const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
        const token = req.headers.token || ''
        const userLoged = getUserLoged(token)
        return {
            userLoged,
            models
        }
      }
})

const alter = true
const force = false
const port = $serverPort();
models.sequelize.sync({ alter, force }).then(() => {
    apolloServer.listen(port).then(({ url }) => console.log(`Servidor corriendo en ${url}`))
})