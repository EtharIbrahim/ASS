const Book = require('../models/bookModel');

const getAllBooks = async (req, res) => {
    console.log(req.user);
    let books;
    books = await Book.find();
    if (!books) {

        return res.status(404).send("No Book found");
    }
    return res.status(200).json({ books })

}

const addBook = async (req, res) => {
    const { title, author, description } = req.body;
    let book = new Book({

        title,
        author,
        description

    });
    await book.save();
    if (!book) {
        return res.status(500).send("unable to add a new book ");

    }
    return res.status(200).json({ book });
}

const updateBook = async (req, res) => {
    const id = req.params.id;
    const { title, author, description } = req.body;
    let book = await Book.findByIdAndUpdate(id, {
        title,
        author,
        description
    });
    if (!book) {
        return res.status(404).send('unable to find the book withthis id');
    }
    return res.status(200).json({ book });

}

const deleteBook = async (req, res) => {
    const id = req.params.id;
    let book = await Book.findByIdAndDelete(id);
    if (!book) {
        return res.status(404).send("Unable to delete a book with this id");
    }
    return res.status(200).json({ book });

}


exports.addBook = addBook;
exports.getAllBooks = getAllBooks;
exports.deleteBook = deleteBook;
exports.updateBook = updateBook;