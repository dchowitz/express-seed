import * as express from 'express'
import * as jwt from 'express-jwt'
import * as jwksRsa from 'jwks-rsa'

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

  router.get('/secured', checkJwt, (req, res) => {
    res.json({ message: 'ok', decodedJwt: req.user, body: req.body })
  })

  return router
}
