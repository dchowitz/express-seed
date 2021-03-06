import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

// TODO: use real DB
const users = [
  { id: 1, name: 'foo', pwd: 'test1' },
  { id: 2, name: 'bar', pwd: 'test2' },
  { id: 3, name: 'baz', pwd: 'test3' }
]

export default function passwordSecuredRoutes (): express.Router {
  const router = express.Router()
  router.use(authenticationHandler())

  router.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`<!DOCTYPE html><pre>
This showcases authentication with username and password via passport.

Routes:

POST ${req.baseUrl}/login
Payload: something like
{
	"name": "foo",
	"pwd": "test1"
}
Looks up a user and verifies the correct password. Then creates an access token
with which the secured routes can be accessed.

GET ${req.baseUrl}/secret
Represents an endpoint which requires authentication in form of a bearer token.

</pre>`)
    res.end()
  })

  router.post('/login', (req, res) => {
    const { name, pwd } = req.body
    // TODO: use real DB to look up user
    const user = users.find(u => u.name === name && u.pwd === pwd)
    if (!user) {
      res.status(401).json({ message: 'wrong credentials' })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, jwtOptions.secretOrKey)
    res.json({ message: 'ok', token })
  })

  router.get(
    '/secret',
    passport.authenticate('jwt', { session: false }),
    (_, res) => {
      res.json({ message: 'success, you cannot see this without a token' })
    }
  )

  return router
}

function authenticationHandler (): express.Handler {
  const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    console.log('jwt payload received', jwtPayload)
    // TODO: use real DB to look up user
    const user = users.find(u => u.id === jwtPayload.id)
    if (user) {
      next(null, user)
    } else {
      next(null, false)
    }
  })

  return passport.use(strategy).initialize()
}
