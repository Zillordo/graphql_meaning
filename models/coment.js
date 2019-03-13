const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comentSchema = new Schema({
    coment: {
        type: String,
        required: true
    },
    creatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bookId: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Coment', comentSchema);