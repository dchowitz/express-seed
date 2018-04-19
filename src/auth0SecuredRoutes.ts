import * as express from 'express'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'

import * as request from 'request'

const checkJwt = jwt({
  // dynamically provide signing key based on KID in the header and signing keys provided by JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKSURI
  }),
  // validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ['RS256']
})

export default function auth0SecuredRoutes (): express.Router {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`<!DOCTYPE html><pre>
This showcases authentication with Auth0 service.

Routes:

GET ${req.baseUrl}/login
Performs a login attempt against Auth0 and returns an access token when successful.
This is just for demo purposes here and only useful for machine-to-machine scenarios.
A SPA will obtain the access token by itself.

GET ${req.baseUrl}/secret
Represents an endpoint which requires authentication in form of a bearer token.

</pre>`)

    res.end()
  })

  router.get('/login', (_, res) => {
    request.post(
      process.env.AUTH0_TOKEN_ENDPOINT,
      {
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          audience: process.env.AUTH0_AUDIENCE,
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET
        })
      },
      (err, _, body) => {
        res.json({ err, body: JSON.parse(body) })
      }
    )
  })

  router.get('/secured', checkJwt, (req, res) => {
    res.json({ message: 'ok', decodedJwt: req.user, body: req.body })
  })

  return router
}
