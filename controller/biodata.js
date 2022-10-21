const {user_game_biodata} = require('../models');
const {user_game} = require('../models');
module.exports = {
  getBiodata: async(req, res) => {
    const {userId} = req.params;
    const biodata = await user_game_biodata.findOne({
      where:{user_id: userId}
    });
    return res.status(200).json({
      status: 'success',
      message: 'success get biodata user',
      data: biodata
    });
  },
  createBiodata : async (req, res) => {
    try {
      const {userId} = req.params;
      const {avatar, nickname, rank, level} = req.body;
      // Create new data
      const biodata = await user_game_biodata.create({
        user_id: +userId,
        avatar, nickname, rank, level
      });
      return res.status(200).json({
        status: 'success',
        message: 'success to add biodata',
        data: biodata
      })
    } catch (error) {
      console.log(error)
    }
  },
  updateBiodata: async (req, res) => {
    try {
      const {avatar, nickname, rank, level} = req.body;
      const {userId} = req.params;
      const newData = user_game_biodata.update({
        avatar, nickname, rank, level
      }, {
        where: { user_id : userId}
      })
      return res.status(200).json({
        status: 'success',
        message: 'success to edited data',
        data: newData
      })
    } catch (error) {
      console.log(error);
    }
  },
  deleteBiodata: async(req, res) => {
    const {userId} = req.params;
    await user_game_biodata.destroy({
      where: {user_id: userId}
    });
    return res.status(200).json({
      status: 'success',
      message: 'success to delete biodata user'
    });
  }
}