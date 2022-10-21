const express = require('express');
const { getUserGameHistory, createUserGameHistory, updateUserGameHistory, deleteGameHistory } = require('../controller/gameHistory');
const router = express.Router({mergeParams:true});

router.get('/', getUserGameHistory);
router.post('/', createUserGameHistory);
router.put('/:historyId', updateUserGameHistory);
router.delete('/:historyId', deleteGameHistory);

module.exports = router;