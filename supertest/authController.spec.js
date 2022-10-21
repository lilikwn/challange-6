const request = require('supertest');
const app = require('../app');

describe('POST /auth/register', ()=>{
  const ranNum = Math.floor(Math.random() * (10000 - 1) + 1); 
  const username = `new_username${ranNum}`

  // success to add new user
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post('/auth/register')
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
    .post('/auth/register')
    .send({username: 'sabrina', password:'password_123'});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('username already used');
  })
})

describe('POST /auth/login', ()=>{
  it('would be success and return 200', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'sabrina',
      password: 'password_123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('login success');
  })

  it('would be failed and return 404', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'sabrina_1000',
      password: 'password_123'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('username not found');
  })

  // Negative testing, when username and password didn't match
  it('would be failed and return 403', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'sabrina',
      password: 'password'
    });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("username and password didn't match");
  })
  app
})