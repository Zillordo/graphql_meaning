

const Book = require('../../models/book');
const User = require('../../models/user');
const {dateToString} = require('../../helpers/date');

const singleBook = async bookId => {
    try {
        const book = await Book.findById(bookId);

        return { ...book._doc, _id: book.id, };
    }
    catch (err) {
        throw err;
    }
}

const books = async bookIds => {
    try {
        const books = await Book.find({ _id: { $in: bookIds } });

        return books.map(book => {
            return { ...book._doc, _id: book.id, creator: user.bind(this, book.creator) };
        });
    }
    catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);

        return { ...user._doc, _id: user.id, createdBooks: books.bind(this, user._doc.createdBooks) };
    }
    catch (err) {
        throw err;
    }
}

const comentTransform = result =>{
    return {
        ...result._doc,
        _id: result.id,
        creatorId: user.bind(this, result._doc.creatorId),
        bookId: singleBook.bind(this, result._doc.bookId),
        createdAt: dateToString(result._doc.createdAt),
        updatedAt: dateToString(result._doc.updatedAt),
    };
}

exports.user = user;
exports.comentTransform = comentTransform;
exports.books = books;
exports.singleBook = singleBook;