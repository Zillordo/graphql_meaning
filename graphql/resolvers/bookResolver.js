

const Book = require('../../models/book');
const User = require('../../models/user');
const {user} = require('./helpers');


module.exports = {
    books: async () => {
        try {
            const books = await Book.find();

            return books.map(book => {
                return { ...book._doc, _id: book.id, creator: user.bind(this, book._doc.creator) };
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    },

    createBook: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Please sign in first');
        }
        const book = new Book({
            title: args.bookInput.title,
            author: args.bookInput.author,
            question: args.bookInput.question,
            creator: req.userId
        });

        let createdBook;

        return book
            .save()
            .then(result => {
                createdBook = { ...result._doc, _id: result._doc._id.toString(), creator: user.bind(this, result._doc.creator) };
                return User.findById(req.userId);
            })
            .then(user => {
                if (!user) {
                    throw new Error('User doesnt exist.');
                }
                user.createdBooks.push(book);
                return user.save();
            })
            .then(() => createdBook)
            .catch(err => {
                console.log(err);
                throw err;
            });
    },
};