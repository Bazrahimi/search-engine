const { sign } = require('jsonwebtoken');
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Mutation: {
    // Existing createUser mutation
    createUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    
    // Corrected login mutation
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        // Make sure to provide a message when throwing an AuthenticationError
        throw new AuthenticationError('No user found with this email address');
      }

      // Check the provided password against the user's stored password
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        // Again, provide an error message
        throw new AuthenticationError('Incorrect credentials');
      }

      // Generate a token with the user object, not profile
      const token = signToken(user);
      return { token, user };
    }
  },
  // ... any other resolvers like Query or other types
};

module.exports = resolvers;
