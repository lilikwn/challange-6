const request = require('supertest');
const app = require('../app');
const {user_game} = require('../models');

const ranNum = Math.floor(Math.random() * (10000 - 1) + 1); 
const testUsername = `new_username${ranNum}`
const randomNumberNotFound = Math.floor(Math.random() * (50000 - 10001) + 10001);
const usernameNotFound = `username_salah${randomNumberNotFound}`
let gameHistoryId = null
let jwt = null;
let testingUserId = null

describe('POST /auth/register', ()=>{

  // success to add new user
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post('/auth/register')
    .send({username: testUsername, password:'password_123'});
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
    .send({username: testUsername, password:'password_123'});
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
      username: testUsername,
      password: 'password_123'
    });
    jwt = res.body.data.token;
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('login success');
  })
  it('would be failed and return 404', async () => {
    const res = await request(app).post('/auth/login').send({
      username: usernameNotFound,
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
      username: testUsername,
      password: 'wrong password'
    });
    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("username and password didn't match");
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
      where: {username: testUsername}
    });
    testingUserId = user.id;
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
    .get(`/users/${randomNumberNotFound}`)
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('data not found');
  })
});

// Update data users
describe('PUT /users/:userId', ()=>{

  // success to update data using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .put(`/users/${testingUserId}`).send({
      username: usernameNotFound,
      password: 'ini_passwordbaru'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to edit data user');
  })

  // failed to update specific user data because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .put(`/users/${randomNumberNotFound}`).send({
      username: usernameNotFound,
      password: 'ini_passwordbaru'
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('data not found');
  })
});

// 'POST /:idUser/biodata'
describe('POST /:idUser/biodata', ()=>{

  // success to add new user
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post(`/${testingUserId}/biodata`)
    .send({
      avatar:"avatar1",
      nickname:"nickname2",
      rank:"Mythic",level:30
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to add biodata');
  })

  // failed to add new biodata, because userid not found
  it('would be failed and return statusCode 400', async ()=>{
    const res = await request(app)
    .post(`/${randomNumberNotFound}/biodata`)
    .send({
      avatar:"avatar1",
      nickname:"nickname2",
      rank:"Mythic",level:30
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })

  // failed to add new biodata, because JWT not sign
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post(`/${testingUserId}/biodata`)
    .send({
      avatar:"avatar1",
      nickname:"nickname2",
      rank:"Mythic",level:30
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('token is required');
  })
})

// GET /:userId/biodata
describe('GET /userId/biodata', ()=>{

  // success to get biodata using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .get(`/${testingUserId}/biodata`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to get biodata user');
  })

  // failed to get specific user biodata because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .get(`/${randomNumberNotFound}/biodata`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })
});

// PUT /:userId/biodata
describe('PUT /userId/biodata', ()=>{

  // success to update biodata using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .put(`/${testingUserId}/biodata`).send({
      avatar:"new_avatar1",
      nickname:"new_nickname2",
      rank:"Mythical Glory",
      level:50
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to edited data');
  })

  // failed to update specific user biodata because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .put(`/${randomNumberNotFound}/biodata`).send({
      avatar:"new_avatar1",
      nickname:"new_nickname2",
      rank:"Mythical Glory",
      level:50
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })
});

// DELETE /:userId/biodata
describe('DELETE /userId/biodata', ()=>{

  // success to DELETE biodata using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .delete(`/${testingUserId}/biodata`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to delete biodata user');
  })

  // failed to DELETE specific user biodata because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .delete(`/${randomNumberNotFound}/biodata`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })
});


// 'POST /:idUser/history'
describe('POST /:idUser/history', ()=>{

  // success to add new user hitory game
  it('would be success and return statusCode 201', async ()=>{
    const res = await request(app)
    .post(`/${testingUserId}/history`)
    .send({
      score:10,
      is_win:true,
      match_type:"Rank",
      duration:600
    }).set("Authorization", `${jwt}`);
    gameHistoryId = res.body.data.id;
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to create user game history');
  });

  // failed to add new user game history, because userid not found
  it('would be failed and return statusCode 404', async ()=>{
    const res = await request(app)
    .post(`/${randomNumberNotFound}/history`)
    .send({
      score:10,
      is_win:true,
      match_type:"Rank",
      duration:600
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })

  // failed to add new user game history, because JWT not sign
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .post(`/${testingUserId}/history`)
    .send({
      score:10,
      is_win:true,
      match_type:"Rank",
      duration:600
    });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('token is required');
  })
})

// GET /:userId/history
describe('GET /userId/history', ()=>{

  // success to get histories using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .get(`/${testingUserId}/history`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to get game histories');
  })

  // failed to get user's histories game because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .get(`/${randomNumberNotFound}/history`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })
});

// PUT /:userId/history
describe('PUT /userId/history', ()=>{

  // success to update game history using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .put(`/${testingUserId}/history/${gameHistoryId}`).send({
      score: 0,
      is_win: false,
      match_type:"Classic",
      duration: 1200
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to edit game history');
  })

  // failed to update specific user's game history because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .put(`/${randomNumberNotFound}/history/${gameHistoryId}`).send({
      score:0,
      is_win:false,
      match_type:"Classic",
      duration:1200
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })

  // failed to update specific user's game history because game history ID is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .put(`/${testingUserId}/history/${randomNumberNotFound}`).send({
      score:0,
      is_win:false,
      match_type:"Classic",
      duration:1200
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('match is not found');
  });

  // failed to update specific user's game history because user doesn't have access
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .put(`/${randomNumberNotFound}/history/${gameHistoryId}`).send({
      score:0,
      is_win:false,
      match_type:"Classic",
      duration:1200
    }).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  });
});

// DELETE /:userId/history/:historyId
describe('DELETE /:userId/history/:historyId', ()=>{

  // success to DELETE user's game history using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .delete(`/${testingUserId}/history/${gameHistoryId}`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to delete game history');
  })

  // failed to DELETE specific user game history because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .delete(`/${randomNumberNotFound}/history/${gameHistoryId}`).set("Authorization", `${jwt}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe("user doesn't exist");
  })
});

// DELETE data user
describe('DELETE /users/:userId', ()=>{

  // success to delete data using userId
  it('would be success and return statusCode 200', async ()=>{
    const res = await request(app)
    .delete(`/users/${testingUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('success to delete user');
  })

  // failed to delte specific user data because userId is not found
  it('would be success and return statusCode 404', async ()=>{
    const res = await request(app)
    .delete(`/users/${testingUserId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.status).toBe('failed');
    expect(res.body.message).toBe('data not found');
  })
});