var express = require('express');
var router = express.Router();
const{ editUser } = require('./controller')
const multer = require('multer')
const os = require('os')

router.put('/edit/:id', multer({dest: os.tmpdir()}).single('foto'), editUser);

module.exports = router;
 