const {user_game} = require('../models');
const bcrypt = require('bcrypt');
const SaltRounds = 10;

module.exports = {
  getAllData : async (req, res) => {
    try {
      const users = await user_game.findAll();
      if(users.length < 1 ){
        return res.status(404).json({
          status: 'failed',
          message: 'data not found',
        })
      }
      return res.status(200).json({
        status: 'success',
        message: 'success to get All data',
        data: users,
      })
    } catch (error) {
      console.log(error);
    }
  },
  getDetailUser: async(req, res) => {
    const {userId} = req.params;
    const user = await user_game.findOne({
      where: {id: userId}
    });
    if(!user){
      return res.status(404).json({
        status: 'failed',
        message: 'data not found',
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'success to get specific user data',
      data: user
    })
  },
  createNewUser: async(req, res) => {
    const {username, password} = req.body;
    const usernameExist = await user_game.findOne({
      where: {username}
    })
    if(usernameExist){
      return res.status(400).json({
        status: 'failed',
        message: 'username already used',
      })
    }
    const encryptedPassword = await bcrypt.hash(password, SaltRounds);
    const user = await user_game.create({
      username,
      password: encryptedPassword
    })
    return res.status(201).json({
      status: 'success',
      message: 'success to added new data user',
      data: {
        id: user.id,
        username: user.username,
        password: user.password,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt,
      }
    })
  }, updateDataUser: async(req, res) => {
    const {username, password} = req.body;
    const {userId} = req.params;
    const encryptedPassword = await bcrypt.hash(password, SaltRounds);
    await user_game.update({
      username,
      password: encryptedPassword
    }, {
      where: {id: userId}
    })
    res.status(200).json({
      status: 'success',
      message: 'success to edit data user',
    })
  }, deleteDataUser: async(req, res) => {
    const {userId} = req.params;
    await user_game.destroy({
      where: {id: userId}
    });
    return res.status(200).json({
      status: 'success',
      message: 'success to delete user'
    });
  }
}