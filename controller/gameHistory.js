const {user_game_history: History} = require('../models');

module.exports = {
  getUserGameHistory: async (req, res) => {
    try {
      const {userId} = req.params;
      const gameHistories = await History.findAll({
        where: {user_id : userId}
      });
      if(gameHistories.length < 1){
        return res.status(404).json({
          status: 'failed',
          message: 'game history not found',
        })
      }
      return res.status(200).json({
        status: 'success',
        message: 'success to get game histories',
        data: gameHistories,
      })
    } catch (error) {
      console.log(error)
    }
  },
  createUserGameHistory: async (req, res) => {
    try {
      const {userId} = req.params;
      const {score, is_win, match_type, duration} = req.body;

      const history = await History.create({
        user_id: userId,
        score, is_win, match_type, duration
      });
      return res.status(201).json({
        status: 'success',
        message: 'success to create user game history',
        data: history,
      });
    } catch (error) {
      console.error(error.message);
    }
  },
  updateUserGameHistory: async (req, res) => {
    try {
      const { historyId, userId } = req.params;
      const {score, is_win, match_type, duration} = req.body;
      const history = await History.findOne({
        where: {id: historyId}
      });
      if(!history){
        return res.status(404).json({
          status: 'failed',
          message: 'match is not found'
        })
      }
      if(history.user_id != userId){
        return res.status(400).json({
          status: 'Failed',
          message: "You can't edit this game history"
        })
      }
      await history.update({
        score, is_win, match_type, duration
      })
      return res.status(200).json({
        status: 'success',
        message: 'success to edit game history',
        data: history
      })
    } catch (error) {
      console.log(error.message)
    }
  },
  deleteGameHistory: async (req, res) => {
    try {
      const { historyId, userId } = req.params;
      const history = await History.findOne({
        where: {id: historyId}
      });
      if(history.user_id != userId){
        return res.status(400).json({
          status: 'Failed',
          message: "You can't delete this game history"
        })
      }
      await history.destroy();
      return res.status(200).json({
        status: 'success',
        message: 'success to delete game history',
      })
    } catch (error) {
      console.log(error);
    }
  }
}