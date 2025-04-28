const express = require('express');
const auth = require ('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/Book')

router.post('/:id/rating', auth, bookCtrl.ratingBook);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', bookCtrl.getAllBook);
router.get('/bestrating', bookCtrl.getBestRatingBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);


  

module.exports = router;