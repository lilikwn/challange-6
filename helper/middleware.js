const jwt = require('jsonwebtoken');
const {user_game, user_game_biodata} = require('../models');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  mustLogin : async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      if(!token) {
        return res.status(404).json({
          status: 'failed',
          message: "token is required"
        });
      }
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message == 'jwt malformed') {
        return res.status(401).json({
            status: false,
            message: error.message,
            data: null
        });
      }
    }
  },
  isUserExist: async (req, res, next) => {
    try {
      const {userId} = req.params;
      const user = await user_game.findOne({
        where: {id : userId}
      })
      if(!user){
        return res.status(404).json({
          status: 'failed',
          message: "user doesn't exist",
        })
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }, isBiodataExist: async(req, res, next) => {
    // Check, is user biodata with same user_id exist ?
    try {
      const {userId} = req.params;
      const userBiodata = await user_game_biodata.findOne({
        where: {user_id: userId}
      });
      if(!userBiodata){
        return res.status(404).json({
          status: 'failed',
          message: `biodata for user with id:${userId} doesn't exist`,
        })
      }
      next();
    } catch (error) {
      console.log(error);
    }
  }
}