const express = require('express');
const router = express.Router();
const user = require('../controller/user');

router.get('/', user.getAllData);
router.get('/:userId', user.getDetailUser);
router.post('/', user.createNewUser);
router.put('/:userId', user.updateDataUser);
router.delete('/:userId', user.deleteDataUser);

module.exports = router;