const userResolver = require('./userResolver');
const comentResolver = require('./comentResolver');
const bookResolver = require('./bookResolver')

const rootResolver = {
    ...userResolver,
    ...comentResolver,
    ...bookResolver
};

module.exports = rootResolver;