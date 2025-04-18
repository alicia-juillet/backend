const express = require('express');
const auth = require ('../middleware/auth');
const router = express.Router();
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/Book')

router.post('/', auth, multer, bookCtrl.createBook);
router.get('/', auth, bookCtrl.getAllBook);
router.get('/bestrating', auth, bookCtrl.getBestRatingBook);
router.get('/:id', auth, bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);

  

module.exports = router;