var express = require('express');
var router = express.Router();
const{ index, actionCreate, actionDelete } = require('./controller')
const multer = require('multer')
const os = require('os')

router.get('/', index);
router.post('/create', multer({dest: os.tmpdir()}).single('foto'), actionCreate);
router.delete('/delete/:id', actionDelete);

module.exports = router;
 