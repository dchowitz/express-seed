import * as express from 'express'
import * as bodyParser from 'body-parser'
import passwordSecuredRoutes from './passwordSecuredRoutes'
import auth0SecuredRoutes from './auth0SecuredRoutes'
import counter from './counter'

export default function Api (): express.Express {
  const app = express()

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())

  app.get('/', async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>express-seed</title>
      </head>
      <body>
      <pre>
Hey you!

This is a dirty simple demonstration of HTTP APIs with Node.js express.

This page was visited ${await counter()} times...

Look here
  <a href="${req.baseUrl}/password-auth">${req.baseUrl}/password-auth</a>
and here
  <a href="${req.baseUrl}/auth0-auth">${req.baseUrl}/auth0-auth</a>
for authenticated routes.
      </pre>
      </body>
    </html>`)
    res.end()
  })

  app.get('/count', async (_, res) => {
    res.json({ count: await counter() })
  })

  app.use('/password-auth', passwordSecuredRoutes())
  app.use('/auth0-auth', auth0SecuredRoutes())

  return app
}
