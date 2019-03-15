const {buildSchema} = require('graphql');

module.exports = buildSchema(`
type Book {
    _id: ID!
    title: String!
    author: String!
    question: String!
    creator: User!
}
type User {
    _id: ID!
    email: String!
    password: String!
    userName: String!
    createdBooks: [Book!]
}
type Coment {
    _id: ID!
    coment: String!
    creatorId: User!
    bookId: Book!
    createdAt: String!
    updatedAt: String!
}
type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}




input ComentInput {
    coment: String!
    bookId: String!
}
input BookInput {
    title: String!
    author: String!
    question: String!
}
input UserInput {
    email: String!
    password: String!
    userName: String!
}






type RootQuery {
    books: [Book!]!
    coments: [Coment!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createBook(bookInput: BookInput): Book
    createUser(userInput: UserInput): User
    createComent(comentInput: ComentInput): Coment!
    deleteComent(comentId: ID!): Book
}




schema {
    query: RootQuery
    mutation: RootMutation
}
`);