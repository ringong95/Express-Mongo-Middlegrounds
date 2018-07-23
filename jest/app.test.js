var request = require('supertest');
var json = require('./../testData/json')


const app = require('../app')

describe('Test the root path', () => {
  
  it('It should response the GET method', (done) => {
    return request('http://localhost:3001').get('/').expect(200, done)
  })
})
describe('Test the export path', () => {
  
  
  it('the post path should fail since no valid json was sent', (done) => {
    return request('http://localhost:3001').post('/export').send({
    name: 'john'
  }).set('Accept', 'application/json')
  .expect(418, done)
})
})
describe('Test the export path', () => {
  it('the post path should succeed since valid json is given', (done) => {
    return request('http://localhost:3001').post('/export').send({data:JSON.stringify(json)
  }).set('Accept', 'application/json')
  .expect(200, done)
  
})
})





