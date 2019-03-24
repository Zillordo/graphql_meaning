const Coment = require('../../models/coment');
const {comentTransform} = require('./helpers');


module.exports = {
    coments: async () => {
        try {
            const coments = await Coment.find();

            return coments.map(coment => {
                return comentTransform(coment);
            });
        }
        catch (err) {
            throw err;
        }
    },


    createComent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Please sign in first');
        }
        try {
            const coment = new Coment({
                coment: args.comentInput.coment,
                creatorId: req.userId,
                bookId: args.comentInput.bookId
            });

            const result = await coment.save();
            return comentTransform(result);
        }
        catch (err) {
            throw err;
        }
    },

    deleteComent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Please sign in first');
        }
        try {
            await Coment.deleteOne({ _id: args.comentId });
            return null;
        }
        catch (err) {
            throw err;
        }
    },
};