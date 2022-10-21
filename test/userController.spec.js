const base = require('../controller/user');
const {user_game} = require('../models');
const axios = require('axios');

const mockRequest = (body = {}) => ({body});
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}


// Get All Data from User
describe('base.getAllData function', ()=>{

  // sucess to get ALl data
  it("would be return status:success, message: 'succes to get All data'", async ()=>{
    const req = mockRequest();
    const res = mockResponse();
    const users = await user_game.findAll();
    const data = await base.getAllData(req,res);
    expect(data.status).toHaveBeenCalledWith(200);
    expect(data.json).toHaveBeenCalledWith({
      status: "success",
      message: "success to get All data",
      data: users
    });
  })
})

// Get specific data user
describe('base.getDetailuser function', () => {
  const mockAxios = async (userId) => {
    try {
      return await axios.get(`http://localhost:3000/users/${userId}`, {validateStatus: false})
    } catch (error) {
      return error.message
    }
  }
  jest.mock('axios')
  // success to get specific data user
  it('would be return status: success, message: success to get specific user data', async () => {
    const user = {
      status: "success",
      message: "success to get specific user data",
      data: {
          id: 3,
          username: "sabrina2",
          password: "$2b$10$wplnX12wy7NU.b.bUcxnuuJE0AI9BINYzlLJr7shOJdg7XRGKdFaC",
          createdAt: "2022-09-23T03:52:54.863Z",
          updatedAt: "2022-09-23T03:52:54.863Z"
      }
    }
    const result = await mockAxios(3).then(res => {
      return {
        status: res.status,
        data: res.data
      }
    });
    expect(result.status).toEqual(200);
    expect(result.data).toEqual(user);
  })

  // Negative test, when user id not found
  it('would be return status: "failed", message: "data not found"', async () => {
    const result = await mockAxios(1000).then(res => {
      return {
        status: res.status,
        data: res.data
      }
    })
    expect(result.status).toEqual(404);
    expect(result.data).toEqual({
      status: 'failed',
      message: 'data not found',
    });
  })
})

// Update data user
describe('base.updateDataUser function', ()=>{
  const mockAxios = async (userId) => {
    try {
      return await axios.put(`http://localhost:3000/users/${userId}`, {username: 'new_username1234', password: 'inipassword_baru', validateStatus: false})
    } catch (error) {
      return error.message
    }
  }
  jest.mock('axios')

  // Success to edit data user 
  it('would to be success update data user with id: 9', async () => {
    const result = await mockAxios(9).then(res => {
      return {
        status: res.status,
        data: res.data,
      }
    })
    expect(result.status).toEqual(200);
    expect(result.data).toEqual({
      status: "success",
      message: "success to edit data user",
    })
  })
})
