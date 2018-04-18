import * as asyncRedis from 'async-redis'

const port = process.env.REDIS_PORT
const host = process.env.REDIS_HOST
const client = asyncRedis.createClient(port, host)

export default async function count (): Promise<number> {
  return client.incr('counter')
}
