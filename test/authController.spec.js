const base = require('../controller/auth');
const {user_game} = require('../models');

const mockRequest = (body = {}) => ({body});
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// endpoint POST /auth/register
describe('base.register function', ()=>{
  jest.setTimeout(30000);
  // case success
  it('res.json return summary of {status, message, data', async () => {
    const ranNum = Math.floor(Math.random() * (10000 - 1) + 1); 
    const username = `new_username${ranNum}`
    const req = mockRequest({username , password: "password_123"});
    const res = mockResponse();
    const data = await base.register(req, res);
    const user = await user_game.findOne({
      where: {
        username
      }
    });
    await expect(data.status).toHaveBeenCalledWith(201);
    await expect(data.json).toHaveBeenCalledWith({
      status: "success",
      message: 'success to added new data user',
      data: {
        id: user.id,
        username: user.username,
        password: user.password,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      }
    });
  })

  // Negative test, sistem can't add data if username already registered
  it('should return json with value : {status: "failed", message: "username already used"}',async ()=>{
    const req = mockRequest({username: "sabrina" , password: "password123"});
    const res = mockResponse();
    const data = await base.register(req,res);
    expect(data.status).toHaveBeenCalledWith(400);
    expect(data.json).toHaveBeenCalledWith({
      status: "failed",
      message: 'username already used'
    });
  })
})

// endpoint POST /auth/login
describe('base.login function', ()=>{

  // sucess to login
  it('would be return status:success', async ()=>{
    const req = mockRequest({username: 'sabrina' , password: "password_123"});
    const res = mockResponse();
    const data = await base.login(req,res);
    expect(data.status).toHaveBeenCalledWith(200);
    expect(data.json).toHaveBeenCalledWith({
      status: "success",
      message: "login success",
      data: {
        token: expect.anything()
      }
    })
  })

  // Negative test when username not found
  it('would be return status: "failed", message: username not found', async () => {
    const req = mockRequest({username: 'ini_ibu_budi' , password: "password123"});
    const res = mockResponse();
    const data = await base.login(req,res);
    expect(data.status).toHaveBeenCalledWith(404);
    expect(data.json).toHaveBeenCalledWith({
      status: 'failed',
      message: 'username not found'
    })
  })

  // Negative test when username and password did'nt match
  it('would be return status: "failed", message: username and password didn`t match', async () => {
    const req = mockRequest({username: 'sabrina' , password: "passwordSalah"});
    const res = mockResponse();
    const data = await base.login(req,res);
    expect(data.status).toHaveBeenCalledWith(403);
    expect(data.json).toHaveBeenCalledWith({
      status: 'failed',
      message: "username and password didn't match"
    })
  })
})