const typeDefs = `

type User {
  _id: ID
  username: String
  email: String,
  saveBooks: [bookSchema]
}

Type Mutation: {
  createUser(username: String!, email: String!, password: String!): Auth
}


`;