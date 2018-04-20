import api from './api'
import * as request from 'supertest'

describe('GET /', () => {
  test('returns 200', () => {
    return request(api())
      .get('/')
      .expect(200)
  })
})

describe('GET /count', () => {
  test('increments', async () => {
    const apiTest = request(api())

    const response1 = await apiTest.get('/count')
    expect(response1.status).toBe(200)

    const response2 = await apiTest.get('/count')
    expect(response2.status).toBe(200)

    expect(response2.body.count).toBe(response1.body.count + 1)
  })
})

test('env variables exposed', () => {
  expect(process.env.REDIS_HOST).toBe('localhost')
})
