const router = require('express').Router();
const bookModel = require('../model/book_model');
const books = require('../controller/books.controller');

router.get('/books', books.getBooks);
router.get('/books/:id', books.getBookById);

router.post('/books', books.bookUpload);

router.put('/books/:id', books.bookUpdate);

router.delete('/books/:id', books.bookDelete);

module.exports = router; 