var express = require('express');
var router = express.Router();
const{index, actionCreate, actionEdit, actionDelete} = require('./controller')

router.get('/', index);
router.post('/create', actionCreate);
router.put('/edit/:id', actionEdit);
router.delete('/delete/:id', actionDelete);

module.exports = router;
