const request = require('supertest');
const app = require('../app');
const {user_game} = require('../models')


const ranNum = Math.floor(Math.random() * (10000 - 1) + 1); 
const username = `new_username${ranNum}`
describe('POST /users/', ()=>{

  // success to add new user
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post('/users/')
    .send({username, password:'password_123'});
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to added new data user');
  })

  // failed to add new user, because username already used
  it('would be failed and return statusCode 400', async ()=>{
    const res = await request(app)
    .post('/users/')
    .send({username, password:'password_123'});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('username already used');
  })
})

describe('GET /users/', ()=>{

  // success get all data user
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .get('/users/')
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to get All data');
  })
})

describe('GET /users/:userId', ()=>{

  // success to get data using userId
  it('would be success and return statusCode 200', async ()=>{
    const user = await user_game.findOne({
      where: {username}
    });
    const res = await request(app)
    .get(`/users/${user.id}`)
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to get specific user data');
  })

  // failed to get specific user data because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .get(`/users/10000`)
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('data not found');
  })

})