const {createNewUser} = require('./user');
const bcrypt = require('bcrypt');
const {user_game} = require('../models');
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET_KEY
} = process.env;

module.exports = {
  register: createNewUser,
  login: async (req, res) => {
    const {username, password} = req.body;
    const user = await user_game.findOne({
      where: {username}
    });
    if(!user){
      return res.status(404).json({
        status: 'failed',
        message: "username not found"
      });
    };
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    if(!passwordIsMatch){
      return res.status(403).json({
        status: 'failed',
        message: "username and password didn't match"
      });
    }
    const payload = {
      username: user.username,
      loginDate: new Date().toISOString(),
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY);
    return res.status(200).json({
      status: 'success',
      message: "login success",
      data: {
        token
      }
    });
  }
}