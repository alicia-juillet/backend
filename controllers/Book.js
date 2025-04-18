const Book = require('../models/Book')

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      
  });
  console.log('bookObject:', bookObject);
  console.log('req.file:', req.file);
  book.save()
  .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getAllBook = (req, res, next) => {
    Book.find()
      .then(books => res.status(200).json(books))
      .catch(error => res.status(400).json({error}));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
      .then(books => res.status(200).json(books))
      .catch(error => res.status(404).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé.' });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Requête non autorisée.' });
      }
      Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé.' });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: 'Requête non autorisée.' });
      }
      Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.ratingBook = (req, res, next) => {
  const userId = req.body.userId;
  const rating = req.body.rating;
  const bookId = req.params.id;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
  }

  Book.findOne({ _id: bookId })
    .then(book => {
      if (!book) return res.status(404).json({ error: 'Livre non trouvé.' });

      if (book.ratings.some(r => r.userId === userId)) {
        return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
      }

      book.ratings.push({ userId, grade: rating });

      const update = book.ratings.reduce((acc, curr) => acc + curr.grade, 0);
      book.averageRating = update / book.ratings.length;

      book.save()
        .then(updatedBook => res.status(200).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.getBestRatingBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};