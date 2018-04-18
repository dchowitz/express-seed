import * as express from 'express'
import * as bodyParser from 'body-parser'
import passwordSecuredRoutes from './passwordSecuredRoutes'
import auth0SecuredRoutes from './auth0SecuredRoutes'
import counter from './counter'

export default function Api (): express.Express {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.get('/', async (_, res) => {
    res.json({ message: 'Hello Foo!', counter: await counter() })
  })

  app.use('/password-auth', passwordSecuredRoutes())
  app.use('/auth0-auth', auth0SecuredRoutes())

  return app
}
