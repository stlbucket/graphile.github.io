# Basic Nuxt Setup
after creating a new nuxt project, postgraphile can be run as a serverMiddleware.
https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-servermiddleware#servermiddleware-vs-middleware

- create an */api* directory
- add /api/postgraphile
```
const { postgraphile } = require("postgraphile");
export default postgraphile(
  PG_CONNECTION_STRING,
  SCHEMAS,
  {
    watchPg: true,
    graphiql: true,
    enhanceGraphiql: true,
  }
)
```
- add to nuxt.config.js
```
  serverMiddleware: ['~/api/postgraphile']
```
