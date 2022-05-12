
const express = require('express');

const BookRouter = express.Router();

const bookController = require('../controllers/bookController');
const { isAdmin, AuthenticatorJWT } = require('../Middlewares/authenticator');


BookRouter.get('/', AuthenticatorJWT, isAdmin, bookController.getAllBooks);
BookRouter.post('/', AuthenticatorJWT, isAdmin, bookController.addBook);
BookRouter.delete('/:id', AuthenticatorJWT, isAdmin, bookController.deleteBook);
BookRouter.put('/:id', AuthenticatorJWT, isAdmin, bookController.updateBook);





module.exports = BookRouter;