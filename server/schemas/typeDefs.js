const typeDefs = `

type Query {
  _: Boolean
}

type Book {
  authors: [String]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
}

type User {
  _id: ID
  username: String
  email: String
  savedBooks: [Book]
}

type Auth {
  token: String
  user: User
}

type Mutation {
  createUser(username: String!, email: String!, password: String!): User
}


`;

module.exports = typeDefs;