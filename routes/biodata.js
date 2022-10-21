const express = require('express');
const router = express.Router({mergeParams: true});
const { getBiodata, createBiodata, updateBiodata, deleteBiodata } = require('../controller/biodata');
const { isUserExist, isBiodataExist } = require('../helper/middleware');

router.get('/', isBiodataExist, getBiodata);
router.post('/', createBiodata);
router.put('/', isBiodataExist, updateBiodata);
router.delete('/', isBiodataExist, deleteBiodata);

module.exports = router;