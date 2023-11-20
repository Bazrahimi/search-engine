const typeDefs = `

type Query {
  me: User
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
  bookCount: Int
}

type Auth {
  token: ID
  user: User
}

type Mutation {
  saveBook ( input: savedBook! ): User
  removeBook ( bookId: ID! ): User
  createUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password:String!): Auth
}


input savedBook {
  bookId: String
  title: String
  authors: [String]
  description: String
  image: String
  link: String
}


`;

module.exports = typeDefs;